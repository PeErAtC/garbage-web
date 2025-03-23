import React from 'react';
import styles from './main.module.css';

const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.sidebar}>Sidebar Content</div>
        <div className={styles.main}>Main Content</div>
      </div>
    </div>
  );
};

export default App;