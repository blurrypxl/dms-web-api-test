import { Router } from 'express';
import { checkSchema } from 'express-validator';
import jwt from 'jsonwebtoken';
import InputValidator from '../models/InputValidator.js';
import Pagination from '../models/Pagination.js';
import SearchData from '../models/SearchData.js';
import Errors from '../models/Errors.js';
import Aid from '../models/Aid.js';
import Multer from 'multer';
import StorageSettings from '../models/StorageSettings.js';

const route = Router();
const secretKey = process.env.NODE_ENV === 'production' ? process.env.PROD_SECRET_KEY : process.env.DEV_SECRET_KEY;
const inputValidator = new InputValidator();
const aid = new Aid();
const error = new Errors();
const storageSettings = new StorageSettings();
const uploads = Multer({
  storage: storageSettings.imageFiles(),
  fileFilter: storageSettings.imageFileFilter.bind(storageSettings),
  limits: { fileSize: 10 * 1024 * 1024 } // 2 mb
})
  .fields(
    [
      { name: 'scan_ktp', maxCount: 1 },
      { name: 'scan_karpeg', maxCount: 1 },
      { name: 'scan_taspen', maxCount: 1 },
      { name: 'scan_sk80', maxCount: 1 },
      { name: 'scan_sk100', maxCount: 1 },
      { name: 'scan_sk_terakhir', maxCount: 1 },
      { name: 'scan_npwp', maxCount: 1 },
      { name: 'scan_slip_gaji', maxCount: 1 }
    ]
  );

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
    // Search Data Middleware
    const pemohon = req.query.pemohon;
    const tanggalAwal = req.query.start_date;
    const tanggalAkhir = req.query.end_date;
    const cabang = req.query.cabang;
    const noKtp = req.query.noKtp;
    const data = res.locals.allPermohonanBiaya;
    const searchData = new SearchData(data, pemohon, tanggalAwal, tanggalAkhir, cabang, noKtp);
    res.locals.resultData = searchData.viewSearch();
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

route.get(
  '/find-by-id/:id_permohonan_biaya',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    },
    id_permohonan_biaya: {
      ...inputValidator.idSchema(),
      errorMessage: 'ID Permohonan Biaya is not valid'
    }
  }),
  error.inputValidation.bind(error),
  aid.readByID.bind(aid),
  (req, res) => {
    res.status(200).json(res.locals.permohonanBiaya);
  }
);

route.post(
  '/add-new',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    }
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

      res.locals.ao = decoded;
      next();
    }
    catch (error) {
      next(error);
    }
  },
  (req, res, next) => {
    // Upload Images Middleware
    uploads(req, res, (err) => {
      if (err instanceof Multer.MulterError) {
        // A Multer error occurred when uploading.
        const error = new Error(err);
        next(error);
      }
      else if (err) {
        // An unknown error occurred when uploading.
        const error = new Error(err);
        next(error);
      }

      next();
    });
  },
  checkSchema({
    ...inputValidator.bodyReqNasabahSchema(),
    ...inputValidator.bodyReqPekerjaanNasabah(),
    ...inputValidator.bodyReqPengajuanBiaya(),
    ...inputValidator.bodyReqPembiayaan()
  }),
  error.inputValidationWithMulter.bind(error),
  aid.create.bind(aid),
  (req, res) => {
    console.log(res.locals.ao);
    res.status(200).json({ message: res.locals.newPembiayaanData });
  }
);

export default route;
