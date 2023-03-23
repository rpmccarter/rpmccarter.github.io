import type { FC, ReactNode } from "react";
import './style.css'

type TextFadeProps = {
    children: ReactNode
}

const TextFade: FC<TextFadeProps> = ({children}) => {
    return (
    <div className="container">
        <div className="spacer"></div>
        <div className="text">
            {children}
        </div>
        <div className="spacer"></div>
    </div>
    );
}

export default TextFade