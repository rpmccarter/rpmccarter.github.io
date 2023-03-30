import styles from './App.module.css';
import TechIconKey from './components/TechIconKey';
import Resume from './components/Resume';
import Sidebar from './components/Sidebar';
import Signature from './components/Signature';

function App() {
  return (
    <div className={styles.App}>
      <Sidebar />
      <div className={styles.rightPanel}>
        <div className={styles.content}>
          <Resume />
          <TechIconKey />
        </div>
        <Signature />
      </div>
    </div>
  );
}

export default App;
