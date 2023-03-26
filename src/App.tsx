import styles from './App.module.css';
import TechIconKey from './components/TechIconKey';
import Resume from './components/Resume';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className={styles.App}>
      <Sidebar />
      <Resume />
      <TechIconKey />
    </div>
  );
}

export default App;
