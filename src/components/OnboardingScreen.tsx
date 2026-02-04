import React from 'react';

interface OnboardingScreenProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onGetStarted?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  title = "Task Management &\nTo-Do List",
  description = "This productive tool is designed to help\nyou better manage your task\nproject-wise conveniently!",
  buttonText = "Let's Start",
  onGetStarted,
}) => {
  // Image URLs from Figma
  const images = {
    person: "https://www.figma.com/api/mcp/asset/15957f2f-bc64-4f35-aaa9-0c2c296749c4",
    vase: "https://www.figma.com/api/mcp/asset/c3ee996b-ee4b-42b1-ac2b-8f03ef1054cf",
    stopwatch: "https://www.figma.com/api/mcp/asset/3ae54ee5-4c98-4249-a63a-1f99dce5af11",
    phone: "https://www.figma.com/api/mcp/asset/b229ac44-da38-4f44-a55a-52d54b27897d",
    pieChart: "https://www.figma.com/api/mcp/asset/2a49a669-50cd-4df0-aee1-4df02460d8e9",
    coffee: "https://www.figma.com/api/mcp/asset/c5547586-ba05-45a8-8857-a1714af70632",
    calendar: "https://www.figma.com/api/mcp/asset/b8379602-5193-4087-83d9-b0ed543f6e81",
    ellipse1: "https://www.figma.com/api/mcp/asset/f452aa7d-f6c6-4070-a1b3-51266e0df268",
    ellipse3: "https://www.figma.com/api/mcp/asset/d49aa3bb-cab3-47dc-85de-70322f2437c9",
    ellipse11: "https://www.figma.com/api/mcp/asset/a0c1c1da-fa95-4124-bf45-2ad1c3463ff6",
    ellipse2: "https://www.figma.com/api/mcp/asset/cf95c369-f37c-4bd1-aa91-7c9b0e6ad986",
    ellipse4: "https://www.figma.com/api/mcp/asset/46143fe4-52ff-4776-9877-7411df94d91e",
    ellipse17: "https://www.figma.com/api/mcp/asset/7a395fab-0171-439d-a07e-31e11a27e10a",
    rectangle1: "https://www.figma.com/api/mcp/asset/118aa886-1013-47c7-83b8-725565b08ad5",
    ellipse5: "https://www.figma.com/api/mcp/asset/df78e0a7-587b-4d1c-af47-977129af24f5",
    ellipse9: "https://www.figma.com/api/mcp/asset/a99d41c3-492b-415d-9888-92bc11fa686c",
    ellipse7: "https://www.figma.com/api/mcp/asset/ea0af01c-6b2f-4b8f-972b-8cc4c4043955",
    ellipse8: "https://www.figma.com/api/mcp/asset/f1d564a3-aa59-49c4-891a-f47d6e7f5bc7",
    ellipse6: "https://www.figma.com/api/mcp/asset/48c876ca-b87b-4e19-b191-cface0efb9c7",
    ellipse10: "https://www.figma.com/api/mcp/asset/6d0962c1-af2a-4a91-bfd2-88c80ecaf3f0",
    arrow: "https://www.figma.com/api/mcp/asset/d82a20c6-8351-443a-9e27-190b7cc69f86",
  };

  return (
    <div className="bg-white relative w-full h-screen overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute left-[calc(75%+51.75px)] w-[60px] h-[60px] top-[232px]">
        <div className="absolute inset-[-166.67%]">
          <img alt="" className="block max-w-none w-full h-full" src={images.ellipse1} />
        </div>
      </div>
      <div className="absolute left-[76px] w-[58px] h-[58px] top-[424px]">
        <div className="absolute inset-[-172.41%]">
          <img alt="" className="block max-w-none w-full h-full" src={images.ellipse3} />
        </div>
      </div>
      <div className="absolute left-[calc(50%+52.5px)] w-[58px] h-[58px] top-[767px]">
        <div className="absolute inset-[-172.41%]">
          <img alt="" className="block max-w-none w-full h-full" src={images.ellipse11} />
        </div>
      </div>
      <div className="absolute left-[-15px] w-[70px] h-[70px] top-[126px]">
        <div className="absolute inset-[-142.86%]">
          <img alt="" className="block max-w-none w-full h-full" src={images.ellipse2} />
        </div>
      </div>
      <div className="absolute left-[calc(50%+75.5px)] w-[70px] h-[70px] top-0">
        <div className="absolute inset-[-142.86%]">
          <img alt="" className="block max-w-none w-full h-full" src={images.ellipse4} />
        </div>
      </div>

      {/* Button shadow */}
      <div className="absolute h-[7px] left-[34px] top-[734px] w-[310px]">
        <div className="absolute inset-[-428.57%_-9.68%]">
          <img alt="" className="block max-w-none w-full h-full" src={images.ellipse17} />
        </div>
      </div>

      {/* Main illustration - Person */}
      <div className="absolute h-[184px] left-[calc(25%+37.25px)] top-[147px] w-[159px]">
        <img alt="Person working on laptop" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.person} />
      </div>

      {/* Decorative icons */}
      <div className="absolute h-[52px] left-[79px] top-[279px] w-[36px]">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.vase} />
      </div>
      <div className="absolute h-[50px] left-[calc(25%+10.25px)] top-[69px] w-[40px]">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.stopwatch} />
      </div>
      <div className="absolute flex h-[42px] items-center justify-center left-[calc(50%+57.5px)] top-[225px] w-[62px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[42px] relative w-[62px]">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.phone} />
          </div>
        </div>
      </div>
      <div className="absolute left-[84px] w-[26px] h-[26px] top-[180px]">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.pieChart} />
      </div>
      <div className="absolute flex h-[22px] items-center justify-center left-[67px] top-[310px] w-[18px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[22px] relative w-[18px]">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.coffee} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32.909px] items-center justify-center left-[calc(75%-5.25px)] top-[136px] w-[36.482px]">
        <div className="flex-none rotate-[12.86deg]">
          <div className="h-[26.599px] relative w-[31.348px]">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none w-full h-full" src={images.calendar} />
          </div>
        </div>
      </div>

      {/* Small decorative dots */}
      <div className="absolute left-[calc(50%+62.5px)] w-[8px] h-[8px] top-[383px]">
        <img alt="" className="block max-w-none w-full h-full" src={images.ellipse5} />
      </div>
      <div className="absolute left-[calc(25%+44.25px)] w-[8px] h-[8px] top-[391px]">
        <img alt="" className="block max-w-none w-full h-full" src={images.ellipse9} />
      </div>
      <div className="absolute left-[calc(50%+64.5px)] w-[8px] h-[8px] top-[73px]">
        <img alt="" className="block max-w-none w-full h-full" src={images.ellipse7} />
      </div>
      <div className="absolute left-[calc(50%+14.5px)] w-[4px] h-[4px] top-[92px]">
        <img alt="" className="block max-w-none w-full h-full" src={images.ellipse8} />
      </div>
      <div className="absolute left-[calc(75%-0.25px)] w-[4px] h-[4px] top-[362px]">
        <img alt="" className="block max-w-none w-full h-full" src={images.ellipse6} />
      </div>
      <div className="absolute left-[calc(25%+82.25px)] w-[4px] h-[4px] top-[405px]">
        <img alt="" className="block max-w-none w-full h-full" src={images.ellipse10} />
      </div>

      {/* Title */}
      <div className="-translate-x-1/2 absolute font-semibold leading-normal left-[187.5px] text-[#24252c] text-[24px] text-center top-[513px] whitespace-pre-line">
        {title}
      </div>

      {/* Description */}
      <div className="-translate-x-1/2 absolute font-normal leading-normal left-[187px] text-[#6e6a7c] text-[14px] text-center top-[593px] whitespace-pre-line">
        {description}
      </div>

      {/* CTA Button */}
      <button
        onClick={onGetStarted}
        className="absolute h-[52px] left-[22px] top-[687px] w-[331px] bg-[#5F33E1] rounded-[26px] shadow-lg hover:bg-[#5028c9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
      >
        <p className="font-semibold leading-normal text-[19px] text-center text-white">
          {buttonText}
        </p>
        <div className="absolute flex items-center justify-center left-[calc(75%+25.75px)] w-[24px] h-[24px] top-[14px]">
          <div className="flex-none rotate-180">
            <div className="relative w-[24px] h-[24px]">
              <img alt="" className="block max-w-none w-full h-full" src={images.arrow} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default OnboardingScreen;
