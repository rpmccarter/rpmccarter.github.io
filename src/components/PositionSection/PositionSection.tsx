import { FC } from "react"
import styles from './PositionSection.module.css'
import type { Position } from "../../data/resumeData"

type PositionSectionProps = {
    position: Position
}

const PositionSection: FC<PositionSectionProps> = ({ position }) => {
    return (
        <div className={styles.position}>
            <p>
                <span className={styles.company}>{position.company}</span>
                <span className={styles.title}>({position.title})</span>
            </p>
            <div className={styles.bulletContainer}>
                {position.bullets.map((bullet) => (<p className={styles.bullet}>{bullet}</p>))}
            </div>
        </div>
    )
}

export default PositionSection