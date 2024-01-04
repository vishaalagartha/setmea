import React, { useEffect } from 'react'
import { useAppSelector } from '../store/rootReducer'
import { Flex, Button } from 'antd'
import { userSelector } from '../store/userSlice'
import { Identity } from '../types/user'
import RouteRequestForm from '../components/RouteRequestForm'
import RouteFinderForm from '../components/RouteFinderForm'
import { Link, useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const { identity } = useAppSelector(userSelector)
  const navigate = useNavigate()
  useEffect(() => {
    if (identity === 'admin') navigate('/admin')
  }, [identity])

  return (
    <div>
      <Flex justify="end">
        {identity === Identity.CLIMBER && (
          <Link to="/route-requests">
            <Button type="primary">View my pending requests</Button>
          </Link>
        )}
        {identity === Identity.SETTER && (
          <Link to="/set-requests">
            <Button type="primary">View my setter requests</Button>
          </Link>
        )}
      </Flex>
      {identity === Identity.CLIMBER && <RouteRequestForm />}
      {identity === Identity.SETTER && <RouteFinderForm />}
    </div>
  )
}

export default Home
