import { FC } from 'react'
import { technologies } from '../../data/resumeData'
import TechIconCircle from '../TechIconCircle'
import styles from './TechIconKey.module.css'

type TechIconKeyProps = {

}

const TechIconKey: FC<TechIconKeyProps> = () => {
    return (
        <div className={styles.container}>
            {technologies.map((tech) => {
                return (
                    <div className={styles.entry}>
                        {tech}<div className={styles.dot}><TechIconCircle name={tech} /></div>
                    </div>
                )
            })}
        </div>
    )
}

export default TechIconKey