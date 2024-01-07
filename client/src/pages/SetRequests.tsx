import React, { useEffect, useState } from 'react'
import { Typography, Row, Col } from 'antd'
import { type IRoute } from '../types/route'
import { getSetterOpenRequests } from '../api/route'
import RouteList from '../components/RouteList'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'

const SetRequests: React.FC = () => {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const user = useAppSelector(userSelector)

  useEffect(() => {
    const fetchSets: () => void = async () => {
      if (user?._id?.length != 0) {
        const res = await getSetterOpenRequests(user._id)
        if (res.status === 200) {
          const routes = res.data as IRoute[]
          setRoutes(routes)
        }
      }
    }
    fetchSets()
  }, [user])

  return (
    <div>
      <Row justify="center">
        <Typography.Title level={3}>My Pending Sets</Typography.Title>
      </Row>
      {routes.length === 0 && (
        <Row justify="center">
          <Col xs={20} md={12} lg={10}>
            {routes.length === 0 && (
              <Typography.Title level={4} className="flex justify-center">
                You have no pending sets.
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

export default SetRequests
