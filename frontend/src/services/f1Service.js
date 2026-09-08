import axios from "axios";

const API_URL = "http://localhost:5000/api/f1";

// Add request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
axios.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const f1Service = {
  // Insert initial F1 data
  async insertInitialData(season) {
    return (await axios.post(`${API_URL}/initial-data`, { season })).data;
},

async getConstructorsChampionship(year) {
    return (await axios.get(`${API_URL}/constructors/${year}`)).data;
},

async getDriversChampionship(year) {
    return (await axios.get(`${API_URL}/drivers/${year}`)).data;
},
async getRaces(year) {
    return (await axios.get(`${API_URL}/races/${year}`)).data;
},

async getPracticeSession(year, round, session) {
    return (
        await axios.get(`${API_URL}/practice/${year}/${round}/${session}`)
    ).data;
}
};

export default f1Service;
