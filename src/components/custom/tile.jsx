import * as React from "react";

export default function Tile({ children }) {
  return (
    <div className="flex flex-col justify-between w-[10vw] h-[10vw] max-w-[100px] max-h-[100px] 
      bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-[1px]">
      
      <div className="text-center text-[8px] font-bold">{children}</div>
    </div>
  );
}

{/* Top Section
<div className="flex items-center gap-1 flex-grow">
  <img
    src="/default.jpg"
    alt="Profile"
    className="w-6 h-6 rounded-md object-cover border border-gray-400"
  />
  {/* Right Text Section */}
  {/*<div className="flex-1 grid gap-[1px]">
    <div className="bg-gray-800 h-[2px] w-3/4 rounded"></div>
    <div className="bg-gray-800 h-[2px] w-4/5 rounded"></div>
    <div className="bg-gray-800 h-[2px] w-2/3 rounded"></div>
    <div className="bg-gray-800 h-[2px] w-1/2 rounded"></div>
  </div>
</div>

{/* Separator Line */}
{/*<div className="border-t border-gray-400"></div> */}

{/* Bottom Section */}