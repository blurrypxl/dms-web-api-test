import { Router } from 'express';
import { checkSchema } from 'express-validator';
import jwt from 'jsonwebtoken';
import InputValidator from '../models/InputValidator.js';
import Pagination from '../models/Pagination.js';
import SearchData from '../models/SearchData.js';
import Errors from '../models/Errors.js';
import Aid from '../models/Aid.js';

const route = Router();
const secretKey = process.env.NODE_ENV === 'production' ? process.env.PROD_SECRET_KEY : process.env.DEV_SECRET_KEY;
const inputValidator = new InputValidator();
const aid = new Aid();
const error = new Errors();

route.get(
  '/find-all',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    },
    ...inputValidator.queryValidatorSchema()
  }),
  error.inputValidation.bind(error),
  (req, res, next) => {
    try {
      // Decoding JWT
      const decoded = jwt.verify(req.cookies.auth, secretKey);

      // Comparing role user
      if (decoded.role !== 'admin') {
        const error = new Error('Account Officer is not authorized');
        error.status = 401;
        throw error;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  },
  aid.read.bind(aid),
  (req, res, next) => {
    // Pencarian Data Middleware
    const pemohon = req.query.pemohon;
    const tanggalAwal = req.query.startDate;
    const tanggalAkhir = req.query.endDate;
    const cabang = req.query.cabang;
    const noKtp = req.query.noKtp;
    const data = res.locals.allPermohonanBiaya;
    const searchData = new SearchData(data, pemohon, tanggalAwal, tanggalAkhir, cabang, noKtp);
    res.locals.resultData = searchData;
    next();
  },
  (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const result = res.locals.resultData;
    const pagination = new Pagination(result, page, limit);
    res.status(200).json(pagination.view());
  }
);

route.post(
  '/add-new',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    },
    ...inputValidator.bodyReqNasabahSchema(),
    ...inputValidator.bodyReqPengajuanBiaya(),
    ...inputValidator.bodyReqPembiayaan()
  }),
  error.inputValidation.bind(error),
  (req, res, next) => {
    // Validating Account Officer
    try {
      // Decoding JWT
      const decoded = jwt.verify(req.cookies.auth, secretKey);

      // Comparing role user
      if (decoded.role !== 'admin') {
        const error = new Error('Account Officer is not authorized');
        error.status = 401;
        throw error;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  },
  aid.create.bind(aid),
  (req, res) => {
    res.status.json({ message: res.locals.newPembiayaanData });
  }
);

export default route;