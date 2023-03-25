import styles from './App.module.css';
import ColorKey from './components/ColorKey';
import Resume from './components/Resume';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className={styles.App}>
      <Sidebar />
      <Resume />
      <ColorKey />
    </div>
  );
}

export default App;
