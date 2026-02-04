import React from 'react';

interface Logo {
  src: string;
  alt: string;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  priceUnit: string;
  buttonText: string;
  onButtonClick?: () => void;
  trustedByLogos?: Logo[];
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  priceUnit,
  buttonText,
  onButtonClick,
  trustedByLogos = [],
}) => {
  return (
    <div className="bg-white border border-[#d5cfcf] border-solid overflow-clip relative rounded-[10px] w-[386px] h-[351px]">
      {/* Trusted By Background */}
      <div className="absolute bg-[#f9f9f9] h-[72.511px] left-[-1px] top-[278.49px] w-[386px]" />

      {/* Trusted By Logos */}
      {trustedByLogos.length > 0 && (
        <div className="absolute flex items-center left-[146.79px] top-[298.6px]">
          <div className="flex gap-[18px] items-center relative shrink-0">
            {trustedByLogos.map((logo, index) => (
              <img
                key={index}
                src={logo.src}
                alt={logo.alt}
                className="h-[20.947px] relative shrink-0 opacity-70"
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Section */}
      <div className="absolute left-[31.5px] top-[126.84px]">
        <div className="absolute flex flex-col font-semibold justify-center left-[32.5px] text-[#101828] text-[40px] top-[37px] tracking-[-0.8px]">
          <p className="leading-[72px] whitespace-pre-wrap">{price}</p>
        </div>
        <p className="absolute font-medium leading-[24px] left-[118.75px] text-[#475467] text-[16px] top-[24px]">
          {priceUnit}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onButtonClick}
        className="absolute bg-white border-[#979797] border-[1.5px] border-solid flex gap-[8px] h-[44px] items-center justify-center left-[31.29px] overflow-clip px-[20px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] top-[202.5px] w-[177px] hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
      >
        <p className="font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-black">
          {buttonText}
        </p>
      </button>

      {/* Trusted By Label */}
      <p className="absolute font-medium leading-[24px] left-[86.06px] not-italic text-[#475467] text-[10px] text-center top-[295.71px] uppercase w-[88.388px] whitespace-pre-wrap">
        Trusted by
      </p>

      {/* Title */}
      <p className="absolute font-medium leading-[28px] left-[31.5px] not-italic text-[22px] text-black top-[28.01px] w-[326.084px] whitespace-pre-wrap">
        {title}
      </p>

      {/* Description */}
      <p className="absolute font-medium leading-[20px] left-[31.5px] not-italic text-[#475467] text-[14px] top-[59.67px] w-[326.084px] whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};

export default PricingCard;
