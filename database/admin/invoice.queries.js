const db = require('../connection')

module.exports.getInvoiceData = (vOrderId, iSTranId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT st.*, om.vOrganizationName, om.vOrganizationAddress FROM subscription_transaction_history st JOIN organization_mas om ON om.iOrganizationId = st.iOrganizationId WHERE st.vOrderId = ? AND iSTranId = ?'

    db.query(query, [vOrderId, iSTranId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })
