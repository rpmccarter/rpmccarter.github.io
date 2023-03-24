import { FC } from "react"
import styles from './Sidebar.module.css'
import SidebarIcon from "../SidebarIcon"
import linkedinIcon from '../../images/linkedin.png'
import githubIcon from '../../images/github.png'
import stackOverflowIcon from '../../images/stackoverflow.png'

type SidebarProps = {

}

const Sidebar: FC<SidebarProps> = () => {
    return (
        <div className={styles.sidebar}>
            <SidebarIcon image={linkedinIcon} link="https://www.linkedin.com/in/ronan-mccarter/" />
            <SidebarIcon image={githubIcon} link="https://github.com/rpmccarter" />
            <SidebarIcon image={stackOverflowIcon} link="https://stackoverflow.com/users/20170974/rpm" />
        </div>
    )
}

export default Sidebar