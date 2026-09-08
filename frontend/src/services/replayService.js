import axios from "axios";

const BASE_URL = "http://localhost:5000/api/replay";

const startReplay = () => {
    return axios.post(`${BASE_URL}/start`);
};

export default {
    startReplay,
};