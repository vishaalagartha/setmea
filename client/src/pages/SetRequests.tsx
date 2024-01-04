import React, { useEffect, useState } from 'react'
import { Typography, Row, Col } from 'antd'
import { type IRoute } from '../types/route'
import { getSetterRequests } from '../api/route'
import RouteList from '../components/RouteList'
import SelectedRouteModal from '../components/SelectedRouteModal'
import { RoutesContext } from '../components/RoutesContext'

const SetRequests: React.FC = () => {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<IRoute>()

  useEffect(() => {
    const fetchSets: () => void = async () => {
      const res = await getSetterRequests()
      if (res.status === 200) {
        const routes = res.data as IRoute[]
        setRoutes(routes)
      }
    }
    fetchSets()
  }, [])

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        filteredRoutes: undefined,
        setFilteredRoutes: undefined,
        selectedRoute,
        setSelectedRoute,
        onDelete: undefined
      }}>
      <Row justify="center">
        <Typography.Title>My Pending Sets</Typography.Title>
      </Row>
      <SelectedRouteModal />
      {routes.length === 0 && (
        <Row justify="center">
          <Col xs={20} md={12} lg={10}>
            {routes.length === 0 && (
              <Typography.Title level={3} className="flex justify-center">
                You have no pending sets.
              </Typography.Title>
            )}
          </Col>
        </Row>
      )}
      {routes.length > 0 && <RouteList />}
    </RoutesContext.Provider>
  )
}

export default SetRequests
