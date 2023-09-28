import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ConfirmEmail from './pages/ConfirmEmail';
import NoMatch from './pages/NoMatch';
import OfficeSpace from './pages/office/OfficeSpace';
import UserDetails from './pages/office/CurrentUserDetails';
import Tasks from './pages/office/Tasks';
import Invites from './pages/office/Invites';
import Layout from './pages/Layout';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirmemail' element={<ConfirmEmail />} />
        <Route path='/' element={<Home />} />
        <Route path='/office/' element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path=':officeId' element={<OfficeSpace />}>
            <Route path='user/:pageId' element={<UserDetails />} />
          </Route>
          <Route path=':officeId/tasks' element={<Tasks />} />
        </Route>
        <Route
          path='/office/:officeId/invite/:inviteCode'
          element={<Invites />}
        />
        <Route path='*' element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
