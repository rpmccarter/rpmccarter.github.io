import { FC } from 'react'
import { technologyColors } from '../../data/resumeData'
import ColorCircle from '../ColorCircle'
import styles from './ColorKey.module.css'

type ColorKeyProps = {

}

const ColorKey: FC<ColorKeyProps> = () => {
    return (
        <div className={styles.container}>
            {Object.entries(technologyColors).map(([tech, color]) => {
                return (
                    <div className={styles.entry}>
                        {tech}<div className={styles.dot}><ColorCircle color={color} /></div>
                    </div>
                )
            })}
        </div>
    )
}

export default ColorKey