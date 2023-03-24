import styles from './App.module.css';
import Resume from './components/Resume';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className={styles.App}>
      <Sidebar />
      <Resume />
    </div>
  );
}

export default App;
