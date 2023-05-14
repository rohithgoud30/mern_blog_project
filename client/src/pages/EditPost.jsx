import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
}

const EditPost = () => {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    files?.[0] && data.set('file', files?.[0])
    data.set('content', content)
    data.set('id', id)

    axios
      .put(`http://localhost:4000/post`, data, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          navigate(`/post/${id}`)
        }
      })
  }

  useEffect(() => {
    id &&
      axios
        .get(`http://localhost:4000/post/${id}`, { withCredentials: true })
        .then((res) => {
          setTitle(res.data.title)
          setSummary(res.data.summary)
          setContent(res.data.content)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='title'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        name='summary'
        placeholder='Summary'
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type='file' onChange={(e) => setFiles(e.target.files)} />
      <ReactQuill
        theme='snow'
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button type='submit' style={{ marginTop: '5px' }}>
        Update Post
      </button>
    </form>
  )
}

export default EditPost
