import Login from "@/components/custom/login";
import { TypingAnimation } from "../components/magicui/typing-animation";
import GifComponent from "@/components/custom/gifComponent";
import { useEffect } from "react";
import { Socket } from "../socket"


export default function Landing() {
    return (
        <>
        <div className="flex flex-row justify-between ml-10 mr-10 pt-50">
            <div className="flex flex-col justify-center">
                <GifComponent url="https://media.tenor.com/80aRR2vwzqkAAAAj/cavy-sherlock-detective.gif"/>
                <TypingAnimation>
                    Codenames...
                </TypingAnimation>
                <TypingAnimation className="text-1.5xl" delay={400}>
                    Guess the word and Hope it’s not your last.
                </TypingAnimation>
            </div>
            <Login/>
        </div>
        </>
    )
}
