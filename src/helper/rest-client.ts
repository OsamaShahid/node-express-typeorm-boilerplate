import axios, { AxiosRequestConfig, Method, AxiosRequestHeaders } from "axios";
import qs from "qs";
import { clogger } from "./console";

const postV1 = (
  url: string,
  headers: AxiosRequestHeaders,
  bodyData: any,
  formData: any,
  files: any = []
) =>
  new Promise((resolve, reject) => {
    let data: any;
    if (formData) {
      data = qs.stringify(formData);
    } else if (bodyData) {
      data = bodyData;
    }

    clogger.info(
      `postV1:: sending request to url:: `,
      url,
      "  headers:: =====> ",
      headers,
      "  files:: ====> ",
      files,
      "  data::  ====> ",
      data
    );

    const method: Method = "POST";
    const axiosConfig: AxiosRequestConfig = {
      method: method,
      url,
      headers,
      data,
    };
    axios(axiosConfig)
      .then(function (response: any) {
        clogger.success(
          `postV1:: Post call Success. url:: `,
          url,
          "  data:: =====> ",
          data,
          "  headers:: =====> ",
          headers,
          "  files:: ====> ",
          files,
          "  response:: ====> ",
          response.data
        );
        resolve(response.data);
      })
      .catch(function (error) {
        clogger.error(
          `postV1:: Post call failed. url:: `,
          url,
          "  data:: =====> ",
          data,
          "  headers:: =====> ",
          headers,
          "  files:: ====> ",
          files,
          "  error:: ====> ",
          error
        );
        reject(error);
      });
  });

const restClient = {
  postV1,
};

export default restClient;
