/**
 * @typedef PlanData
 * @property {String} vPlanName Required. Name of plan
 * @property {Number} iUserLimit Required. User limit in a plan
 * @property {Number} iAssessmentLimit Required. Assessment limit in a plan
 * @property {String} dStartDate Required. Plan usage start date
 * @property {String} dEndDate Required.Plan usage end date
 * @property {Number} fAmount Required. Price of a plan
 */

const mailHelper = require('./mail.helper')

/**
 * Send a registration email to user
 * @param {String} to Email of a user to send email
 * @param {PlanData} planData Data of a plan to send to user
 * @returns {Promise}
 */
module.exports = async (to, token) => {
  try {
    const sentMail = await mailHelper.transport.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Tracksecure Password Reset',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
      >
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title></title>
          <link
            href="https://fonts.googleapis.com/css?family=Work+Sans"
            rel="stylesheet"
            type="text/css"
          />
          <style type="text/css">
            table,
            td {
              font-family: "Work Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
            }
          </style>
          <style type="text/css">
            html,
            body {
              margin: 0;
              padding: 0;
              background-color: #eeeeee;
            }
      
            table {
              border-collapse: collapse;
            }
      
            .iosfix a {
              color: #05a09a;
            }
      
            a {
              color: #05a09a;
              text-decoration: none;
            }
            a img {
              border-style: none;
            }
      
            table.button a,
            .row table .content table.button a {
              text-decoration: none;
            }
          </style>
          <style type="text/css">
            @media screen and (max-width: 400px) {
              .content-body-wrapper {
                min-width: 0 !important;
              }
      
              .block-on-small {
                display: block !important;
      
                width: 100% !important;
      
                padding-left: 0 !important;
      
                padding-right: 0 !important;
              }
      
              .left-on-small {
                text-align: left !important;
              }
      
              .center-on-small {
                text-align: center !important;
              }
      
              tr.border-bottom > td.no-border-on-small {
                border-bottom: none !important;
              }
            }
          </style>
        </head>
        <body>
          <table
            class="wrapper"
            style="
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              border-spacing: 0;
              color: #636363;
              width: 100%;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            "
            width="100%"
          >
            <tr>
              <td
                class="wrapper-left"
                style="
                  padding: 0;
                  border-spacing: 0;
                  background-color: #eeeeee;
                  font-size: 0px;
                "
              >
                &nbsp;
              </td>
              <td
                class="content-body-wrapper"
                style="
                  border-spacing: 0;
                  padding: 0 0px 0 0px;
                  width: 650px;
                  background-color: #f2f2f2;
                  min-width: 400px;
                "
                width="650"
              >
                <table
                  class="content-body"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    border-spacing: 0;
                    color: #636363;
                    width: 100%;
                  "
                  width="100%"
                >
                  <tr>
                    <td
                      class="row header"
                      bgcolor="#ffffff"
                      style="
                        border-spacing: 0;
                        padding: 0;
                        width: 100%;
                        text-align: center;
                        font-size: 0;
                      "
                      width="100%"
                    >
                      <table
                        class="col"
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          border-spacing: 0;
                          color: #636363;
                          max-width: 100%;
                          min-width: 100%;
                          width: 100%;
                          display: inline-table;
                          vertical-align: top;
                          text-align: left;
                        "
                        width="100%"
                      >
                        <tr>
                          <td style="padding: 0; border-spacing: 0;">
                            <table
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial,
                                  sans-serif;
                                border-spacing: 0;
                                color: #636363;
                                width: 100%;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="content"
                                  style="
                                    border-spacing: 0;
                                    font-size: 12px;
                                    line-height: 150%;
                                    padding: 30px;
                                  "
                                >
                                  <table
                                    style="
                                      font-family: 'Helvetica Neue', Helvetica, Arial,
                                        sans-serif;
                                      border-spacing: 0;
                                      color: #636363;
                                      width: 100%;
                                    "
                                    width="100%"
                                  >
                                    <tr>
                                      <td
                                        class="left"
                                        align="left"
                                        valign="top"
                                        width="120"
                                        style="
                                          padding: 0;
                                          border-spacing: 0;
                                          font-size: 12px;
                                          padding-right: 10px;
                                        "
                                      >
                                        <a href="https://tracksecureapp.com"
                                          ><img
                                            src="https://secure.tracksecureapp.com:4000/public/TrackSecure.png"
                                            width="248"
                                            alt=""
                                            style="
                                              border: 0;
                                              margin: 0;
                                              height: auto !important;
                                            "
                                        /></a>
                                      </td>
                                      <td
                                        class="right"
                                        align="right"
                                        valign="top"
                                        style="
                                          padding: 0;
                                          border-spacing: 0;
                                          font-size: 12px;
                                          padding-left: 10px;
                                        "
                                      >
                                        <table
                                          class="contact width-auto"
                                          style="
                                            font-family: 'Helvetica Neue', Helvetica,
                                              Arial, sans-serif;
                                            border-spacing: 0;
                                            color: #636363;
                                            width: auto;
                                          "
                                        >
                                          <tr>
                                            <td
                                              class="icon"
                                              width="10"
                                              valign="top"
                                              style="
                                                border-spacing: 0;
                                                padding: 3px;
                                                font-size: 12px;
                                                mso-line-height-rule: exactly;
                                                line-height: 16px;
                                                min-width: 10px;
                                              "
                                            >
                                            </td>
                                            <td
                                              valign="top"
                                              style="
                                                border-spacing: 0;
                                                padding: 3px;
                                                font-size: 12px;
                                                mso-line-height-rule: exactly;
                                                line-height: 16px;
                                              "
                                            >
                                              Email:
                                              <a
                                                href="mailto:admin@tracksecureapp.com"
                                                style="
                                                  color: #05a09a;
                                                  text-decoration: none;
                                                "
                                                >admin@tracksecureapp.com</a
                                              >
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="row header2"
                      bgcolor="#ffffff"
                      style="
                        border-spacing: 0;
                        padding: 0;
                        width: 100%;
                        text-align: center;
                        font-size: 0;
                      "
                      width="100%"
                    >
                      <table
                        class="col"
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          border-spacing: 0;
                          color: #636363;
                          max-width: 100%;
                          min-width: 100%;
                          width: 100%;
                          display: inline-table;
                          vertical-align: top;
                          text-align: left;
                        "
                        width="100%"
                      >
                        <tr>
                          <td style="padding: 0; border-spacing: 0;">
                            <table
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial,
                                  sans-serif;
                                border-spacing: 0;
                                color: #636363;
                                width: 100%;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="content padding-left-top"
                                  style="
                                    border-spacing: 0;
                                    font-size: 12px;
                                    line-height: 150%;
                                    padding: 30px 0 20px 30px;
                                  "
                                >
                                  <table
                                    style="
                                      font-family: 'Helvetica Neue', Helvetica, Arial,
                                        sans-serif;
                                      border-spacing: 0;
                                      color: #636363;
                                      width: 100%;
                                    "
                                    width="100%"
                                  >
                                    <tr>
                                      <td
                                        class="left"
                                        align="left"
                                        valign="top"
                                        style="
                                          border-spacing: 0;
                                          font-size: 12px;
                                          padding: 0 -1px 30px 0;
                                        "
                                      >
                                        You have made a password reset request.
                                        <br />
                                        Click
                                        <a
                                          href="https://secure.tracksecureapp.com/#/users/reset-password/${token}"
                                          >here</a
                                        >
                                        or the link below to reset your password.
                                        <br />
                                        <a
                                          href="https://secure.tracksecureapp.com/#/users/reset-password/${token}"
                                          >https://secure.tracksecureapp.com/#/users/reset-password/${token}</a>
                                        <br />
                                        <p>
                                          <strong
                                            >Link will be expired after 5 minutes.
                                            Please do not share this link with anyone.
                                            Consider deleting this email after
                                            password reset.</strong
                                          >
                                        </p>
                                      </td>
                                      <td
                                        class="right"
                                        align="right"
                                        valign="bottom"
                                        width="43%"
                                        style="
                                          padding: 0;
                                          border-spacing: 0;
                                          font-size: 12px;
                                        "
                                      >
                                        <img
                                          src="https://tracksecureapp.com/storage/email_img/registration-img.jpg"
                                          width="248"
                                          alt=""
                                          style="
                                            border: 0;
                                            max-width: 100%;
                                            margin: 0;
                                            height: auto !important;
                                          "
                                        />
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td
                class="wrapper-right"
                style="
                  padding: 0;
                  border-spacing: 0;
                  background-color: #eeeeee;
                  font-size: 0px;
                "
              >
                &nbsp;
              </td>
            </tr>
          </table>
        </body>
      </html>
`
    })
    if (sentMail) {
      console.log('Reset Password mail sent!')
    }
  } catch (error) {
    throw new Error(error.message)
  }
}
