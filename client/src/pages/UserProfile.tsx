import React, { useEffect, useState } from 'react'
import { Typography, Divider, Row, Col, Space, Image, App } from 'antd'
import { fetchUser } from '../api/auth'
import { useParams } from 'react-router-dom'
import { type IRoute } from '../types/route'
import { type IUser, Identity } from '../types/user'
import { getClimberClosedRequests, getSetterClosedRequests } from '../api/route'
import DefaultImage from '../assets/default.jpg'
import RouteList from '../components/RouteList'

const UserProfile: React.FC = () => {
  const { id } = useParams() as { id: string }
  const [user, setUser] = useState<IUser>()
  const [routes, setRoutes] = useState<IRoute[]>([])
  const { message } = App.useApp()

  useEffect(() => {
    const getUser: () => void = async () => {
      const res = await fetchUser({ uid: id })
      if (res.status === 200) {
        setUser(res.data as IUser)
      } else {
        await message.error(JSON.stringify(res.data.message))
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
          await message.error(JSON.stringify(res.data.message))
        }
      } else if (user?.identity === Identity.SETTER) {
        const res = await getSetterClosedRequests(user._id)
        if (res.status === 200) {
          setRoutes(res.data as IRoute[])
        } else {
          await message.error(JSON.stringify(res.data.message))
        }
      }
    }
    getUserHistory()
  }, [user])

  if (user === undefined) return null

  return (
    <>
      <Row justify="center">
        <Col xs={12} md={4}>
          {user?.avatar !== '' && (
            <Image preview={false} src={user.avatar} style={{ borderRadius: '50%' }} />
          )}
          {user?.avatar === '' && (
            <Image preview={false} src={DefaultImage} style={{ borderRadius: '50%' }} />
          )}
        </Col>
      </Row>
      <Row justify="center" className="mt-3">
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
          <Typography.Text>
            Height: {user?.height !== undefined ? user.height : '?'} in.
          </Typography.Text>
          <Typography.Text>
            Weight: {user?.weight !== undefined ? user.weight : '?'} lbs.
          </Typography.Text>
          <Typography.Text>
            Ape Index:
            {user?.apeIndex !== undefined && user.apeIndex > 0 && '+' + user.apeIndex}
            {user?.apeIndex !== undefined && user.apeIndex < 0 && '-' + user.apeIndex}
            {user?.apeIndex !== undefined && user.apeIndex === 0 && user.apeIndex}
            {user?.apeIndex === undefined && ' ?'}
          </Typography.Text>
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
              <Typography.Title level={5} className="flex justify-center">
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
