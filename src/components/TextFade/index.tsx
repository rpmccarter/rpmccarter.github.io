import { FunctionComponent } from "react";
import './style.css'

type TextFadeProps = {
    text: string
}

const TextFade: FunctionComponent<TextFadeProps> = ({text}) => {
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