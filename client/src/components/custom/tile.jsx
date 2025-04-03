import * as React from "react";
import {cn} from "../../lib/utils"

export default function Tile({ children , className , onClick}) {
  return (
    <div
      onClick={onClick} 
      className={cn("flex flex-col justify-between flex-grow bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-[4px]",className)}>
      <div className="flex gap-2 flex-grow">
        <img
        src="/default.jpg"
        alt="Profile"
        className="w-6 h-6 rounded-md object-cover border border-gray-400"
        />
        <div className="flex-1 grid gap-1 items-center">
          <div className="bg-gray-800 h-[2px] w-3/4 rounded"></div>
          <div className="bg-gray-800 h-[2px] w-4/5 rounded"></div>
          <div className="bg-gray-800 h-[2px] w-2/3 rounded"></div>
        </div>
      </div>
      <div className=" bordet-t border-gray-400"></div>
        <div className="text-center text-2sm overflow">{children}</div>
      </div>
  );
}


