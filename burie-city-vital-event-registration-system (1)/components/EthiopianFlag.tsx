
import React from 'react';

interface EthiopianFlagProps {
  className?: string;
}

const EthiopianFlag: React.FC<EthiopianFlagProps> = ({ className = "w-12 h-auto shadow-sm" }) => {
  return (
    <div className={`overflow-hidden rounded-md flex flex-col ${className} shadow-md border border-slate-100/10`}>
      <div className="bg-[#078930] h-1/3 w-full"></div>
      <div className="bg-[#FCDD09] h-1/3 w-full flex items-center justify-center relative">
        {/* Blue disk with Star - Official Emblem Style */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1.4em] h-[1.4em] bg-[#0F47AF] rounded-full flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 1200 1200" className="w-[1.2em] h-[1.2em]" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FCDD09" d="m600 200 130.9 402.8 423.6-137.6-342.7 249 130.9 402.8-342.7-249-342.7 249 130.9-402.8-342.7-249 423.6 137.6z" />
              <circle cx="600" cy="600" r="140" fill="#0F47AF" />
              {/* The above simplifies the complex geometry slightly for a small icon, but let's try a better path for the star lines if possible or keep it simple but accurate proportions. 
                  Actually, the official SVG is complex. I'll use a clean pentagram star shape that looks solid and distinctive.
              */}
              <path fill="#FCDD09" d="M600,240 L712,467 L962,467 L760,613 L837,853 L600,707 L363,853 L440,613 L238,467 L488,467 L600,240 Z M600,340 L530,487 L370,487 L500,580 L450,733 L600,640 L750,733 L700,580 L830,487 L670,487 L600,340 Z" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[#DA121A] h-1/3 w-full"></div>
    </div>
  );
};

export default EthiopianFlag;
