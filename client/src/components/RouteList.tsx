import { List, Typography, Space, Row, Tag, Col, Button, Divider, Image, App } from 'antd'
import { type IRoute } from '../types/route'
import { dateToString } from '../utils/date'
import { DeleteOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'
import { deleteRoute, unvoteRoute, voteRoute } from '../api/route'
import { useNavigate } from 'react-router-dom'
import { Identity } from '../types/user'
import DefaultRoute from '../assets/default_route.png'
import ReactPlayer from 'react-player'

interface RouteListProps {
  routes: IRoute[]
  setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
  filteredRoutes: IRoute[] | undefined
  setFilteredRoutes: React.Dispatch<React.SetStateAction<IRoute[]>> | undefined
}

const RouteList: React.FC<RouteListProps> = ({
  routes,
  setRoutes,
  filteredRoutes,
  setFilteredRoutes
}: RouteListProps) => {
  const user = useAppSelector(userSelector)
  const { message } = App.useApp()

  const navigate = useNavigate()

  const handleLike: (route: IRoute) => void = async (route: IRoute) => {
    try {
      const res = await voteRoute(route._id)
      if (res.status === 201) {
        setRoutes(
          [
            ...routes.filter((r) => r._id !== route._id),
            {
              ...route,
              votes: [...route.votes, user._id],
              voterUsernames: [...route.voterUsernames, user.username]
            }
          ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        )
        setFilteredRoutes !== undefined &&
          filteredRoutes !== undefined &&
          setFilteredRoutes(
            [
              ...filteredRoutes.filter((r) => r._id !== route._id),
              {
                ...route,
                votes: [...route.votes, user._id],
                voterUsernames: [...route.voterUsernames, user.username]
              }
            ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          )
      } else {
        await message.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await message.error(JSON.stringify(error))
    }
  }

  const handleUnlike: (route: IRoute) => void = async (route: IRoute) => {
    try {
      const res = await unvoteRoute(route._id)
      if (res.status === 200) {
        setRoutes(
          [
            ...routes.filter((r) => r._id !== route._id),
            {
              ...route,
              votes: route.votes.filter((v) => v !== user._id),
              voterUsernames: route.voterUsernames.filter((v) => v !== user.username)
            }
          ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        )
        setFilteredRoutes !== undefined &&
          filteredRoutes !== undefined &&
          setFilteredRoutes(
            [
              ...filteredRoutes.filter((r) => r._id !== route._id),
              {
                ...route,
                votes: route.votes.filter((v) => v !== user._id),
                voterUsernames: route.voterUsernames.filter((v) => v !== user.username)
              }
            ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          )
      } else {
        await message.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await message.error(JSON.stringify(error))
    }
  }

  const handleDeleteRequest: (id: string) => void = async (id: string) => {
    try {
      const res = await deleteRoute({ routeId: id })
      setRoutes(
        routes
          .filter((r) => r._id !== id)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
      setFilteredRoutes !== undefined &&
        filteredRoutes !== undefined &&
        setFilteredRoutes(
          filteredRoutes
            .filter((r) => r._id !== id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        )
      if (res.status === 200) {
        await message.success('Deleted request.')
      } else {
        await message.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await message.error(JSON.stringify(error))
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
            const ActionButton: React.FC = () => {
              if (!item.open || user.identity === Identity.SETTER) return null
              if (user._id === item.user)
                return (
                  <Button
                    danger
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleDeleteRequest(item._id)
                      e.stopPropagation()
                    }}
                    icon={<DeleteOutlined />}
                  />
                )
              else if (isLiked && user._id !== item.user)
                return (
                  <Button
                    type="primary"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleUnlike(item)
                      e.stopPropagation()
                    }}
                    icon={<LikeFilled />}
                  />
                )
              else if (!isLiked && user._id !== item.user)
                return (
                  <Button
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleLike(item)
                      e.stopPropagation()
                    }}
                    icon={<LikeOutlined />}
                  />
                )
              return <></>
            }

            const url = item.media.find(
              (el: string) =>
                el.endsWith('jpg') ||
                el.endsWith('jpeg') ||
                el.endsWith('png') ||
                el.endsWith('mp4') ||
                el.endsWith('quicktime')
            )

            let RoutePreview: React.FC = () => (
              <Image src={DefaultRoute} preview={false} style={{ borderRadius: '50%' }} />
            )

            if (
              url !== undefined &&
              (url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('png'))
            ) {
              const Route: React.FC = () => <Image src={url} preview={false} />
              RoutePreview = Route
            } else if (url !== undefined) {
              const RouteVideo: React.FC = () => (
                <ReactPlayer
                  url={url}
                  height={'100%'}
                  width={'100%'}
                  loop={true}
                  playing={true}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nofullscreen'
                      }
                    }
                  }}
                />
              )
              RoutePreview = RouteVideo
            }

            return (
              <List.Item
                key={i}
                className={'cursor-pointer'}
                onClick={() => {
                  navigate(`/routes/${item._id}`, { state: item })
                }}>
                <div className="w-full">
                  <Row justify="space-between">
                    <Col xs={12}>
                      <Typography.Title level={5}>Goal: {item.goal}</Typography.Title>
                      <Typography.Title level={5}>
                        Requested on: {dateToString(item.date)}
                      </Typography.Title>
                      <Typography.Title level={5}>
                        Requester:{' '}
                        <Typography.Link
                          onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation()
                            navigate(`/profile/${item.user}`)
                          }}>
                          {item.username}
                        </Typography.Link>
                      </Typography.Title>
                    </Col>
                    <Col xs={10}>
                      <RoutePreview />
                    </Col>
                    <Col xs={{ span: 1, offset: 1 }}>
                      <ActionButton />
                    </Col>
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
                    {item.grade !== undefined && (
                      <Typography.Text>
                        <strong>Requested grade:</strong> V{item.grade}
                      </Typography.Text>
                    )}
                    {item.requestedSetter !== undefined && (
                      <Typography.Text>
                        <strong>Requested setter:</strong>{' '}
                        <Typography.Link
                          onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.stopPropagation()
                            navigate(`/profile/${item.requestedSetter}`)
                          }}>
                          {item.requestedSetterUsername}
                        </Typography.Link>
                      </Typography.Text>
                    )}
                  </Space>
                  <div>
                    {item.setter !== undefined && (
                      <Row>
                        <Typography.Text>
                          <strong>Setter:</strong>{' '}
                          <Typography.Link
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                              e.stopPropagation()
                              navigate(`/profile/${item.setter}`)
                            }}>
                            {item.setterUsername}
                          </Typography.Link>
                        </Typography.Text>
                      </Row>
                    )}
                  </div>
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
