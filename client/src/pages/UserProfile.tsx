import React, { useEffect, useState } from 'react'
import { Typography, Divider, Row, Col, Space } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import { fetchUser } from '../api/auth'
import { useParams } from 'react-router-dom'
import { type IRoute } from '../types/route'
import { type IUser, Identity } from '../types/user'
import { getClimberClosedRequests, getSetterClosedRequests } from '../api/route'
import RouteList from '../components/RouteList'

const UserProfile: React.FC = () => {
  const { id } = useParams() as { id: string }
  const [user, setUser] = useState<IUser>()
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [message, contextHolder] = useMessage()

  useEffect(() => {
    const getUser: () => void = async () => {
      const res = await fetchUser({ uid: id })
      if (res.status === 200) {
        setUser(res.data as IUser)
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    const getUserHistory: () => void = async () => {
      if (user?.identity === Identity.CLIMBER) {
        const res = await getClimberClosedRequests(user._id)
        if (res.status === 200) {
          setRoutes(res.data as IRoute[])
        } else {
          await message.open({ type: 'error', content: res.data.message })
        }
      } else if (user?.identity === Identity.SETTER) {
        const res = await getSetterClosedRequests(user._id)
        if (res.status === 200) {
          setRoutes(res.data as IRoute[])
        } else {
          await message.open({ type: 'error', content: res.data.message })
        }
      }
    }
    getUserHistory()
  }, [user])

  if (user === undefined) return null

  return (
    <>
      {contextHolder}
      <Row justify="center">
        <Typography.Title level={2}>{user.username}</Typography.Title>
      </Row>
      <Row justify="center">
        <Typography.Title level={3}>
          <strong>Location: </strong>
          {user?.location?.length !== 0 ? user.location.length : '?'}
        </Typography.Title>
      </Row>
      <Row justify="center">
        <Typography.Title level={3}>
          <strong>Email: </strong>
          {user.email}
        </Typography.Title>
      </Row>
      <Row justify="center">
        <Space>
          <Typography.Text>{user?.height !== 0 ? user.height : '?'} in.</Typography.Text>
          <Typography.Text>{user?.weight !== 0 ? user.weight : '?'} lbs.</Typography.Text>
          <Typography.Text>{user?.apeIndex !== 0 ? user.apeIndex : '?'} Ape Index</Typography.Text>
        </Space>
      </Row>
      <Divider />
      <Row justify="center">
        <Typography.Title level={3}>User History</Typography.Title>
      </Row>
      {routes.length === 0 && (
        <Row justify="center">
          <Col xs={20} md={12} lg={10}>
            {routes.length === 0 && (
              <Typography.Title level={3} className="flex justify-center">
                This user has no historical{' '}
                {user.identity === Identity.SETTER ? 'sets' : 'requests'}.
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
    </>
  )
}

export default UserProfile
