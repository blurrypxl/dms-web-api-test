import Knex from 'knex';
import ConnectionSettings from './ConnectionSettings.js';
// import { scryptSync } from 'node:crypto';
// import { promisify } from 'node:util';
// import gid from 'generate-unique-id';
// import timestamp from 'time-stamp';

class Accounts {
  // #scryptAsync;
  #conn;
  #selectColumnsForView;

  constructor() {
    // this.#scryptAsync = promisify(scryptSync);
    this.#conn = new ConnectionSettings().connection;
    this.#selectColumnsForView = [
      'id_ao',
      'name_ao',
      'username',
      'role',
      'create_date',
      'create_time'
    ];
  }

  async read(req, res, next) {
    try {
      const sql = await Knex(this.#conn)
        .select(this.#selectColumnsForView)
        .from('account_officer');

      res.locals.allDataAO = sql;
      next();
    }
    catch (error) {
      next(error);
    }
  }

  async readByID(req, res, next) {
    try {
      const sql = await Knex(this.#conn)
        .select(this.#selectColumnsForView)
        .from('account_officer')
        .where({ id_ao: req.params.id_ao });

      res.locals.dataAO = sql;
      next();
    }
    catch (error) {
      next(error);
    }
  }

  /*
  async create(req, res, next) {
    try {
      const saltPass = gid({ length: 8 });
      const hashedPass = await this.#scryptAsync(req.body.password, saltPass, 64);
      const sql = await Knex(this.#conn)
        .insert({
          id_account: req.body.id_account,
          id_employee: req.body.id_employee,
          username: req.body.username,
          salt: saltPass,
          password: hashedPass.toString('base64'),
          id_role: req.body.idRole,
          is_online: 0,
          added_by: res.locals.admin,
          added_at: timestamp('YYYY-MM-DD:HH:dd')
        },
          ['New account added'])
        .into('accounts');

      res.locals.createNewAccount = sql;
      next();
    }
    catch (error) {
      next(error);
    }
  }
  */
}

export default Accounts;
