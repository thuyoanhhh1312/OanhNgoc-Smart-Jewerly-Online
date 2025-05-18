import React, { useState } from "react";

const BenefitCard = ({ icon, title, subtitle,tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative group xl:w-[270px] sm:w-[210px] sm:h-[77px] w-[127px] h-[37px] px-[5px] flex justify-center items-center sm:gap-2 gap-1 bg-[#F2F2F2] sm:p-[10px] rounded-lg cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img alt={title} loading="lazy" width="45" height="48" src={icon} />
      <div className="flex flex-col">
        <span className="text-[#003468] font-bold sm:text-[18px] text-[10px]">
          {title}
        </span>
        {subtitle && (
          <span className="text-[#3F6790] sm:text-[18px] text-[10px]">
            {subtitle}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[300px] bg-white border border-gray-300 shadow-lg rounded-md p-3 z-50 text-sm text-[#000]">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default BenefitCard;
