import { useContext } from 'react'
import { List, Typography, Space, Row, Tag, Col, Button, Divider } from 'antd'
import { type IRoute } from '../types/route'
import SelectedRouteModal from './SelectedRouteModal'
import { dateToString } from '../utils/date'
import { RoutesContext } from '../components/RoutesContext'
import { DeleteOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'
import useMessage from 'antd/es/message/useMessage'
import { unvoteRoute, voteRoute } from '../api/route'
import { Identity } from '../types/user'

const RouteList: React.FC = () => {
  const user = useAppSelector(userSelector)
  const [message, contextHolder] = useMessage()
  const { routes, setRoutes, setSelectedRoute, onDelete } = useContext(RoutesContext) as {
    routes: IRoute[]
    setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
    setSelectedRoute: React.Dispatch<React.SetStateAction<IRoute | undefined>>
    onDelete: ((id: string) => void) | undefined
  }

  const handleLike: (route: IRoute) => void = async (route: IRoute) => {
    try {
      const res = await voteRoute(route._id)
      if (res.status === 201) {
        setRoutes([
          ...routes.filter((r) => r._id !== route._id),
          {
            ...route,
            votes: [...route.votes, user._id],
            voterUsernames: [...route.voterUsernames, user.username]
          }
        ])
      } else {
        message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
      message.open({ type: 'error', content: JSON.stringify(error) })
    }
  }

  const handleUnlike: (route: IRoute) => void = async (route: IRoute) => {
    try {
      const res = await unvoteRoute(route._id)
      if (res.status === 200) {
        setRoutes([
          ...routes.filter((r) => r._id !== route._id),
          {
            ...route,
            votes: route.votes.filter((v) => v !== user._id),
            voterUsernames: route.voterUsernames.filter((v) => v !== user.username)
          }
        ])
      } else {
        message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
      message.open({ type: 'error', content: JSON.stringify(error) })
    }
  }

  return (
    <Row justify="center">
      <Col xs={20} md={12} lg={10}>
        <List
          bordered={true}
          dataSource={routes}
          renderItem={(item, i) => {
            const isLiked = item.votes.includes(user._id)
            /* 
            onDelete is defined if user is the creator 
            Otherwise, render the like/unlike buttons
            */
            const ActionButton = () => {
              if (setSelectedRoute !== undefined) return null
              else if (onDelete !== undefined)
                return (
                  <Button
                    danger
                    onClick={() => {
                      onDelete(item._id)
                    }}
                    icon={<DeleteOutlined />}
                  />
                )
              else if (isLiked && user._id !== item.user)
                return (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleUnlike(item)
                    }}
                    icon={<LikeFilled />}
                  />
                )
              else if (!isLiked && user._id !== item.user)
                return (
                  <Button
                    onClick={() => {
                      handleLike(item)
                    }}
                    icon={<LikeOutlined />}
                  />
                )
              return <></>
            }
            return (
              <List.Item
                key={i}
                className={user.identity === Identity.SETTER ? 'cursor-pointer' : ''}
                onClick={() => {
                  setSelectedRoute !== undefined && setSelectedRoute(item)
                }}
              >
                <div className="w-full">
                  <Row justify="space-between">
                    <Typography.Title level={5}>Goal: {item.goal}</Typography.Title>
                    <ActionButton />
                  </Row>
                  <Row>
                    <Typography.Title level={5}>
                      Requested on: {dateToString(item.date)}
                    </Typography.Title>
                  </Row>
                  <Row>
                    <Typography.Title level={5}>Requester: {item.username}</Typography.Title>
                  </Row>
                  <Row>Additional Details:</Row>
                  <Row>
                    <Col xs={24}>{item.details}</Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col xs={12}>
                      <Typography.Title level={5}>Tags:</Typography.Title>
                      <Space>
                        {item.tags.map((t, i) => (
                          <Tag key={i}>{t}</Tag>
                        ))}
                      </Space>
                    </Col>
                    <Col xs={{ span: 10, offset: 2 }}>
                      <Typography.Text>Votes: {item.votes.length}</Typography.Text>
                    </Col>
                  </Row>
                  <Space className="my-3">
                    {item.grade && (
                      <Typography.Text>
                        <strong>Requested grade:</strong> V{item.grade}
                      </Typography.Text>
                    )}
                    {item.requestedSetter && (
                      <Typography.Text>
                        <strong>Requested setter:</strong> {item.requestedSetterUsername}
                      </Typography.Text>
                    )}
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
