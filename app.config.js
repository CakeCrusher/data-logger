export default {
  name: 'data-logger',
  version: '0.0.1',
  extra: {
    dbHost: process.env.DB_HOST
  },
  android: {
    package: "com.sebastians.datalogger"
  }
}