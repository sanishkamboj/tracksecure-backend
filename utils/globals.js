const p = process.env
module.exports = {
  localdb: {
    host: p.LOCAL_DB_HOST,
    user: p.LOCAL_DB_USER,
    password: p.LOCAL_DB_PASSWORD,
    database: p.LOCAL_DB_DATABASE
  },
  remotedb: {
    host: p.DB_HOST,
    user: p.DB_USER,
    password: p.DB_PASSWORD,
    database: p.DB_DATABASE
  },
  PAYSIMPLE_TEST: {
    url: p.PAYSIMPLE_TEST_URL,
    userId: p.PAYSIMPLE_TEST_USERID,
    apiKey: p.PAYSIMPLE_TEST_API_KEY
  },
  JWT_SECRET: p.JWT_SECRET,
  AWS_ACCESS_KEY: p.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: p.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET: p.AWS_BUCKET,
  ENCRYPTION_KEY: Buffer.from(p.ENCRYPTION_KEY, 'hex')
}
