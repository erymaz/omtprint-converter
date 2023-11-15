import axios, { AxiosError } from "axios";

/* Define Axios instance */
const $http = axios.create({
  baseURL: process.env.VUE_APP_SERVICE_URL,
});

/* Handle loading property - Application Loading Indicator */
let requestsCounter = 0;
const requestLoadingHandler = ({ url }: any, type: string) => {
  if (type === "start") {
    requestsCounter++;
    if (requestsCounter === 1) {}
  } else if (type === "end") {
    requestsCounter--;
    if (requestsCounter <= 0) {}
  }
};

$http.interceptors.request.use(
  (config) => {
    requestLoadingHandler(config, "start");
    return config;
  },
  (error: AxiosError) => {
    const { config } = error;
    requestLoadingHandler(config, "end");
    return Promise.reject(error);
  }
);

$http.interceptors.response.use(
  (response) => {
    requestLoadingHandler(response.config, "end");
    return response;
  },
  (error: AxiosError) => {
    const { config } = error;
    requestLoadingHandler(config, "end");
    return Promise.reject(error);
  }
);

export default $http;
