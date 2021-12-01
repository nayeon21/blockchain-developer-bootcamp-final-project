import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MintingPage from './pages/MintingPage';
import MyNFTPage from './pages/MyNFT';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>} />
          <Route path='/minting' element={<MintingPage/>} />
          <Route path='/myNft' element={<MyNFTPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;