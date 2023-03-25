import { FC } from 'react'
import styles from './ColorCircle.module.css'

type ColorCircleProps = {
    color: string
}

const ColorCircle: FC<ColorCircleProps> = ({ color }) => {
    return (
        <div className={styles.circle} style={{backgroundColor: color}}></div>
    )
}

export default ColorCircle