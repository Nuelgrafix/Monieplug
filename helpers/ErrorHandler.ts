const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";

export const responseErrorHandler = (error: any) => {
  if (dev) console.log(error);
  if (error.error) {
    if (dev) console.log(error.error);
    return error.error;
  }

  if (error?.statusCode === 99) {
    const errorArrays = error?.message;

    return errorArrays;
  }

  let resMessage =
    (error && error?.message) ||
    error?.response?.data ||
    error?.message ||
    error?.data?.message ||
    error.toString();

  if (resMessage !== "") {
    if (dev) console.log("resMessage", resMessage);
    return resMessage;
  }

  if (error?.statusCode === 404 || error.status === 404)
    resMessage = "The requested resource was not found";
  if (error?.status === 401 || error.status === 401) resMessage = "Unauthorize";
  if (error?.status === 409 || error.status === 409)
    resMessage = "Duplicate Entry";
  if (error?.status === 413 || error.status === 413)
    resMessage = "Request Entity Too Large";
  // if (error?.originalStatus === 500 || error.status === 505) resMessage = "Oops Something went wrong Please try again later!!!";
  if (resMessage === "Request failed with status code 500") {
    resMessage = "Oops Something went wrong Please try again later!!!";
  }

  if (resMessage === "Network Error")
    resMessage = "Oops, it seems you do not have internet access!!";
  if (resMessage === "invalid signature")
    resMessage = "Oops Seems the link has expired";

  if (dev) console.log("Error Message: ", resMessage);

  if (typeof resMessage === "object") resMessage = JSON.stringify(resMessage);

  return resMessage;
};
