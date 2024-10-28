import ConnectionSettings from './ConnectionSettings.js';
import Knex from 'knex';
import gid from 'generate-unique-id';
import timestamp from 'time-stamp';
import path from 'path';

class Aid {
  #conn;
  #selectColumnsDetailView

  constructor() {
    this.#conn = new ConnectionSettings().connection;
    this.#selectColumnsDetailView = [
      'permohonan_pembiayaan.id_permohonan_biaya',
      'permohonan_pembiayaan.jumlah_penghasilan',
      'permohonan_pembiayaan.jumlah_penghasilan_lainnya',
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
      'account_officer.name_ao',
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
        .where({ id_permohonan_biaya: req.params.id_permohonan_biaya });

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
      const newIDNasabah = gid({ length: 12 });
      const newIDPengajuanBiaya = gid({ length: 12 });
      const newIDCabang = gid({ length: 12 });
      const newIDCapem = gid({ length: 12 });
      const gPermohonanBiayaID = timestamp('YYYYMMDD') + gid({ length: 4, useNumbers: true, useLetters: false });
      const gDate = timestamp('DD-MM-YYYY');
      const gTime = timestamp('HH:mm');

      console.log(req.body);
      console.log(gPermohonanBiayaID);

      await Knex(this.#conn)
        .transaction(async trx => {
          // Insert data nasabah baru
          await Knex(this.#conn)
            .insert(
              {
                id_nasabah: newIDNasabah,
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
                path_scan_ktp: req.files['scan_ktp'][0].destination + '/' + req.files['scan_ktp'][0].filename,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('nasabah')
            .transacting(trx);

          console.log(!req.files['scan_sk80']);

          await Knex(this.#conn)
            .insert(
              {
                id_pekerjaan_nasabah: gID,
                id_nasabah: newIDNasabah,
                nama_instansi: req.body.nama_instansi,
                no_instansi: req.body.no_instansi,
                alamat_instansi: req.body.alamat_instansi,
                nip: req.body.nip,
                jabatan: req.body.jabatan,
                nama_atasan: req.body.nama_atasan,
                masa_kerja: req.body.masa_kerja,
                path_scan_karpeg: !req.files['scan_karpeg'] ?
                  null : req.files['scan_karpeg'][0].destination + '/' + req.files['scan_karpeg'][0].filename,
                path_scan_taspen: !req.files['scan_taspen'] ?
                  null : req.files['scan_taspen'][0].destination + '/' + req.files['scan_taspen'][0].filename,
                path_scan_sk80: !req.files['scan_sk80'] ?
                  null : req.files['scan_sk80'][0].destination + '/' + req.files['scan_sk80'][0].filename,
                path_scan_sk100: !req.files['scan_sk100'] ?
                  null : req.files['scan_sk100'][0].destination + '/' + req.files['scan_sk100'][0].filename,
                path_scan_sk_terakhir: !req.files['scan_sk_terakhir'] ?
                  null : req.files['scan_sk_terakhir'][0].destination + '/' + req.files['scan_sk_terakhir'][0].filename,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('pekerjaan_nasabah')
            .transacting(trx);

          await Knex(this.#conn)
            .insert(
              {
                id_capem: newIDCapem,
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
                id_cabang: newIDCabang,
                nama_cabang: req.body.nama_cabang,
                id_capem: newIDCapem,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('cabang')
            .transacting(trx);

          await Knex(this.#conn)
            .insert(
              {
                id_pengajuan_biaya: newIDPengajuanBiaya,
                id_cabang: newIDCabang,
                total_angsuran_pembiayaan: req.body.total_angsuran_pembiayaan,
                jangka_waktu: req.body.jangka_waktu,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('pengajuan_biaya')
            .transacting(trx);

          await Knex(this.#conn)
            .insert(
              {
                id_permohonan_biaya: gPermohonanBiayaID,
                id_nasabah: newIDNasabah,
                id_pengajuan_biaya: newIDPengajuanBiaya,
                id_ao: res.locals.ao.id_ao,
                jumlah_penghasilan: req.body.jumlah_penghasilan,
                jumlah_penghasilan_lainnya: req.body.jumlah_penghasilan_lainnya,
                jumlah_permohonan: req.body.jumlah_permohonan,
                tujuan_pembiayaan: req.body.tujuan_pembiayaan,
                path_scan_slip_gaji: req.files['scan_slip_gaji'][0].destination + '/' + req.files['scan_slip_gaji'][0].filename,
                path_scan_npwp: req.files['scan_npwp'][0].destination + '/' + req.files['scan_npwp'][0].filename,
                create_date: gDate,
                create_time: gTime
              }
            )
            .into('permohonan_pembiayaan')
            .transacting(trx);
        });

      res.locals.newPembiayaanData = 'Permohonan Pembiayaan Data berhasil ditambah';
      console.log(res.locals.newPembiayaanData);

      next();
    }
    catch (error) {
      next(error);
    }
  }
}

export default Aid;
