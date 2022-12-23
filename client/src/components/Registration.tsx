import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { api, IUserInterface } from '../App'
import Loader from './Loader'

interface IRegistrationPropsInterface {
  setUser(user: IUserInterface): void;
}

export default function Login(props: IRegistrationPropsInterface) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    setError('')
  }, [email, name, password])

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch(event.target.name) {
      case 'email': setEmail(event.target.value)
        break
      case 'name': setName(event.target.value)
        break
      case 'password': setPassword(event.target.value)
        break
      case 'consfirm password': setConfirmPassword(event.target.value)
        break
    }    
  }

  const onFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    if(!validateEmail(email)) {
      setError('Email is wrong')
      return
    }
    setLoaded(false)
    const data = {
      email,
      name,
      password
    }
    fetch(api + 'user', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(() => {
      props.setUser({...data, avatar: ''})
      resetForm()
      navigate('/profile')
    }).catch(err => {
      setError('Something went wrong')
      console.error(err)
    })
    .finally(() => setLoaded(true))
  }

  const resetForm = () => {
    setEmail('')
    setName('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const validateForm = () => {
    if (!email.trim()) return 'Email is wrong'
    if (!name.trim()) return 'Name can not be empty'
    if (!password.trim()) return 'Password can not be empty'
    if (confirmPassword !== password) return 'Password confirmation is wrong'
    return ''
  }

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <div className='registration'>
      {
        loaded ? null : <Loader />
      }
      <form>
        <h2>Registration Form</h2>
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
          <label htmlFor='name'>Name</label>
          <input
            placeholder="Name"
            aria-label="Name"
            type="text"
            name="name"
            value={name}
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
        <div className='space-between block'>
          <label htmlFor='confirm password'>Confirm Password</label>
          <input
            type="password"
            name="consfirm password"
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            value={confirmPassword}
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
