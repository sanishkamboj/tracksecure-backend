const uid = require('uniqid')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
var pdf = require('html-pdf')

const TrackSecurePng = require('../../public/TrackSecurePNG')

// queries
const dbInvoice = require('../../database/admin/invoice.queries')

// utils
const isNull = require('../../utils/isNull')
const ApiResponse = require('../../utils/ApiResponse')

module.exports.generateInvoice = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { vOrderId } = req.params
    const { iSTranId } = req.query
    if (isNull(iSTranId)) {
      apiResponse.message = 'Transaction id is required'
      return res.status(400).json(apiResponse)
    }
    const invoice = uid()
    const invoiceData = await dbInvoice.getInvoiceData(vOrderId, iSTranId)
    if (isNull(invoiceData)) {
      apiResponse.message = 'Invoice not found'
      return res.status(400).json(apiResponse)
    }
    const dStartDate = moment(invoiceData.dStartDate).format('YYYY-MM-DD')
    const dEndDate = moment(invoiceData.dEndDate).format('YYYY-MM-DD')
    const html = `<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style>
      BODY {
        font-size: 9pt;
        font-family: Arial, Helvetica, sans-serif;
      }

      TD {
        font-size: 9pt;
        font-family: Arial, Helvetica, sans-serif;
      }
      A {
        font-size: 9pt;
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
    <table
      width="100%"
      border="0"
      cellspacing="0"
      align="center"
      cellpadding="0"
      style="width: 830px; margin: auto; margin-top: 10px"
    >
      <tbody>
        <tr>
          <td>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td>
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              src="${TrackSecurePng}"
                              width="30%"
                            />
                          </td>
                          <td align="right" width="23%">
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style="
                                line-height: 20px;
                                font-weight: normal;
                                font-size: 13px;
                                margin-top: 10px;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td width="20%">Invoice:</td>
                                  <td colspan="2">${invoice}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table
                      width="830"
                      border="0"
                      cellspacing="10"
                      cellpadding="0"
                      style="border: 1px solid #cccccc; margin-top: 0"
                      align="center"
                    >
                      <tbody>
                        <tr>
                          <td colspan="2">
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <strong style="font-size: 12pt"
                                      >Order ID: ${invoiceData.vOrderId}</strong
                                    >
                                  </td>
                                  <td align="right"><!-- <img src=""> --></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div style="margin: 10px 0">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                style="padding: 10px; border: 1px solid #e8e8e8"
                                width="100%"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style="font-size: 13px; line-height: 20px"
                                      width="70%"
                                    >
                                      <strong>Billing Address:</strong><br />
                                      ${invoiceData.vOrganizationAddress ?
        invoiceData.vOrganizationAddress : '-'}
                                    </td>
                                    <td valign="top">
                                      <table
                                        width="100%"
                                        border="0"
                                        cellspacing="0"
                                        cellpadding="0"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                              nowrap=""
                                              align="left"
                                            >
                                              Order Date
                                            </td>
                                            <td width="5%">:</td>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              ${dStartDate}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              Organization
                                            </td>
                                            <td>:</td>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              ${invoiceData.vOrganizationName}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              Payment Method
                                            </td>
                                            <td>:</td>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              ${invoiceData.vPayType}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              Transaction ID
                                            </td>
                                            <td>:</td>
                                            <td
                                              style="
                                                font-size: 13px;
                                                line-height: 20px;
                                              "
                                            >
                                              ${invoiceData.vTransactionId ?
        invoiceData.vTransactionId : '-'}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              class="border:1px solid #f1f2f5; background-color:#ffffff; padding:1px;"
                            >
                              <tbody>
                                <tr
                                  style="
                                    background: #ededed;
                                    font-size: 13px;
                                    line-height: 30px;
                                    text-align: center;
                                    color: #333333;
                                    margin-bottom: 10px;
                                  "
                                >
                                  <th align="left" style="padding-left: 10px">
                                    Plan Details
                                  </th>
                                  <th>Amount</th>
                                  <th align="right">Total&nbsp;&nbsp;&nbsp;</th>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      padding: 10px;
                                      border: 1px solid #e8e8e8;
                                    "
                                  >
                                    <strong>${invoiceData.vPlanName}</strong>
                                    <div style="margin-top: 5px">
                                      <strong>User Limit: </strong
                                      >${invoiceData.iUserLimit}
                                      <br />
                                      <strong>Assessment Limit: </strong
                                      >${invoiceData.iAssessmentLimit}
                                      <br />
                                      <strong>Plan Usage Start Date: </strong
                                      >${dStartDate}
                                      <br />
                                      <strong
                                        >Plan usage end Date Limit: </strong
                                      >${dEndDate}
                                      <br />
                                      <strong>Total Usage Days: </strong
                                      >${invoiceData.iTotalDays}
                                      <br />
                                    </div>
                                  </td>
                                  <td
                                    style="
                                      padding: 10px;
                                      border: 1px solid #e8e8e8;
                                    "
                                    align="center"
                                  >
                                    $${invoiceData.fAmount}
                                  </td>
                                  <td
                                    style="
                                      padding: 10px;
                                      border: 1px solid #e8e8e8;
                                    "
                                    align="right"
                                    width="25%"
                                  >
                                    $${invoiceData.fAmount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              width="25%"
                              align="right"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style="padding-right: 10px; padding-top: 5px"
                            >
                              <tbody>
                                <tr>
                                  <td height="25">
                                    <strong>Order Total</strong>
                                  </td>
                                  <td align="right">:</td>
                                  <td align="right">
                                    <strong>$${invoiceData.fAmount}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border-bottom: 1px dotted #bebebe;
                              line-height: 5px;
                            "
                          >
                            &nbsp;
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <br />Thanks &amp; Regards<br /><br />Customer
                            Service <br />Tracksecure Team
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
    pdf
      .create(html, { format: 'A3' })
      .toFile('./public/invoice.pdf', function (err, file) {
        if (err) return console.log(err)
        res.download(
          path.resolve('./public/invoice.pdf'),
          'invoice.pdf',
          {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + 'invoice.pdf'
          }
        )
      })
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
