
const nodemailer = require('nodemailer')
//module.exports.transport = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//    user: process.env.MAIL_USER,
//    pass: process.env.MAIL_PASS
//  }
//})

module.exports.transport = nodemailer.createTransport({
    port: 465,
    host: 'smtp.mail.us-east-1.awsapps.com',
    secure: true,
    auth: {
      user: 'admin@tracksecureapp.com',
      pass: 'Shared123#'
    }
})

module.exports = {
  sendRegistrationMail: require('./registerationMail.helper'),
  sendForgotPasswordMail: require('./forgotPasswordMail.helper'),
  sendOrgUserRegistrationMail: require('./orgUserRegistrationMail.helper'),
  sendRenewalMail: require('./renewSubscriptionMail.helper'),
  sendResetLinkMail: require('./passwordResetLinkMail.helper'),
  send2FAOTPMail: require('./2FAOTP.helper')
}
