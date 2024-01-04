import React, { useEffect, useState } from 'react'
import { Typography, Row, Col } from 'antd'
import { type IRoute } from '../types/route'
import { deleteRoute, getClimberRequests } from '../api/route'
import useMessage from 'antd/es/message/useMessage'
import { RoutesContext } from '../components/RoutesContext'
import RouteList from '../components/RouteList'

const RouteRequests: React.FC = () => {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [message, contextHolder] = useMessage()

  useEffect(() => {
    const fetchRequests: () => void = async () => {
      const res = await getClimberRequests()
      if (res.status === 200) {
        const routes = res.data as IRoute[]
        setRoutes(routes)
      }
    }
    fetchRequests()
  }, [])

  const handleDeleteRequest: (id: string) => void = async (id: string) => {
    try {
      const res = await deleteRoute({ routeId: id })
      setRoutes(routes.filter((r) => r._id !== id))
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Deleted request.' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
      await message.open({ type: 'error', content: JSON.stringify(error) })
    }
  }

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        filteredRoutes: undefined,
        setFilteredRoutes: undefined,
        selectedRoute: undefined,
        setSelectedRoute: undefined,
        onDelete: handleDeleteRequest
      }}>
      {contextHolder}
      <Row justify="center">
        <Typography.Title>My Pending Requests</Typography.Title>
      </Row>
      {routes.length === 0 && (
        <Row justify="center">
          <Col xs={20} md={12} lg={10}>
            {routes.length === 0 && (
              <Typography.Title level={3} className="flex justify-center">
                You have no pending requests!
              </Typography.Title>
            )}
          </Col>
        </Row>
      )}
      {routes.length > 0 && <RouteList />}
    </RoutesContext.Provider>
  )
}

export default RouteRequests
