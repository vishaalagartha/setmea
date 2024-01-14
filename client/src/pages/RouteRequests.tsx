import React, { useEffect, useState } from 'react'
import { Typography, Row, Col, App } from 'antd'
import { type IRoute } from '../types/route'
import { getClimberOpenRequests } from '../api/route'
import RouteList from '../components/RouteList'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'

const RouteRequests: React.FC = () => {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const { message } = App.useApp()
  const user = useAppSelector(userSelector)

  useEffect(() => {
    const fetchRequests: () => void = async () => {
      if (user?._id?.length !== 0) {
        const res = await getClimberOpenRequests(user._id)
        if (res.status === 200) {
          const routes = res.data as IRoute[]
          setRoutes(routes)
        } else {
          await message.error(JSON.stringify(res.data.message))
        }
      }
    }
    fetchRequests()
  }, [user])

  return (
    <div>
      <Row justify="center">
        <Typography.Title level={3}>My Pending Requests</Typography.Title>
      </Row>
      {routes.length === 0 && (
        <Row justify="center">
          <Col xs={20} md={12} lg={10}>
            {routes.length === 0 && (
              <Typography.Title level={4} className="flex justify-center">
                You have no pending requests!
              </Typography.Title>
            )}
          </Col>
        </Row>
      )}
      {routes.length > 0 && (
        <RouteList
          routes={routes}
          setRoutes={setRoutes}
          filteredRoutes={undefined}
          setFilteredRoutes={undefined}
        />
      )}
    </div>
  )
}

export default RouteRequests
