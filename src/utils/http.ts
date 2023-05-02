import axios, { AxiosInstance } from "axios";
import { interceptorsRequest } from "./interceptorsRequest";
import { interceptorsResponse } from "./interceptorsResponse";

export const http: AxiosInstance = axios.create();
interceptorsRequest(http);
interceptorsResponse(http);
