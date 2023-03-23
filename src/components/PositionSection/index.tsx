import { FunctionComponent } from "react"
import type { Position } from "../../data/resumeData"

type PositionSectionProps = {
    position: Position
}

const PositionSection: FunctionComponent<PositionSectionProps> = ({ position }) => {
    return (
        <>
            <p>{position.company}</p>
            <p>{position.title}</p>
            {position.bullets.map((bullet) => (<p>{bullet}</p>))}
        </>
    )
}

export default PositionSection