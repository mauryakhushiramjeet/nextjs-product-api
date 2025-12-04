import React from "react";

interface HeadingType {
  heading: string;
  icons?: React.ReactNode;
}
const HeadingComponent: React.FC<HeadingType> = ({ heading, icons }) => {
  return (
    <div className="text-xl md:text-2xl: xl:text-3xl 2xl:text-4xl font-extrabold font-Inter text-[#282C35] flex items-center gap-1">
      {" "}
      <p className="w-16 h-1 rounded-full bg-black"></p>
      <p className="">{heading}</p>
      {icons && <p className="">{icons}</p>}
    </div>
  );
};

export default HeadingComponent;
