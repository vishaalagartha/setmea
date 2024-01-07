import React, { useEffect, useState } from 'react'
import { Typography, Row, Col } from 'antd'
import { type IRoute } from '../types/route'
import { Identity } from '../types/user'
import { getSetterClosedRequests, getClimberClosedRequests } from '../api/route'
import RouteList from '../components/RouteList'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'

const RouteHistory: React.FC = () => {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const user = useAppSelector(userSelector)

  useEffect(() => {
    const fetchHistory: () => void = async () => {
      if (user?._id.length !== 0) {
        const res =
          user.identity === Identity.SETTER
            ? await getSetterClosedRequests(user._id)
            : await getClimberClosedRequests(user._id)
        if (res.status === 200) {
          const routes = res.data as IRoute[]
          setRoutes(routes)
        }
      }
    }
    fetchHistory()
  }, [user])

  return (
    <div>
      <Row justify="center">
        <Typography.Title level={3}>
          My {user.identity === Identity.SETTER ? 'Set' : 'Request'} History
        </Typography.Title>
      </Row>
      {routes.length === 0 && (
        <Row justify="center">
          <Col xs={20} md={12} lg={10}>
            {routes.length === 0 && (
              <Typography.Title level={3} className="flex justify-center">
                You have no historical {user.identity === Identity.SETTER ? 'sets' : 'requests'}.
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

export default RouteHistory
