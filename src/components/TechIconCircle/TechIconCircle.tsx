import { FC } from 'react'
import styles from './TechIconCircle.module.css'
import { technologies } from '../../data/resumeData'
import typescriptIcon from '../../images/typescript.png'
import reactIcon from '../../images/react.png'
import reduxIcon from '../../images/redux.png'
import sqlIcon from '../../images/sql.png'
import sequelizeIcon from '../../images/sequelize.png'
import jestIcon from '../../images/jest.png'
import expressIcon from '../../images/express.png'
import awsIcon from '../../images/aws.png'
import pythonIcon from '../../images/python.png'
import swiftIcon from '../../images/swift.png'

export const technologyIcons: {[key in typeof technologies[number]]: string} = {
    TypeScript: typescriptIcon, // blue
    Sequelize: sequelizeIcon, // green
    Express: expressIcon, // gray
    Python: pythonIcon, // yellow
    React: reactIcon, // aqua
    Redux: reduxIcon, // purple
    Swift: swiftIcon, // red-orange
    Jest: jestIcon, // red
    AWS: awsIcon, // orange
    SQL: sqlIcon, // white
} as const

type TechIconCircleProps = {
    name: typeof technologies[number]
    size?: number
}

const TechIconCircle: FC<TechIconCircleProps> = ({ name, size = 20 }) => {
    return (
        <img className={styles.circle} style={{width: size}} src={technologyIcons[name]} />
    )
}

export default TechIconCircle