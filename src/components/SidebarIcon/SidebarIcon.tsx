import { FC } from "react"
import styles from './SidebarIcon.module.css'

type SidebarIconProps = {
    image: string
}

const SidebarIcon: FC<SidebarIconProps> = ({ image }) => {
    return (
        <div className={styles.container}>
            <img className={styles.image} src={image} />
        </div>
    )
}

export default SidebarIcon