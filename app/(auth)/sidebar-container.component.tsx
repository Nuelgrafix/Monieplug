import Image from "next/image";



const SidebarContainer = ()  => {
  return (
    <div className="relstive w-full md:max-w-[422px] h-[220px] sm:h-[540px] relative p-[10px] ml-0 lg:ml-[20px] flex-shrink-0 rounded-[24px] sm:rounded-[40px] overflow-hidden">
      <Image
        src="/image/generated-image.png"
        alt="Login Image"
        width={429}
        height={540}
        className="w-full h-full rounded-[24px] sm:rounded-[40px]  py-2 sm:py-5  object-cover "
      />
      <Image
        src="/logo/logo.png"
        alt="monieplug logo"
        width={1000}
        height={1000}
        className="absolute bottom-[10px] lg:bottom-[20px] left-0 h-[32px] sm:h-[43px] w-[100px] sm:w-[142.7px] rounded-tr-[10px] sm:rounded-tr-[16px]"
      />
    </div>
  );
};

export default SidebarContainer;
