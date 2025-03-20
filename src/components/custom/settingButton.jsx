import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils"

export default function SettingButton({
    className,
}){
    return(
        <Button
            variant="outline"
            className={cn("h-12",className)}>   
            <div className="flex gap-4">
                <h1>Username</h1>
                <Settings size={50} color="black"/>
            </div>
        </Button>
    );
}
// drop down menu letting u swap roles