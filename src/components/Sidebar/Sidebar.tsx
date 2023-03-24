import { FC } from "react"
import styles from './index.module.css'
import linkedin from '../../images/linkedin.png'
import SidebarIcon from "../SidebarIcon"


type SidebarProps = {

}

const Sidebar: FC<SidebarProps> = () => {
    return (
        <div className={styles.sidebar}>
            <SidebarIcon image={linkedin} />
        </div>
    )
}

export default Sidebar