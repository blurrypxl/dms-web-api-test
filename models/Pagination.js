class Pagination {
  #data;
  #page;
  #limit;

  constructor(data, page = null, limit = null) {
    this.#data = data;
    this.#page = page;
    this.#limit = limit;
  }

  view() {
    let result = "";

    if (this.#page && this.#limit) {
      const startIndex = (this.#page - 1) * this.#limit;
      const endIndex = this.#page * this.#limit;
      result = this.#data.slice(startIndex, endIndex);
    }
    else if (!this.#page && !this.#limit) {
      result = this.#data;
    }

    return result;
  }
}

export default Pagination;
