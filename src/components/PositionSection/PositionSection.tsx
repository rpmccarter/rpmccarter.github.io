import { FC } from "react"
import styles from './PositionSection.module.css'
import type { Position } from "../../data/resumeData"

type PositionSectionProps = {
    position: Position
}

const PositionSection: FC<PositionSectionProps> = ({ position }) => {
    return (
        <div className={styles.position}>
            <div className={styles.header} >
                <p className={styles.company}>{position.company}</p>
                <p className={styles.title}>({position.title})</p>
            </div>
            <div className={styles.bulletContainer}>
                {position.bullets.map((bullet) => (<p className={styles.bullet}>{bullet}</p>))}
            </div>
        </div>
    )
}

export default PositionSection