import type { FC, ReactNode } from "react";
import './style.css'

type TextFadeProps = {
    children: ReactNode
}

const TextFade: FC<TextFadeProps> = ({children}) => {
    return (
    <div className="container">
        <div className="content">
            {children}
        </div>
    </div>
    );
}

export default TextFade