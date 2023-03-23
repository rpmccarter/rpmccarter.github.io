import { FC } from "react"
import type { Position } from "../../data/resumeData"
import './style.css'

type PositionSectionProps = {
    position: Position
}

const PositionSection: FC<PositionSectionProps> = ({ position }) => {
    return (
        <div className="position">
            <p>{position.company}</p>
            <p>{position.title}</p>
            {position.bullets.map((bullet) => (<p>{bullet}</p>))}
        </div>
    )
}

export default PositionSection