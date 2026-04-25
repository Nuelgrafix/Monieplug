import React from "react";
import Image from "next/image";

const PageLoader = () => {
  return (
    <div className="h-[100vh] bg-white flex justify-center items-center w-[100%]">
      {" "}
      <div className="flex flex-col justify-center items-center">
        <Image
          alt=""
          width={700}
          height={700}
          src="/TT Blue 1.png"
          className=" w-[150px] lg:w-[200px]"
        />
        <div className="flex">
          <span className=" text-primary  loading loading-ring loading-xs"></span>
          <span className="loading loading-ring loading-sm text-primary "></span>
          <span className="loading loading-ring loading-md text-primary "></span>
          <span className="loading loading-ring loading-lg text-primary "></span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
