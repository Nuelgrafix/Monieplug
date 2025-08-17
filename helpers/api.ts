import qs from "qs";
import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "@/lib/auth";

import {
  FC_API_KEY,
  USER_BASE_URL,
 
} from "@/constants/constants";

export const getAbsoluteUrl = ({
  service,
  version = "v1",
  path,
  query = {},
}: {
  service: "user" | "booking" | "payment" | "product";
  version?: "v1";
  path: string;
  query?: Record<string, string | null>;
}) => {
  let url = "";

  switch (service) {
    case "user":
      url += USER_BASE_URL;
      break;
   
  }

  url += "/" + version + path;

  if (Object.keys(query).length) {
    url += "?" + qs.stringify(query);
  }

  return url;
};

const addBearerToken = async () => {
  const session = await getSession();
  const token = session?.user.token;


  return { token };
  // return { Authorization: `Bearer ${token}`};
};

const getHeaders = (customHeaders?: HeadersInit) => ({
  ...customHeaders,
  "Content-Type": "application/json",
  "FC-API-KEY": FC_API_KEY!,
});

// export const post = async (
//   absoluteUrl: string,
//   options?: RequestInit & { noAuth?: boolean }
// ) => {
//   let headers = getHeaders(options?.headers);

//   if (!options?.noAuth) {
//     headers = { ...headers, ...(await addBearerToken()) };
//   }

//   const res = await fetch(absoluteUrl, {
//     method: "post",

//     ...options,
//     headers,
//   });

//   return res;
// };

export const post = async (
  absoluteUrl: string,
  options?: RequestInit & { noAuth?: boolean; addContentType?: boolean }
) => {
  let headers = getHeaders(options?.headers);

  // Add Content-Type header conditionally
  const isFormData = options?.body instanceof FormData;
  if (options?.addContentType && !isFormData) {
    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

  if (!options?.noAuth) {
    headers = { ...headers, ...(await addBearerToken()) };
  }

  const res = await fetch(absoluteUrl, {
    method: "post",
    ...options,
    headers,
  });

  return res;
};



export const get = async (
  absoluteUrl: string,
  options?: RequestInit & { noAuth?: boolean }
) => {
  let headers = getHeaders(options?.headers);

  if (!options?.noAuth) {
    headers = { ...headers, ...(await addBearerToken()) };
  }

  const res = await fetch(absoluteUrl, { method: "get", ...options, headers });

  return res;
};

export const put = async (
  absoluteUrl: string,
  options?: RequestInit & { noAuth?: boolean }
) => {
  let headers = getHeaders(options?.headers);

  if (!options?.noAuth) {
    headers = { ...headers, ...(await addBearerToken()) };
  }

  const res = await fetch(absoluteUrl, {
    method: "put",
    ...options,
    headers,
  });

  return res;
};

// axios was used here because it seems like
// fetch does not handle patch requests well
// it kept return a JSON.stringify error
export const patch = async (
  absoluteUrl: string,
  body: unknown,
  options?: AxiosRequestConfig & { noAuth?: boolean }
) => {
  let headers = {
    ...options?.headers,
    "Content-Type": "application/json",
    "FC-API-KEY": FC_API_KEY!,
  };

  if (!options?.noAuth) {
    headers = { ...headers, ...(await addBearerToken()) };
  }

  const res = await axios.patch(absoluteUrl, body, {
    ...options,
    headers,
  });

  return res;
};

export const del = async (
  absoluteUrl: string,
  options?: RequestInit & { noAuth?: boolean }
) => {
  let headers = getHeaders(options?.headers);

  if (!options?.noAuth) {
    headers = { ...headers, ...(await addBearerToken()) };
  }

  const res = await fetch(absoluteUrl, {
    method: "DELETE",
    ...options,
    headers,
  });

  return res;
};

