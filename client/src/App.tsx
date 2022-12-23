import './App.scss';
import {useState} from 'react';
import { Route, Routes } from 'react-router';
import Header from './components/Header';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';

const defaultAvatar = 'https://thumbs.dreamstime.com/b/creative-vector-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-107388687.jpg'
export const api = 'http://localhost:8000/api/'

export interface IUserInterface {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

const initialUser: IUserInterface = {
  name: '',
  email: '',
  password: '',
  avatar: ''
}

function App() {
  const [user, setUser] = useState(initialUser)

  const setAvatar = (ava: string) => {
    setUser({...user, avatar: ava})
  }

  const logout = () => {
    setUser(initialUser)
  }

  return (
    <>
      <Header avatar={user.avatar || defaultAvatar} name={user.name} logout={logout} />
      <Routes>
        <Route path="/registration" element={<Registration setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* {
          user.name &&
        } */}
        <Route path="/profile" element={<Profile setAvatar={setAvatar} user={user} />} />
        <Route index element={<Registration setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
