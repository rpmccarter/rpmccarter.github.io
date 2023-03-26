import { FC } from "react"
import styles from './PositionSection.module.css'
import { Position } from "../../data/resumeData"
import TechIconCircle from "../TechIconCircle"

type PositionSectionProps = {
    position: Position
}

const PositionSection: FC<PositionSectionProps> = ({ position }) => {
    
    
    const techDots = position.technologies 
        ?   (<div className={styles.dotContainer}>
                {position.technologies.map((tech) => <div className={styles.dot}><TechIconCircle name={tech} /></div>)}
            </div>) 
        : null

    return (
        <div className={styles.position}>
            <p className={styles.header}>
                <span className={styles.company}>{position.company}</span>
                <span className={styles.title}>({position.title})</span>
            </p>
            {techDots}
            <div className={styles.bulletContainer}>
                {position.bullets.map((bullet) => (<p className={styles.bullet}>{bullet}</p>))}
            </div>
        </div>
    )
}

export default PositionSection