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
      isLength: { options: { min: 8, max: 12 } },
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
        ...this.regularSchema(),
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
        ...this.regularSchema(),
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
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Nomor Handphone is not valid'
      },
      no_rek: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Nomor Rekening is not valid'
      }
    };
  }

  bodyReqPekerjaanNasabah() {
    return {
      nama_instansi: {
        ...this.regularSchema(),
        errorMessage: 'Nama Nasabah is not valid'
      },
      no_instansi: {
        ...this.regularSchema(),
        errorMessage: 'Nomor Instansi is not valid'
      },
      alamat_instansi: {
        ...this.regularSchema(),
        errorMessage: 'Nomor Instansi is not valid'
      },
      nip: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'NIP is not valid'
      },
      jabatan: {
        ...this.regularSchema(),
        errorMessage: 'Jabatan is not valid'
      },
      nama_atasan: {
        ...this.regularSchema(),
        errorMessage: 'Nama Atasan is not valid'
      },
      masa_kerja: {
        ...this.regularSchema(),
        errorMessage: 'Masa Kerja is not valid'
      }
    };
  }

  bodyReqPengajuanBiaya() {
    return {
      nama_cabang: {
        ...this.regularSchema(),
        errorMessage: 'Nama Cabang is not valid'
      },
      nama_capem: {
        ...this.regularSchema(),
        errorMessage: 'Nama Capem is not valid'
      },
      total_angsuran_pembiayaan: {
        ...this.regularSchema(),
        errorMessage: 'Total Angsuran is not valid'
      },
      jangka_waktu: {
        ...this.regularSchema(),
        errorMessage: 'Total Angsuran is not valid'
      }
    };
  }

  bodyReqPembiayaan() {
    return {
      jumlah_penghasilan: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Jumlah Penghasilan is not valid'
      },
      jumlah_penghasilan_lainnya: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Jumlah Penghasilan Lainnya is not valid'
      },
      jangka_waktu: {
        ...this.regularSchema(),
        trim: true,
        errorMessage: 'Jangka Waktu is not valid'
      },
      tujuan_pembiayaan: {
        ...this.regularSchema(),
        errorMessage: 'Tujuan Pembayaran is not valid'
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