const cron = require('node-cron')
const moment = require('moment')

// db
const dbOrganization = require('../../database/admin/organization_mas.queries')
const dbSubscriptionTransaction = require('../../database/admin/subscription_plan_transaction.queries')
const dbSubscriptionPlans = require('../../database/admin/subscription_plans.queries')
const dbSubscriptionCC = require('../../database/admin/subscription_cc.queries')

// helpers
const mailHelper = require('../nodemailer/mail.helper')
const paysimplePaymentsHelper = require('../paysimple/payments.helper')

// utils
const IsNull = require('../../utils/IsNull')

const cronExpression = '0 0 0 * * *' // to run every night at 12AM

const planUpgrade = async (iSPlanId, iOrganizationId, vOrganizationEmail, vOrderId, createdPayment, planDetails) => {
  try {
    const dStartDate = moment().format('YYYY-MM-DD')
    const newPlanDays = planDetails.iTotalDays
    const dDate = moment().format('YYYY-MM-DD hh:mm:ss')
    const dEndDate = moment().add(newPlanDays, 'days').format('YYYY-MM-DD')
    const { fPrice, iAssessmentLimit, iTotalDays, iUserLimit, vPlanName } = planDetails
    // upgrade txn and done!
    const upgradedPlan = {
      dDate,
      dEndDate,
      dStartDate,
      fAmount: fPrice,
      iAssessmentLimit,
      iSPlanId,
      iTotalDays,
      iUserLimit,
      vPaysimplePaymentId: createdPayment.Id,
      vPlanName,
      vTransactionId: createdPayment.Id
    }
    await dbSubscriptionTransaction.updateTransaction(
      upgradedPlan,
      {
        ...upgradedPlan,
        iOrganizationId,
        iStatus: 1,
        tNotes: 'Plan upgraded',
        vOrderId,
        vPayType: 'CC'
      },
      vOrderId
    )
    await mailHelper.sendRenewalMail(
      vOrganizationEmail,
      {
        dEndDate,
        dStartDate,
        fAmount: fPrice,
        iAssessmentLimit,
        iUserLimit,
        vPlanName
      }
    )
    // send email from here
    console.log(`Auto-renewal done for the organization id ${iOrganizationId} with plan amount ${fPrice}.`)
    console.log('=======================================================')
  } catch (error) {
    throw new Error(error.message)
  }
}

const func = async () => {
  try {
    console.log('processing subscriptionEnd cron...')
    console.log('getting subscriptions...')
    const txns = await dbSubscriptionTransaction.getTodaysTransactions()
    if (txns.length === 0) {
      console.log('no subscription ends today!')
    }
    for (let i = 0, len = txns.length; i < len; i++) {
      console.log('=======================================================')
      const { iOrganizationId, vOrderId, iSPlanId } = txns[i]
      const org = await dbOrganization.getOrganization(iOrganizationId)
      if (IsNull(org)) {
        console.log(`organization with id ${iOrganizationId} not found...`)
        continue
      }
      console.log(`getting subscription by order id ${vOrderId}...`)
      const oldPlan = await dbSubscriptionTransaction.getTransactionByvOrderId(vOrderId)
      if (IsNull(oldPlan)) {
        console.log(`subscription with order id ${vOrderId} not found. Skipping...`)
        continue
      }
      console.log(`getting plan details with plan id ${iSPlanId} from subscription with order id ${vOrderId}...`)
      const planDetails = await dbSubscriptionPlans.getSubscriptionPlan(iSPlanId)
      if (IsNull(planDetails)) {
        console.log(`plan details with plan id ${iSPlanId} not found. Skipping...`)
        continue
      }
      if (planDetails.fPrice === 0) {
        console.log('Need to send user an email about free plan upgrade. Skipping for now...')
        continue
      }
      const ccDetails = await dbSubscriptionCC.getCCDetails(iOrganizationId)
      if (IsNull(ccDetails)) {
        console.log(`Credit card details not found for organization id ${iOrganizationId}. Skipping...`)
        continue
      }
      const createdPayment = await paysimplePaymentsHelper.newPayment({
        AccountId: ccDetails.vPaysimpleCCId,
        Amount: planDetails.fPrice,
        SuccessReceiptOptions: {
          SendToCustomer: true,
          SendToOtherAddresses: ['rahultrivedi180@gmail.com']
        }
      })
      if (createdPayment.Status === 'Failed') {
        console.log('Payment failed for plan renewal. Skipping...')
        continue
      }
      await planUpgrade(iSPlanId, iOrganizationId, org.vOrganizationEmail, vOrderId, createdPayment, planDetails)
    }
  } catch (error) {
    if (error.response) {
      console.log('cron paysimple error: ', error.response.statusText)
    } else {
      console.log(error)
      console.log('cron error: ', error.message)
    }
  }
}

const task = cron.schedule(cronExpression, () => { func() })

module.exports = {
  start: task.start,
  stop: task.stop,
  destroy: task.destroy
}
