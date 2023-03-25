import { FC } from "react"
import styles from './SidebarIcon.module.css'

type SidebarIconProps = {
    image: string
    bottom?: boolean
    link?: string
    onClick?: () => void
}

const SidebarIcon: FC<SidebarIconProps> = ({ image, bottom, link, onClick }) => {
    return (
        <div className={`${styles.container} ${bottom ? styles.lowerContainer : styles.upperContainer}`}>
            <a href={link} target="_blank" rel="noopener noreferrer" onClick={onClick} >
                <img className={`${styles.image} ${bottom ? styles.lowerImage : styles.upperImage}`} src={image} />
            </a>
        </div>
    )
}

export default SidebarIcon