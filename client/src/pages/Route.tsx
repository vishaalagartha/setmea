import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'
import { Identity } from '../types/user'
import { useNavigate, useParams } from 'react-router-dom'
import type { IRoute } from '../types/route'
import {
  Input,
  Image,
  Form,
  Typography,
  Flex,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Popover,
  Divider
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { closeRoute, getRoute, voteRoute, unvoteRoute, deleteRoute } from '../api/route'
import { sendMessage } from '../api/messages'
import { dateToString } from '../utils/date'
import { LikeFilled, LikeOutlined } from '@ant-design/icons'

const Route: React.FC = () => {
  const { id } = useParams() as { id: string }
  const [route, setRoute] = useState<IRoute>()
  const [form] = useForm()
  const [message, contextHolder] = useMessage()
  const user = useAppSelector(userSelector)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoute: () => void = async () => {
      const res = await getRoute(id)
      if (res.status === 200) {
        const route = res.data as IRoute
        setRoute(route)
      }
    }
    fetchRoute()
  }, [])

  if (route === undefined || route === null) return null

  const handleFullfill: () => void = async () => {
    try {
      await form.validateFields()
      let res = await closeRoute(route._id)
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Fulfilled request!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
      res = await sendMessage(
        route.user,
        `${
          user.username
        } fulfilled your route request. <a href='/routes/${route._id.toString()}>Click here to view your request.</a>`
      )
      const { content } = form.getFieldsValue() as { content: string }
      if (content !== undefined && content.length > 0) {
        res = await sendMessage(route.user, content)
        if (res.status === 201) {
          await message.open({
            type: 'success',
            content: `Sent response message to ${route.username}`
          })
        } else {
          await message.open({ type: 'error', content: res.data.message })
        }
      }
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLike: () => void = async () => {
    try {
      const res = await voteRoute(route._id)
      if (res.status === 201) {
        setRoute({
          ...route,
          votes: [...route.votes, user._id],
          voterUsernames: [...route.voterUsernames, user.username]
        })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
      await message.open({ type: 'error', content: JSON.stringify(error) })
    }
  }

  const handleUnlike: () => void = async () => {
    try {
      const res = await unvoteRoute(route._id)
      if (res.status === 200) {
        setRoute({
          ...route,
          votes: route.votes.filter((v) => v !== user._id),
          voterUsernames: route.voterUsernames.filter((v) => v !== user.username)
        })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
      await message.open({ type: 'error', content: JSON.stringify(error) })
    }
  }
  const handleDelete: () => void = async () => {
    try {
      const res = await deleteRoute({ routeId: route._id })
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Deleted request.' })
        navigate(-1)
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
      await message.open({ type: 'error', content: JSON.stringify(error) })
    }
  }

  const LikeContent: React.FC = () =>
    route.voterUsernames.length === 0 ? (
      <div>This route has no votes</div>
    ) : (
      <div>
        {route.voterUsernames.map((v: string, i: number) => (
          <div key={i}>{v}</div>
        ))}
      </div>
    )

  return (
    <Flex vertical={true}>
      {contextHolder}
      <Row>
        <Col md={{ offset: 6, span: 12 }}>
          <Typography.Title level={3}>Goal: {route.goal}</Typography.Title>
          <Typography.Title level={5}>
            Requester:
            <Typography.Link href={`/profile/${route.user}`}> {route.username}</Typography.Link>
          </Typography.Title>
          <Typography.Text className="mt-3">
            Requested on: {dateToString(route.date)}
          </Typography.Text>
          <Typography.Title level={5}>Additional Details:</Typography.Title>
          <Typography.Text>{route.details}</Typography.Text>
          <Typography.Title level={5}>Tags:</Typography.Title>
          <Typography.Text className="my-3">
            <Space className="flex">
              {route.tags.map((t: string, i: number) => (
                <Tag key={i}>{t}</Tag>
              ))}
            </Space>
          </Typography.Text>
          <Flex className="my-3">
            <Popover content={<LikeContent />} className="cursor-pointer">
              {route.votes.includes(user._id) && <LikeFilled className={'text-xl text-sky-700'} />}
              {!route.votes.includes(user._id) && <LikeOutlined className={'text-xl'} />}
              <span className="ml-1">{route.votes.length} Current Votes</span>
            </Popover>
          </Flex>
          <Space className="my-3">
            {route.grade !== undefined && (
              <Typography.Text>
                <strong>Requested grade:</strong> V{route.grade}
              </Typography.Text>
            )}
            {route.requestedSetter !== undefined && (
              <Typography.Text>
                <strong>Requested setter:</strong>{' '}
                <Typography.Link href={`/profile/${route.requestedSetter}`}>
                  {route.requestedSetterUsername}
                </Typography.Link>
              </Typography.Text>
            )}
          </Space>
          <div>
            {route.setter !== undefined && (
              <Row>
                <Typography.Text>
                  <strong>Setter:</strong>{' '}
                  <Typography.Link href={`/profile/${route.setter}`}>
                    {route.setterUsername}
                  </Typography.Link>
                </Typography.Text>
              </Row>
            )}
          </div>
          <Divider />
          <Typography.Title level={5}>Route Media</Typography.Title>
          {route.media.length === 0 && <Typography.Text>This route has no media</Typography.Text>}
          <Image.PreviewGroup>
            {route.media.map((r, i) => {
              return <Image key={i} src={r} />
            })}
          </Image.PreviewGroup>
          <Divider />
        </Col>
      </Row>
      {user.identity === Identity.SETTER && route.open && (
        <>
          <Row justify="center" className="my-3">
            <Col xs={20} md={10}>
              <Form form={form}>
                <Typography.Text className="my-3">
                  Send {route.username} a message notifying them that you set their route:
                </Typography.Text>
                <Form.Item name="content">
                  <Input.TextArea />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row justify="center">
            <Button type="primary" onClick={handleFullfill}>
              Fullfill request
            </Button>
          </Row>
        </>
      )}
      {user._id === route.user && route.open && (
        <Row justify="center">
          <Button danger onClick={handleDelete}>
            Delete request
          </Button>
        </Row>
      )}
      {user.identity === Identity.CLIMBER &&
        user._id !== route.user &&
        !route.votes.includes(user._id) &&
        route.open && (
          <Row justify="center" onClick={handleLike}>
            <Button type="primary">Like this climb</Button>
          </Row>
        )}
      {user.identity === Identity.CLIMBER &&
        user._id !== route.user &&
        route.votes.includes(user._id) &&
        route.open && (
          <Row justify="center" onClick={handleUnlike}>
            <Button type="primary">Unlike this climb</Button>
          </Row>
        )}
    </Flex>
  )
}

export default Route
