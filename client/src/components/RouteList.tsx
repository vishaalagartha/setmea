import { useState } from 'react'
import { List, Typography, Space, Row, Tag, Col } from 'antd'
import { type IRoute } from '../types/route'
import SelectedRouteModal from './SelectedRouteModal'
import { dateToString } from '../utils/date'

interface RouteListProps {
  routes: IRoute[]
}

const RouteList: React.FC<RouteListProps> = ({ routes }: RouteListProps) => {
  const [openRouteModal, setOpenRouteModal] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<IRoute>()
  return (
    <Row justify="center">
      {selectedRoute !== undefined && (
        <SelectedRouteModal
          route={selectedRoute}
          open={openRouteModal}
          setOpen={setOpenRouteModal}
        />
      )}
      <Col xs={24} md={12} lg={10}>
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
      </Col>
    </Row>
  )
}

export default RouteList
