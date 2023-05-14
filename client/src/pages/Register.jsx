import { useState } from 'react'
import axios from 'axios'

const Register = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    axios
      .post(
        'http://localhost:4000/register',
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 201) {
          alert('Registration successful')
        }
      })
      .catch((err) => {
        alert(err.response.data.message)
      })
  }
  return (
    <form className='registerForm' onSubmit={handleSubmit}>
      <h1>Register</h1>
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
      <button type='submit'>Register</button>
    </form>
  )
}

export default Register
