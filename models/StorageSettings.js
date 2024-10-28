import Multer from 'multer';
import Path from 'path';
import { unlink } from 'node:fs';

class StorageSettings {
  constructor() { }

  removeFile(path) {
    unlink(path, function (err) {
      if (err) throw err;
    });
  }

  imageFiles() {
    return Multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads/permohonan_biaya');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + Path.extname(file.originalname));
      }
    });
  }

  async imageFileFilter(req, file, cb) {
    try {
      const extName = Path.extname(file.originalname).toLowerCase();
      const allowedExt = ['.jpg', '.jpeg', '.png'];
      const allowedMimeType = ['image/jpeg', 'image/png', 'application/octet-stream'];

      await (async function () {
        if (!allowedExt.includes(extName) && !allowedMimeType.includes(file.mimetype)) {
          const error = new Error('Only Image Extentions Format Allowed');
          error.status = 403;
          throw error;
        }
      })();

      cb(null, true);
    }
    catch (error) {
      cb(error, false);
    }
  }
}

export default StorageSettings;