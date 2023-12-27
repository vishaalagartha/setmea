import type { FC } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '../store/rootReducer'
import { setUser } from '../store/userSlice'
import { fetchUser as fetchUserAPI } from '../api/auth'
import Header from './Header'

const ProtectedRoute: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('id')
    if (token === null || token === '') {
      navigate('/login')
    }
    const fetchUser: () => void = async () => {
      if (typeof uid === 'string') {
        const res = await fetchUserAPI({ uid })
        dispatch(setUser(res))
      }
    }
    fetchUser()
  }, [])

  return (
    <Header>
      <Outlet />
    </Header>
  )
}

export default ProtectedRoute
