import { FC } from "react";
import './style.css'

type TextFadeProps = {
    text: string
}

const TextFade: FC<TextFadeProps> = ({text}) => {
    return (
    <div className="container">
        <div className="spacer"></div>
        <div className="text">
            {text}
        </div>
        <div className="spacer"></div>
    </div>
    );
}

export default TextFade