import React, { useEffect } from 'react'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'
import { Identity } from '../types/user'
import RouteRequestForm from '../components/RouteRequestForm'
import RouteFinderForm from './FindRoutes'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const { identity } = useAppSelector(userSelector)
  const navigate = useNavigate()
  useEffect(() => {
    if (identity === Identity.ADMIN) navigate('/admin')
  }, [identity])

  return (
    <div>
      {identity === Identity.CLIMBER && <RouteRequestForm />}
      {identity === Identity.SETTER && <RouteFinderForm />}
    </div>
  )
}

export default Home
