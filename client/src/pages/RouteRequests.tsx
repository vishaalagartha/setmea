import React, { useEffect, useState } from 'react'
import { Tag, Typography, Row, Col, Space, List, Button } from 'antd'
import { type IRoute } from '../types/route'
import { deleteRoute, getClimberRequests } from '../api/route'
import { dateToString } from '../utils/date'
import { DeleteOutlined } from '@ant-design/icons'
import useMessage from 'antd/es/message/useMessage'

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
    <div>
      {contextHolder}
      <Row justify="center">
        <Typography.Title>My Pending Requests</Typography.Title>
      </Row>
      <Row justify="center">
        <Col xs={20} md={12} lg={10}>
          {routes.length === 0 && (
            <Typography.Title level={3} className="flex justify-center">
              You have no pending requests!
            </Typography.Title>
          )}
          {routes.length > 0 && (
            <List
              bordered={true}
              dataSource={routes}
              renderItem={(item, i) => {
                return (
                  <List.Item key={i} className="flex-col">
                    <Row justify="space-between" className="w-full">
                      <Typography.Title level={5}>Goal: {item.goal}</Typography.Title>
                      <Button
                        danger
                        onClick={() => {
                          handleDeleteRequest(item._id)
                        }}
                        icon={<DeleteOutlined />}
                      />
                    </Row>
                    <Row className="w-full">
                      <Typography.Text>Request on {dateToString(item.date)}</Typography.Text>
                    </Row>
                    <Row className="w-full">
                      <Col xs={24}>{item.details}</Col>
                    </Row>
                    <Row className="w-full">
                      <Typography.Title level={5}>Tags:</Typography.Title>
                    </Row>
                    <Row className="w-full">
                      <Space>
                        {item.tags.map((t, i) => (
                          <Tag key={i}>{t}</Tag>
                        ))}
                      </Space>
                    </Row>
                  </List.Item>
                )
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default RouteRequests
