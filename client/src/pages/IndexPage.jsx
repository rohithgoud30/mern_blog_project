import { useEffect, useState } from 'react'
import Post from '../components/Post'
import axios from 'axios'
const IndexPage = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    axios.get('http://localhost:4000/post').then((posts) => {
      setPosts(posts.data)
    })
  }, [])

  console.log({ posts })
  return (
    <>
      {posts.map((post) => {
        return <Post key={post._id} {...post} />
      })}
    </>
  )
}

export default IndexPage
