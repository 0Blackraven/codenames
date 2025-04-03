import { Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";


export default function CopyToClipBoard({ 
    text,
    className,
 }) {

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    },[copied]);
    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(text);
    };
    
    return (
        <Button onClick={handleCopy}  variant="ghost" className={cn("flex",className)}>
            {copied ? <Check/> : <Copy/>}
        </Button>
    );
    }