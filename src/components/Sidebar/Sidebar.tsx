import { FC } from 'react'
import styles from './Sidebar.module.css'
import SidebarIcon from "../SidebarIcon"
import linkedinIcon from '../../images/linkedin.svg'
import githubIcon from '../../images/github.svg'
import stackOverflowIcon from '../../images/stackoverflow.svg'
import docIcon from '../../images/doc.svg'
import emailIcon from '../../images/email.svg'

type SidebarProps = {

}

const Sidebar: FC<SidebarProps> = () => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={`${styles.sidebar} ${styles.upperSidebar}`}>
                <SidebarIcon image={linkedinIcon} link="https://www.linkedin.com/in/ronan-mccarter/" />
                <SidebarIcon image={githubIcon} link="https://github.com/rpmccarter" />
                <SidebarIcon image={stackOverflowIcon} link="https://stackoverflow.com/users/20170974/rpm" />
            </div>

            <div className={`${styles.sidebar} ${styles.lowerSidebar}`}>
                <SidebarIcon bottom image={docIcon} link="https://drive.google.com/file/d/1MfiWn0gd7XnoWaHK7fcek9pIafiuB1t7/view?usp=share_link" />
                <SidebarIcon bottom image={emailIcon} onClick={() => navigator.clipboard.writeText('rpmccarter@gmail.com')} />
            </div>
        </div>
    )
}

export default Sidebar