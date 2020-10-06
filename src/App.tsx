import React from 'react';

import './App.css';

import LaunchList from './LaunchList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>SpaceX Launch Xplorer</h3>
      </header>
      <main>
        <LaunchList/>
      </main>
    </div>
  );
}

export default App;
