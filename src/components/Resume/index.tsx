import { FunctionComponent, useMemo } from "react"
import { positions } from "../../data/resumeData"
import PositionSection from "../PositionSection"

type ResumeProps = {

}

const Resume: FunctionComponent<ResumeProps> = () => {
    const positionSections = useMemo(() => {
        return positions.map((position) => (
            <PositionSection position={position} />
        ))
    }, [])

    return (
        <>
            {positionSections}
        </>
    )
}

export default Resume