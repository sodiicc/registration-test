import { NavLink, useNavigate } from 'react-router-dom'

interface IHeaderInterface {
  avatar: string;
  name: string;
  logout() : void;
}

export default function Header({ name, avatar, logout }: IHeaderInterface) {
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='header'>
      {name ?
        <>
        <button onClick={onLogout}>Logout</button>
          <NavLink to={'/profile'}>Profile</NavLink>
        </>
        :
        <>
          <NavLink to={'/registration'}>Signup</NavLink>
          <NavLink to={'/login'}>Login</NavLink>
        </>
      }
      <div className='avatar'>
        <img src={avatar} alt='avatar' />
      </div>
    </div>
  )
}
