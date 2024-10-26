import jwt from "jsonwebtoken";
import { scryptSync } from "node:crypto";
import { promisify } from "node:util";
import ConnectionSettings from "./ConnectionSettings.js";
import Knex from "knex";
import dotenv from 'dotenv';
dotenv.config();

class Auth {
  #secretKey;
  #conn
  #signAsync;
  #selectColumnsForAuth;

  constructor() {
    this.#secretKey = process.env.NODE_ENV === 'production' ? process.env.PROD_SECRET_KEY : process.env.DEV_SECRET_KEY;
    this.#conn = new ConnectionSettings().connection;
    this.#signAsync = promisify(jwt.sign);
    this.#selectColumnsForAuth = [
      'id_ao',
      'name_ao',
      'username',
      'salt',
      'password',
      'role'
    ];
  }

  async signIn(req, res, next) {
    try {
      // Getting account data by username
      const sql = await Knex(this.#conn)
        .select(this.#selectColumnsForAuth)
        .from('account_officer')
        .where({ username: req.body.username });

      // Hashing user input password
      const hashedUserPass = scryptSync(req.body.password, sql[0].salt, 64);

      // Comparing hashed user input password with hashed user password from db
      if (sql[0].password !== hashedUserPass.toString('base64')) {
        const error = new Error('Account is not authorized');
        error.status = 403;
        throw error;
      }

      // Creating JWT
      const token = await this.#signAsync({
        id_ao: sql[0].id_ao,
        name_ao: sql[0].name_ao,
        username: sql[0].username,
        role: sql[0].role
      },
        this.#secretKey,
        { expiresIn: '2h' });

      res.locals.token = token;
      next();
    }
    catch (error) {
      next(error);
    }
  }
}

export default Auth;
