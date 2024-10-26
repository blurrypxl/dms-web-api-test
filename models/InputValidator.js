class InputValidator {
  constructor() { }

  authSchema() {
    return {
      isString: { bail: true },
      isEmpty: false,
      trim: true,
      errorMessage: 'User is not authorized'
    };
  }

  idSchema() {
    return {
      isString: { bail: true },
      isLength: { options: { min: 8, max: 8 } },
      isEmpty: false,
      trim: true
    };
  }

  passSchema() {
    return {
      isString: { bail: true },
      isEmpty: false,
      trim: true,
      errorMessage: 'Password is not valid'
    };
  }

  regularSchema() {
    return {
      isString: { bail: true },
      isEmpty: false,
    };
  }

  regularIntSchema() {
    return {
      isInt: { bail: true },
      isEmpty: false
    }
  }

  #queryIntSchema() {
    return {
      isInt: { bail: true },
      optional: true,
      trim: true
    };
  }

  #queryStringSchema() {
    return {
      isString: { bail: true },
      optional: true,
      trim: true
    };
  }

  bodyReqNasabahSchema() {
    return {
      nama_nasabah: {
        ...this.regularSchema(),
        errorMessage: 'Nama Nasabah is not valid'
      },
      nik: {
        ...this.regularIntSchema(),
        trim: true,
        isLength: { min: 16 },
        errorMessage: 'NIK is not valid'
      },
      tempat_lahir: {
        ...this.regularSchema(),
        errorMessage: 'Tempat Lahir is not valid'
      },
      tanggal_lahir: {
        ...this.regularSchema(),
        errorMessage: 'Tanggal Lahir is not valid'
      },
      jenis_kelamin: {
        ...this.regularSchema(),
        errorMessage: 'Jenis Kelamin is not valid'
      },
      alamat_lengkap: {
        ...this.regularSchema(),
        errorMessage: 'Alamat Lengkap is not valid'
      },
      status_perkawinan: {
        ...this.regularSchema(),
        errorMessage: 'Status Perkawinan is not valid'
      },
      kelurahan: {
        ...this.regularSchema(),
        errorMessage: 'Kelurahan is not valid'
      },
      kecamatan: {
        ...this.regularSchema(),
        errorMessage: 'Kecamatan is not valid'
      },
      kabupaten: {
        ...this.regularSchema(),
        errorMessage: 'Kabupaten is not valid'
      },
      provinsi: {
        ...this.regularSchema(),
        errorMessage: 'Provinsi is not valid'
      },
      kode_pos: {
        ...this.regularIntSchema(),
        trim: true,
        errorMessage: 'Kode Pos is not valid'
      },
      no_ktp: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Nomor KTP is not valid'
      },
      email: {
        ...this.regularSchema(),
        isEmail: true,
        trim: true,
        errorMessage: 'Email is not valid'
      },
      no_hp: {
        ...this.regularIntSchema(),
        trim: true,
        errorMessage: 'Nomor Handphone is not valid'
      },
      no_rek: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Nomor Rekening is not valid'
      },
      scan_ktp: {
        ...this.regularSchema(),
        errorMessage: 'Scan KTP is not valid'
      }
    };
  }

  bodyReqPengajuanBiaya() {
    return {
      id_cabang: {
        ...this.idSchema(),
        errorMessage: 'ID Cabang is not valid'
      },
      total_angsuran_pembiayaan: {
        ...this.#queryIntSchema(),
        errorMessage: 'Total Angsuran is not valid'
      },
      jangka_waktu: {
        ...this.#queryIntSchema(),
        errorMessage: 'Total Angsuran is not valid'
      }
    };
  }

  bodyReqPembiayaan() {
    return {
      jumlah_penghasilan: {
        ...this.regularIntSchema(),
        trim: true,
        errorMessage: 'Jumlah Penghasilan is not valid'
      },
      jumlah_penghasilan_lainnya: {
        ...this.regularIntSchema(),
        trim: true,
        errorMessage: 'Jumlah Penghasilan Lainnya is not valid'
      },
      jangka_waktu: {
        ...this.regularIntSchema(),
        trim: true,
        errorMessage: 'Jangka Waktu is not valid'
      },
      tujuan_pembiayaan: {
        ...this.regularSchema(),
        errorMessage: 'Tujuan Pembayaran is not valid'
      },
      scan_slip_gaji: {
        ...this.regularSchema(),
        errorMessage: 'Scan Slip Gaji is not valid'
      },
      scan_npwp: {
        ...this.regularSchema(),
        errorMessage: 'Scan NPWP is not valid'
      }
    };
  }

  queryValidatorSchema() {
    return {
      pemohon: {
        ...this.#queryStringSchema(),
        errorMessage: 'Query Pemohon is not valid'
      },
      startDate: {
        ...this.#queryIntSchema(),
        errorMessage: 'Query Tanggal Aplikasi - Start Date is not valid'
      },
      endDate: {
        ...this.#queryIntSchema(),
        errorMessage: 'Query Tanggal Aplikasi - End Date is not valid'
      },
      cabang: {
        ...this.#queryStringSchema(),
        errorMessage: 'Query Cabang is not valid'
      },
      noKtp: {
        ...this.#queryIntSchema(),
        errorMessage: 'Query Nomor KTP Date is not valid'
      },
      page: {
        ...this.#queryIntSchema(),
        errorMessage: 'Query Page is not valid'
      },
      limit: {
        ...this.#queryIntSchema(),
        errorMessage: 'Query Limit is not valid'
      }
    };
  }
}

export default InputValidator;