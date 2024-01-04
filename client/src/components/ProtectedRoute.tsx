import type { FC } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/rootReducer'
import { setUser, userSelector } from '../store/userSlice'
import { fetchUser as fetchUserAPI } from '../api/auth'
import Header from './Header'
import type { Identity } from '../types/user'
import useMessage from 'antd/es/message/useMessage'

interface ProtectedRouteProps {
  identity: Identity.ADMIN | Identity.CLIMBER | Identity.SETTER | undefined
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ identity }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelector)
  const [message, contextHolder] = useMessage()

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
        else navigate('/login')
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const checkIdentity: () => void = async () => {
      if (identity !== undefined && user.identity !== undefined && identity !== user.identity) {
        await message.open({
          type: 'error',
          content: 'Sorry, you do not have access to the requested page'
        })
        navigate('/login')
      }
    }
    checkIdentity()
  }, [user])

  return (
    <Header>
      {contextHolder}
      <Outlet />
    </Header>
  )
}

export default ProtectedRoute
