import axios from 'axios';

const DEFAULT_TIMEOUT = 60 * 1000;

let axiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT,
});

/**
 * HTTP axios instance
 *
 * @note This instance is preconfigured with baseUrl by default.
 * If you wish to change to relative url, (e.g for Next.js api routes), set `baseUrl` as `/`
 */
export const http = axiosInstance;
