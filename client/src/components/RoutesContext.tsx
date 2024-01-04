import { createContext } from 'react'
import { IRoute } from '../types/route'

interface RoutesInterface {
  routes: IRoute[]
  setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
  filteredRoutes: IRoute[] | undefined
  setFilteredRoutes: React.Dispatch<React.SetStateAction<IRoute[]>> | undefined
  selectedRoute: IRoute | undefined
  setSelectedRoute: React.Dispatch<React.SetStateAction<IRoute | undefined>> | undefined
  onDelete: ((id: string) => void) | undefined
}

export const RoutesContext = createContext<RoutesInterface | undefined>(undefined)
