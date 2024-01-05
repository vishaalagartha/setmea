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
import { RoutesContext } from '../components/RoutesContext'

const SelectedRouteModal: React.FC = () => {
  const { routes, setRoutes, filteredRoutes, setFilteredRoutes, selectedRoute, setSelectedRoute } =
    useContext(RoutesContext) as {
      routes: IRoute[]
      setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
      filteredRoutes: IRoute[]
      setFilteredRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
      selectedRoute: IRoute
      setSelectedRoute: React.Dispatch<React.SetStateAction<IRoute | undefined>>
    }

  const [form] = useForm()
  const [message, contextHolder] = useMessage()
  const user = useAppSelector(userSelector)

  const handleFullfill: () => void = async () => {
    try {
      await form.validateFields()
      let res = await deleteRoute({ routeId: selectedRoute._id })
      setRoutes(routes.filter((r) => r._id !== selectedRoute._id))
      setFilteredRoutes !== undefined &&
        setFilteredRoutes(filteredRoutes.filter((r) => r._id !== selectedRoute._id))
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Fulfilled request!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
      res = await sendMessage(
        selectedRoute.user,
        `${user.username} fulfilled your route request of: ${selectedRoute.goal}`
      )
      const { content } = form.getFieldsValue() as { content: string }
      if (content !== undefined && content.length > 0) {
        res = await sendMessage(selectedRoute.user, content)
        if (res.status === 201) {
          setSelectedRoute(undefined)
          await message.open({
            type: 'success',
            content: `Sent response message to ${selectedRoute.username}`
          })
        } else {
          await message.open({ type: 'error', content: res.data.message })
        }
      } else {
        setSelectedRoute(undefined)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (selectedRoute === undefined) return null

  return (
    <Modal
      open={selectedRoute !== undefined}
      onCancel={() => {
        setSelectedRoute(undefined)
      }}
      title={
        <Flex justify="center">
          <Typography.Title level={3}>Goal: {selectedRoute.goal}</Typography.Title>
        </Flex>
      }
      footer={
        <Flex justify="center">
          <Button type="primary" onClick={handleFullfill}>
            Fulfill {selectedRoute.username}&apos;s request!
          </Button>
        </Flex>
      }
    >
      {contextHolder}
      <Flex vertical={true}>
        <Typography.Title level={5}>Requester: {selectedRoute.username}</Typography.Title>
        <Typography.Text>{selectedRoute.details}</Typography.Text>
        <Typography.Text className="mt-3">
          Requested on: {dateToString(selectedRoute.date)}
        </Typography.Text>
        <Typography.Title level={5}>Details:</Typography.Title>
        <Typography.Text>{selectedRoute.details}</Typography.Text>
        <Typography.Title level={5}>Tags:</Typography.Title>
        <Typography.Text className="my-3">
          <Space className="flex">
            {selectedRoute.tags.map((t, i) => (
              <Tag key={i}>{t}</Tag>
            ))}
          </Space>
        </Typography.Text>
        <Form form={form}>
          <Typography.Text className="my-3">
            Send {selectedRoute.username} a message notifying them that you set their route:
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
