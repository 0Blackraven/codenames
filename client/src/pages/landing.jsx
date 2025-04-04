import Login from "../components/custom/login";
import { TypingAnimation } from "../components/magicui/typing-animation";
import GifComponent from "../components/custom/gifComponent";


export default function Landing() {
    return (
        <>
        <div className="flex lg:flex-row justify-between items-center gap-10 flex-col lg:ml-35 lg:mr-35 lg:pt-50">
            <div className="flex flex-col items- center justify-center">
                <GifComponent url="https://media.tenor.com/80aRR2vwzqkAAAAj/cavy-sherlock-detective.gif"/>
                <TypingAnimation>
                    Codenames...
                </TypingAnimation>
                <TypingAnimation className="lg:text-xl text-sm" delay={400}>
                    Guess the word and Hope it’s not your last.
                </TypingAnimation>
            </div>
            <Login/>
        </div>
        </>
    )
}
