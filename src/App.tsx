import React from 'react';
import './App.css';
import { Route, Link as RouterLink, Routes } from 'react-router-dom';
import BlockchainVariants from './pages/BlockchainVariants';
import UnprocessedVariants from './pages/UnprocessedVariants';
import { Button, CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <RouterLink to="/blockchain">
        <Button variant="contained">Blockchain</Button>
      </RouterLink>
      <Routes>
        <Route path="/" element={<UnprocessedVariants />} />
      </Routes>
      <Routes>
        <Route path="/blockchain" element={<BlockchainVariants />} />
      </Routes>
    </>
  );
}

export default App;
