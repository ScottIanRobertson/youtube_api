import axios from "axios";
import { BASE_URL, axiosOptions } from "./apiConfig";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const fetchFromAPI = async (endpoint, retries = MAX_RETRIES) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${endpoint}`, axiosOptions);
    return data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      await new Promise((res) =>
        setTimeout(res, RETRY_DELAY * (MAX_RETRIES - retries + 1))
      );
      return fetchFromAPI(endpoint, retries - 1);
    } else {
      console.error("Error fetching data from API:", error);
      throw error;
    }
  }
};
