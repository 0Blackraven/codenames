import * as React from "react";
import {cn} from "@/lib/utils"

export default function Tile({ children , className , onClick}) {
  return (
    <div
      onClick={onClick} 
      className={cn("flex flex-col justify-between flex-grow bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-[1px]",className)}>
      <div className="flex items-center gap-1 flex-grow">
        <img
        src="/default.jpg"
        alt="Profile"
        className="w-6 h-6 rounded-md object-cover border border-gray-400"
        />
        <div className="flex-1 grid gap-[1px]">
          <div className="bg-gray-800 h-[2px] w-3/4 rounded"></div>
          <div className="bg-gray-800 h-[2px] w-4/5 rounded"></div>
          <div className="bg-gray-800 h-[2px] w-2/3 rounded"></div>
        </div>
      </div>
      <div className="border-t border-gray-400"></div>
        <div className="text-center text-[15px] font-bold overflow">{children}</div>
      </div>
  );
}


