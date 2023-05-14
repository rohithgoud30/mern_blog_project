import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/userContext'
import { useContext, useState } from 'react'

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const user = useContext(UserContext)
  const handleSubmit = async (e) => {
    e.preventDefault()
    axios
      .post(
        'http://localhost:4000/login',
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          navigate('/')
          user.setUserName(res.data.username)
        }
      })
      .catch((err) => {
        alert(err.response.data.message)
      })
  }
  return (
    <form className='registerForm' onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type='text'
        name='username'
        placeholder='username'
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type='password'
        name='password'
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>Login</button>
    </form>
  )
}

export default Login
