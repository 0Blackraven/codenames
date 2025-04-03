import * as React from "react";
import {cn} from "../../lib/utils";

export default function TeamBoard({
    className,
    score,
    children,
}) {

    return (
        <div className={cn("bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-4", className)}>
            <div className="flex items-center justify-evenly">
                <img
                    src="\default.jpg" 
                    alt="Profile"
                    className="h-10 lg:w-40 w-10 lg:h-35 rounded-md object-cover border border-gray-400"/>
                <div>
                    <h2 className="text-2xl lg:text-4xl font-semibold">{score}</h2>
                </div>
            </div>
            <div className="border-t border-gray-400 my-4"></div>
            {children}            
        </div>
    )
}