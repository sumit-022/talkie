import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

if (!backendUrl) {
  throw new Error("Backend URL is not set");
}

const instance = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
});

export default instance;