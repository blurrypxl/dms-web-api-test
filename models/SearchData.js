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
    }
    else {
      result = this.#data.filter(item => item.pemohon === this.#pemohon || item.startDate === this.#startDate || item.endDate === this.#endDate || item.cabang == this.#cabang);
    }

    console.log(result);

    return result;
  }
}

export default SearchData;
