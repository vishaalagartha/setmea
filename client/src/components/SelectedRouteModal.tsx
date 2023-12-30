import { Input, Modal, Form, Typography, Flex, Button, Space, Tag } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useContext } from 'react'
import useMessage from 'antd/es/message/useMessage'
import { type IRoute } from '../types/route'
import { deleteRoute } from '../api/route'
import { sendMessage } from '../api/messages'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'
import { dateToString } from '../utils/date'
import { RoutesContext } from './RouteFinderForm'

interface SelectedRouteModalProps {
  route: IRoute
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectedRouteModal: React.FC<SelectedRouteModalProps> = ({
  open,
  setOpen,
  route
}: SelectedRouteModalProps) => {
  const { routes, setRoutes, filteredRoutes, setFilteredRoutes } = useContext(RoutesContext) as {
    routes: IRoute[]
    setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
    filteredRoutes: IRoute[]
    setFilteredRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
  }
  const [form] = useForm()
  const [message, contextHolder] = useMessage()
  const user = useAppSelector(userSelector)

  const handleFullfill: () => void = async () => {
    try {
      await form.validateFields()
      let res = await deleteRoute({ routeId: route._id })
      setRoutes(routes.filter((r) => r._id !== route._id))
      setFilteredRoutes(filteredRoutes.filter((r) => r._id !== route._id))
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Fulfilled request!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
      res = await sendMessage(
        route.user,
        `${user.username} fulfilled your route request of: ${route.goal}`
      )
      const { content } = form.getFieldsValue() as { content: string }
      if (content !== undefined && content.length > 0) {
        res = await sendMessage(route.user, content)
        if (res.status === 201) {
          setOpen(false)
          await message.open({
            type: 'success',
            content: `Sent response message to ${route.username}`
          })
        } else {
          await message.open({ type: 'error', content: res.data.message })
        }
      } else {
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false)
      }}
      title={
        <Flex justify="center">
          <Typography.Title level={3}>Goal: {route.goal}</Typography.Title>
        </Flex>
      }
      footer={
        <Flex justify="center">
          <Button type="primary" onClick={handleFullfill}>
            Fulfill {route.username}&apos;s request!
          </Button>
        </Flex>
      }>
      {contextHolder}
      <Flex vertical={true}>
        <Typography.Title level={5}>Requester: {route.username}</Typography.Title>
        <Typography.Text>{route.details}</Typography.Text>
        <Typography.Text className="mt-3">Requested on: {dateToString(route.date)}</Typography.Text>
        <Typography.Title level={5}>Details:</Typography.Title>
        <Typography.Text>{route.details}</Typography.Text>
        <Typography.Title level={5}>Tags:</Typography.Title>
        <Typography.Text className="my-3">
          <Space className="flex">
            {route.tags.map((t, i) => (
              <Tag key={i}>{t}</Tag>
            ))}
          </Space>
        </Typography.Text>
        <Form form={form}>
          <Typography.Text className="my-3">
            Send {route.username} a message notifying them that you set their route:
          </Typography.Text>
          <Form.Item name="content">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  )
}

export default SelectedRouteModal
