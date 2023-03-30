import { FC } from 'react'
import TechIconCircle from '../TechIconCircle'
import styles from './Signature.module.css'

type SignatureProps = {

}

const Signature: FC<SignatureProps> = () => {
    return (
        <div className={styles.signature}>made with ❤️ and <TechIconCircle name='React' size={14} /> and <TechIconCircle name='TypeScript' size={14} /> by Ronan McCarter</div>
    )
}

export default Signature