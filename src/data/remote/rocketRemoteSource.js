import axios from "axios";
import parser from "./dataParser";

const baseUrl = 'https://api.spacexdata.com/v4/rockets';

export default class RocketRemoteSource {
  static async getAllRockets() {
    const result = await axios.get(baseUrl).then((response) => {
      return parser.parse(response);
    });

    return result;
  }
  static async getRocketById(id) {
    var url = baseUrl + "/" + id;

    const result = await axios.get(url).then((response) => {
      return parser.parse(response);
    });

    return result;
  }
}
