import React from 'react';
import './App.css';
import { Route, Link as RouterLink, Routes } from 'react-router-dom';
import BlockchainVariants from './pages/BlockchainVariants';
import Button from 'react-bootstrap/Button';
import UnprocessedVariants from './pages/UnprocessedVariants';

function App() {
  return (
    <div className="App">
      <RouterLink to="/blockchain">
        <Button variant="contained">Blockchain</Button>
      </RouterLink>
      <Routes>
        <Route path="/" element={<UnprocessedVariants />} />
      </Routes>
      <Routes>
        <Route path="/blockchain" element={<BlockchainVariants />} />
      </Routes>
    </div>
  );
}

export default App;
