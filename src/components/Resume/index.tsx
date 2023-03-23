import { FC, useMemo } from "react"
import { positions } from "../../data/resumeData"
import PositionSection from "../PositionSection"
import TextFade from "../TextFade"

type ResumeProps = {

}

const Resume: FC<ResumeProps> = () => {
    const positionSections = useMemo(() => {
        return positions.map((position) => (
            <PositionSection position={position} />
        ))
    }, [])

    return (
        <TextFade>
            {positionSections}
        </TextFade>
    )
}

export default Resume