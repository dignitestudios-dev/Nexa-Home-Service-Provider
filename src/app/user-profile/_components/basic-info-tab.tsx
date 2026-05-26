import React from "react";

export const BasicInfoTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 ">
      {/* Overview */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] font-bold leading-[22px] text-black">
          Overview
        </h3>
        <p className="text-[16px] font-normal leading-[26px] text-[rgba(24,24,24,0.8)]">
          Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet
          enim faucibus vitae facilisi. Quis amet imperdiet ut molestie luctus
          risus lacinia. Mauris vel mus at urna vulputate aliquet eu. Quis amet
          imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna
          vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur. Diam
          aliquet lectus laoreet enim faucibus vitae facilisi. Quis amet
          imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna
          vulputate aliquet eu. Quis amet imperdiet ut molestie luctus risus
          lacinia. Mauris vel mus at urna vulputate aliquet eu. Lorem ipsum
          dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus
          vitae facilisi. Quis amet imperdiet ut molestie luctus risus lacinia.
          Mauris vel mus at urna vulputate aliquet eu.
        </p>
      </div>

      {/* Services */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[20px] font-bold leading-[22px] text-black">
          Services
        </h3>
        <div className="flex flex-wrap gap-[7px]">
          {["Window Cleaning", "Power Washing", "Soft Washing"].map(
            (service) => (
              <span
                key={service}
                className="rounded-full bg-[rgba(0,88,100,0.06)] px-[10px] py-[8px] text-[16px] font-normal leading-[20px] text-[#005864]"
              >
                {service}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
