import React from 'react'
import { useAppSelector } from '../store/rootReducer'
import { Identity, userSelector } from '../store/userSlice'
import RouteRequestForm from '../components/RouteRequestForm'
import RouteFinderForm from '../components/RouteFinderForm'

const Home: React.FC = () => {
  const { identity } = useAppSelector(userSelector)
  return (
    <div>
      {identity === Identity.CLIMBER && <RouteRequestForm />}
      {identity === Identity.SETTER && <RouteFinderForm />}
    </div>
  )
}

export default Home
