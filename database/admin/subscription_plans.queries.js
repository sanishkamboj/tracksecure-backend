const db = require('../connection')

// create subscription plan
module.exports.createSubscriptionPlan = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO subscription_plan SET ?'

    db.query(query, data, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

// read subscription plans
module.exports.getSubscriptionPlans = () =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM subscription_plan'

    db.query(query, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

// read a specific plan by iSPlanId
module.exports.getSubscriptionPlan = (iSPlanId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM subscription_plan WHERE iSPlanId = ? AND iStatus = 1'

    db.query(query, iSPlanId, (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

// delete a specific plan by iSPlanId
module.exports.deleteSubscriptionPlan = (iSPlanId) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM subscription_plan WHERE iSPlanId = ?'

    db.query(query, [iSPlanId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

// update a specific plan
module.exports.updatePlan = (iSPlanId, data) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE subscription_plan SET ? WHERE iSPlanId = ?'
    db.query(query, [data, iSPlanId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
