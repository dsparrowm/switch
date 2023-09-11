import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ConfirmEmail from './pages/ConfirmEmail';
import NoMatch from './pages/NoMatch';
import OfficeSpace from './pages/office/OfficeSpace';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirmemail' element={<ConfirmEmail />} />
        <Route path='/' element={<Home />} />
        <Route path='/office/:officeId' element={<OfficeSpace />} />


        <Route path='*' element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
