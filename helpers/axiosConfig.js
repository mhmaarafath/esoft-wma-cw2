import axios from "axios";
import GlobalVariables from "../utils/GlobalVariables";

const axiosConfig = axios.create({
    baseURL: GlobalVariables.baseURL,
});

export default axiosConfig;