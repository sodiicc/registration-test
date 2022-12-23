import React, { useState } from 'react'
import { api, IUserInterface } from '../App';
import Loader from './Loader'

interface IProfilePropsInterface {
  user: IUserInterface;
  setAvatar(avatar: string): void;
}

export default function Login(props: IProfilePropsInterface) {
  const [loaded, setLoaded] = useState(true)
  const [icon, setIcon] = useState(props.user.avatar)
  const [img, setImg] = useState('')

  const onSetAvatar = (event: any) => {
    setImg(event.target.files[0])
    const newImageUrl = URL.createObjectURL(event.target.files[0])
    setIcon(newImageUrl)
  }

  const onBtnClick = () => {
    const formData = new FormData()
    formData.append('image', img)
    formData.append('email', props.user.email)
    fetch(api + `user?email=${props.user.email}`, {
      method: 'PATCH',
      body: formData
    }).then(() => {
      props.setAvatar(icon)
    }).catch(err => {
      console.error(err)
    })
      .finally(() => setLoaded(true))
  }

  return (
    <div className='profile'>
      {
        loaded ? null : <Loader />
      }
      <div className='user-info'>
        <p>User Name: <span>{props.user.name}</span></p>
        <p>User Email: <span>{props.user.email}</span></p>
      </div>
      {
        icon &&
        <div>
          <p>User Avatar:</p>
          <img src={icon} alt="avatar" />
        </div>
      }
      <input type='file' onChange={onSetAvatar}></input>
      {
        img &&
        <div style={{ marginTop: '20px' }}>
          <button onClick={onBtnClick}>Set Avatar</button>
        </div>
      }
    </div>
  )
}
