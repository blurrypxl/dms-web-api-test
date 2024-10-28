class SearchData {
  #data;
  #pemohon;
  #startDate;
  #endDate;
  #cabang;

  constructor(data, pemohon = null, startDate = null, endDate = null, cabang = null) {
    this.#data = data;
    this.#pemohon = pemohon;
    this.#startDate = startDate;
    this.#endDate = endDate;
    this.#cabang = cabang;
  }

  viewSearch() {
    let result = "";

    if (!this.#pemohon && !this.#startDate && !this.#endDate && !this.#cabang) {
      result = this.#data;
      return result;
    }

    result = this.#data.filter(item => item.nama === this.#pemohon && item.nama_cabang == this.#cabang || item.create_date === this.#startDate || item.create_date === this.#endDate);

    console.log(result);

    return result;
  }
}

export default SearchData;
