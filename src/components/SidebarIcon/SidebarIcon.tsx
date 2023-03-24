import { FC } from "react"
import styles from './SidebarIcon.module.css'

type SidebarIconProps = {
    image: string
    link?: string
    onClick?: () => void
}

const SidebarIcon: FC<SidebarIconProps> = ({ image, link, onClick }) => {
    return (
        <div className={styles.container}>
            <a href={link} target="_blank" rel="noopener noreferrer" onClick={onClick} >
                <img className={styles.image} src={image} />
            </a>
        </div>
    )
}

export default SidebarIcon