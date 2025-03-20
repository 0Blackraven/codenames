import Login from "@/components/custom/login";
import { TypingAnimation } from "../components/magicui/typing-animation";
import GifComponent from "@/components/custom/gifComponent";


export default function Landing() {
    return (
        <>
        <div className="flex flex-row justify-between ml-10 mr-10 pt-50">
            <div className="flex flex-col justify-center">
                <GifComponent/>
                <TypingAnimation>
                    Codenames...
                </TypingAnimation>
                <TypingAnimation className="text-1.5xl" delay={1000}>
                    Guess the word and Hope it’s not your last.
                </TypingAnimation>
            </div>
            <Login/>
        </div>
        </>
    )
}
