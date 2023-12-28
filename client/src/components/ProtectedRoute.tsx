import type { FC } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/rootReducer'
import { setUser, userSelector } from '../store/userSlice'
import { fetchUser as fetchUserAPI } from '../api/auth'
import Header from './Header'

const ProtectedRoute: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelector)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('id')
    if (token === null || token === '') {
      navigate('/login')
    }
    const fetchUser: () => void = async () => {
      if (user._id === '' && typeof uid === 'string') {
        const res = await fetchUserAPI({ uid })
        if (res.status === 200) dispatch(setUser(res.data))
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
