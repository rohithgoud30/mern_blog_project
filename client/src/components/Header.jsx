import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/userContext'
import { useContext, useEffect } from 'react'
import axios from 'axios'

const Header = () => {
  const user = useContext(UserContext)

  useEffect(() => {
    axios
      .get('http://localhost:4000/user', { withCredentials: true })
      .then((res) => {
        user.setUserName(res.data.username)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    axios
      .get('http://localhost:4000/logout', { withCredentials: true })
      .then(() => {
        user.setUserName('')
      })
  }

  return (
    <div>
      <header>
        <Link to='/' className='logo'>
          My Blog
        </Link>
        <nav>
          {!user.username && (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/register'>Register</Link>
            </>
          )}
          {!!user.username && (
            <>
              <Link to='/create'>Create new post</Link>
              <Link to='/' onClick={handleLogout}>
                Logout
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  )
}

export default Header
