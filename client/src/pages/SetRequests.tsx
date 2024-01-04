import React, { useEffect, useState } from 'react'
import { Tag, Typography, Row, Col, Space, List } from 'antd'
import { type IRoute } from '../types/route'
import { getSetterRequests } from '../api/route'
import { dateToString } from '../utils/date'
import SelectedRouteModal from '../components/SelectedRouteModal'
import { RoutesContext } from '../components/RouteFinderForm'

const SetRequests: React.FC = () => {
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [openRouteModal, setOpenRouteModal] = useState(false)
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
      value={{ routes, setRoutes, filteredRoutes: undefined, setFilteredRoutes: undefined }}>
      <Row justify="center">
        <Typography.Title>My Pending Requests</Typography.Title>
      </Row>
      {selectedRoute !== undefined && (
        <SelectedRouteModal
          route={selectedRoute}
          open={openRouteModal}
          setOpen={setOpenRouteModal}
        />
      )}
      <Row justify="center">
        <Col xs={20} md={12} lg={10}>
          {routes.length === 0 && (
            <Typography.Title level={3} className="flex justify-center">
              You have no pending sets.
            </Typography.Title>
          )}
          {routes.length > 0 && (
            <List
              bordered={true}
              dataSource={routes}
              renderItem={(item, i) => {
                return (
                  <List.Item
                    key={i}
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenRouteModal(true)
                      setSelectedRoute(item)
                    }}>
                    <div>
                      <Row>
                        <Typography.Title level={5}>Goal: {item.goal}</Typography.Title>
                      </Row>
                      <Row>
                        <Typography.Text>Request on {dateToString(item.date)}</Typography.Text>
                      </Row>
                      <Row>User: {item.username}</Row>
                      <Row>
                        <Col xs={24}>{item.details}</Col>
                      </Row>
                      <Typography.Title level={5}>Tags:</Typography.Title>
                      <Space>
                        {item.tags.map((t, i) => (
                          <Tag key={i}>{t}</Tag>
                        ))}
                      </Space>
                    </div>
                  </List.Item>
                )
              }}
            />
          )}
        </Col>
      </Row>
    </RoutesContext.Provider>
  )
}

export default SetRequests
