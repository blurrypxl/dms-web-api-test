import dotenv from 'dotenv';
dotenv.config();

class ConnectionSettings {
  constructor() {
    this.connection = {
      client: 'mysql',
      connection: {
        host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST_PROD : 'localhost',
        port: process.env.NODE_ENV === 'production' ? process.env.DB_PORT_PROD : 3306,
        user: process.env.NODE_ENV === 'production' ? process.env.DB_USER_PROD : 'root',
        password: process.env.NODE_ENV === 'production' ? process.env.DB_PASS_PROD : '',
        database: process.env.NODE_ENV === 'production' ? process.env.DB_NAME_PROD : 'dms_db'
      }
    }
  }
}

export default ConnectionSettings;