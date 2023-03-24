import type { FC, ReactNode } from "react";
import styles from './index.module.css'

type TextFadeProps = {
    children: ReactNode
}

const TextFade: FC<TextFadeProps> = ({children}) => {
    return (
    <div className={styles.container}>
        <div className={styles.content}>
            {children}
        </div>
    </div>
    );
}

export default TextFade