import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { api, IUserInterface } from '../App'
import Loader from './Loader'

interface ILoginPropsInterface {
  setUser(user: IUserInterface): void;
}

export default function Login(props: ILoginPropsInterface) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loaded, setLoaded] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [email, password])

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch(event.target.name) {
      case 'email': setEmail(event.target.value)
        break
      case 'password': setPassword(event.target.value)
        break
    }    
  }

  const onFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    const data = {
      email,
      password,
    }
    setLoaded(false)
    fetch(api + 'auth/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then((res) => res.json()).then(user => {
      props.setUser(user)
      navigate('/profile')
    }).catch(err => {
      console.error(err)
      setError('Wrong email or password')
    })
    .finally(() => setLoaded(true))
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
  }

  const validateForm = () => {
    if (!email.trim()) return 'Email can not be empty'
    if (!password.trim()) return 'Password can not be empty'
    return ''
  }

  return (
    <div className='login'>
      {
        loaded ? null : <Loader />
      }
      <form>
        <h2>Login Form</h2>
        <p className='error'>{error}</p>
        <div className='space-between block'>
          <label htmlFor='email'>Email</label>
          <input
            placeholder="Email"
            aria-label="LogEmailin"
            type="text"
            name="email"
            value={email}
            onChange={onFieldChange}
          />
        </div>
        <div className='space-between block'>
          <label htmlFor='password'>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={onFieldChange}
          />
        </div>
        <div className='block buttons'>
          <button disabled={!!validateForm()} type="submit" onClick={onFormSubmit} title={validateForm()}>Submit</button>
          <button type="button" onClick={resetForm}>Clean</button>
        </div>
      </form>
    </div>
  )
}
