import ConnectionSettings from './ConnectionSettings.js';
import Knex from 'knex';
import gid from 'generate-unique-id';
import timestamp from 'time-stamp';
import Multer from 'multer';

class Aid {
  #conn;
  #selectColumnsDetailView

  constructor() {
    this.#conn = new ConnectionSettings();
    this.#selectColumnsDetailView = [
      'permohonan_pembiayaan.id_permohonan_biaya',
      'permohonan_pembiayaan.jumlah_penghasilan',
      'permohonan_pembiayaan.jumlah_penghasilan_lainnya',
      'permohonan_pembiayaan.jangka_waktu',
      'permohonan_pembiayaan.tujuan_pembiayaan',
      'permohonan_pembiayaan.jumlah_permohonan',
      'permohonan_pembiayaan.path_scan_slip_gaji',
      'permohonan_pembiayaan.path_scan_npwp',
      'detail_nasabah.nama',
      'detail_nasabah.nik',
      'detail_nasabah.tempat_lahir',
      'detail_nasabah.tanggal_lahir',
      'detail_nasabah.jk',
      'detail_nasabah.status_perkawinan',
      'detail_nasabah.alamat_rumah',
      'detail_nasabah.kelurahan',
      'detail_nasabah.kabupaten',
      'detail_nasabah.kecamatan',
      'detail_nasabah.provinsi',
      'detail_nasabah.kode_pos',
      'detail_nasabah.no_rek',
      'detail_nasabah.email',
      'detail_nasabah.no_hp',
      'detail_nasabah.no_ktp',
      'detail_nasabah.scan_ktp',
      'detail_nasabah.nama_instansi',
      'detail_nasabah.no_instansi',
      'detail_nasabah.jabatan',
      'detail_nasabah.nip',
      'detail_nasabah.masa_kerja',
      'detail_nasabah.nama_atasan',
      'detail_nasabah.alamat_instansi',
      'detail_nasabah.scan_karpeg',
      'detail_nasabah.scan_taspen',
      'detail_nasabah.scan_sk80',
      'detail_nasabah.scan_sk100',
      'detail_nasabah.scan_sk_terakhir',
      'detail_pengajuan_biaya.nama_cabang',
      'detail_pengajuan_biaya.nama_capem',
      'detail_pengajuan_biaya.total_angsuran',
      'detail_pengajuan_biaya.jangka_waktu',
      'account_officer.nama_ao',
      'permohonan_pembiayaan.create_date',
      'permohonan_pembiayaan.create_time'
    ];
  }

  async read(req, res, next) {
    try {
      const sql = await Knex(this.#conn)
        .select(this.#selectColumnsDetailView)
        .from('permohonan_pembiayaan')
        .join('detail_nasabah', join => {
          join.on('permohonan_pembiayaan.id_nasabah', 'detail_nasabah.id_nasabah');
        })
        .join('detail_pengajuan_biaya', join => {
          join.on('permohonan_pembiayaan.id_pengajuan_biaya', 'detail_pengajuan_biaya.id_pengajuan_biaya');
        })
        .join('account_officer', join => {
          join.on('permohonan_pembiayaan.id_ao', 'account_officer.id_ao');
        });

      res.locals.allPermohonanBiaya = sql;
      next();
    }
    catch (error) {
      next(error);
    }
  }

  async readByID(req, res, next) {
    try {
      const sql = await Knex(this.#conn)
        .select(this.#selectColumnsDetailView)
        .from('permohonan_pembiayaan')
        .join('detail_nasabah', join => {
          join.on('permohonan_pembiayaan.id_nasabah', 'detail_nasabah.id_nasabah');
        })
        .join('detail_pengajuan_biaya', join => {
          join.on('permohonan_pembiayaan.id_pengajuan_biaya', 'detail_pengajuan_biaya.id_pengajuan_biaya');
        })
        .join('account_officer', join => {
          join.on('permohonan_pembiayaan.id_ao', 'account_officer.id_ao');
        })
        .where({ id_permohonan_pembiayaan: req.params.id_permohonan_pembiayaan });

      res.locals.permohonanBiaya = sql;
      next();
    }
    catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const gID = gid({ length: 12 });
      const gDate = timestamp('DD-MM-YYYY');
      const gTime = timestamp('HH:mm');

      await Knex
        .transaction(async trx => {
          const newIDNasabah = await Knex(this.#conn)
            .insert(
              {
                id_nasabah: gID,
                nama_nasabah: req.body.nama_nasabah,
                nik: req.body.nik,
                tempat_lahir: req.body.tempat_lahir,
                tanggal_lahir: req.body.tanggal_lahir,
                jenis_kelamin: req.body.jenis_kelamin,
                alamat_lengkap: req.body.alamat_lengkap,
                status_perkawinan: req.body.status_perkawinan,
                kelurahan: req.body.kelurahan,
                kecamatan: req.body.kecamatan,
                kabupaten: req.body.kabupaten,
                provinsi: req.body.provinsi,
                kode_pos: req.body.kode_pos,
                no_ktp: req.body.no_ktp,
                email: req.body.email,
                no_hp: req.body.no_hp,
                no_rek: req.body.no_rek,
                path_scan_ktp: res.locals.path_scan_ktp,
                create_date: gDate,
                create_time: gTime
              },
              'id_nasabah'
            )
            .into('nasabah')
            .transacting(trx);

          const newIDPengajuanBiaya = await Knex(this.#conn)
            .insert(
              {
                id_pengajuan_biaya: gID,
                id_nasabah: newIDNasabah[0],
                total_angsuran_pembiayaan: req.body.total_angsuran_pembiayaan,
                jangka_waktu: req.body.jangka_waktu,
                create_date: gDate,
                create_time: gTime
              },
              'id_pengajuan_biaya'
            )
            .into('pengajuan_biaya')
            .transacting(trx);

          const newIDCabang = await Knex(this.#conn)
            .insert(
              {
                id_cabang: gID,
                nama_cabang: req.body.nama_cabang,
                create_date: gDate,
                create_time: gTime
              },
              'id_cabang'
            )
            .into('cabang')
            .transacting(trx);

          await Knex(this.#conn)
            .insert(
              {
                id_capem: gID,
                id_cabang: newIDCabang[0],
                nama_capem: req.body.nama_capem,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('capem')
            .transacting(trx);

          await Knex(this.#conn)
            .insert(
              {
                id_permohonan_pembiayaan: gID,
                id_nasabah: newIDNasabah[0],
                id_pengajuan_biaya: newIDPengajuanBiaya[0],
                id_ao: res.locals.decoded.id_ao,
                jumlah_penghasilan: req.body.jumlah_penghasilan,
                jumlah_penghasilan_lainnya: req.body.jumlah_penghasilan_lainnya,
                jumlah_permohonan: req.body.jumlah_permohonan,
                jangka_waktu: req.body.jangka_waktu,
                tujuan_pembiayaan: req.body.tujuan_pembiayaan,
                path_scan_slip_gaji: req.body.patch_scan_slip_gaji,
                path_scan_npwp: req.body.path_scan_npwp,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('permohonan_pembiayaan')
            .transacting(trx);
        });

      res.locals.newPembiayaanData = 'Permohonan Pembiayaan Data berhasil ditambah';
      next();
    }
    catch (error) {
      next(error);
    }
  }
}

export default Aid;
