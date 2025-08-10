"use client";

import { Slide, ToastContainer as TC } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function ToastContainer() {
  return (
    <TC
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      toastClassName="!z-[9999999]"
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={5}
      transition={Slide}
    />
  );
}
