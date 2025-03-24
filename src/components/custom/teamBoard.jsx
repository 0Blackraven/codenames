import * as React from "react";
import { Button } from "../ui/button";
import {cn} from "../../lib/utils";

export default function TeamBoard({
    className,
    score,
    children,
}) {

    return (
        <div className={cn("w-80 bg-gray-100 rounded-lg shadow-lg border border-gray-300 p-4", className)}>
            <div className="flex flex items-center space-x-9 justify-between">
                <img
                    src="\default.jpg" 
                    alt="Profile"
                    className="w-48 h-30 rounded-md object-cover border border-gray-400"/>
                <div>
                    <h2 className="text-4xl font-semibold mr-9">{score}</h2>
                </div>
            </div>
            <div className="border-t border-gray-400 my-4"></div>
            {children}            
        </div>
    )
}