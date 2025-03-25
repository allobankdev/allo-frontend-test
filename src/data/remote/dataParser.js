export default class DataParser {
  static parse(response) {
    return JSON.parse(JSON.stringify(response.data));
  }
}
