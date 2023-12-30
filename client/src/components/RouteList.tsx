import { useState } from 'react'
import { List, Typography, Space, Flex, Tag } from 'antd'
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
    <Flex justify="center">
      {selectedRoute !== undefined && (
        <SelectedRouteModal
          route={selectedRoute}
          open={openRouteModal}
          setOpen={setOpenRouteModal}
        />
      )}
      <List
        itemLayout="vertical"
        size="large"
        className="w-1/2"
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
              <List.Item.Meta
                title={
                  <Flex justify="space-around">
                    <Typography.Title level={3}>Goal: {item.goal}</Typography.Title>
                    <Typography.Text>Request on {dateToString(item.date)}</Typography.Text>
                  </Flex>
                }
                description={<div className="flex">User: {item.username}</div>}
              />
              <Flex>{item.details}</Flex>
              <Typography.Title className="mt-3 flex" level={5}>
                Tags:
              </Typography.Title>
              <Space className="flex">
                {item.tags.map((t, i) => (
                  <Tag key={i}>{t}</Tag>
                ))}
              </Space>
            </List.Item>
          )
        }}
      />
    </Flex>
  )
}

export default RouteList
