import React, { useEffect, useState } from 'react'
import { AutoComplete, Flex, Button, Form, Input, Typography, Divider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { deleteUser, getUsersByIdentity } from '../../api/user'
import { type IUser } from '../../types/user'
import { sendMessage } from '../../api/messages'

const AdminUsers: React.FC = () => {
  const [form] = useForm()
  const [climbers, setClimbers] = useState<IUser[]>([])
  const [message, contextHolder] = useMessage()
  const [selectedClimber, setSelectedClimber] = useState<IUser>()

  const fetchSetters: () => void = async () => {
    const res = await getUsersByIdentity('climber')
    if (res.status === 200) {
      const gymData = res.data as IUser[]
      setClimbers(gymData)
    }
  }

  useEffect(() => {
    fetchSetters()
  }, [])

  const handleDeleteClimber: () => void = async () => {
    try {
      if (selectedClimber === undefined) return
      const res = await deleteUser(selectedClimber._id)
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Successfully deleted climber!' })
        setSelectedClimber(undefined)
        fetchSetters()
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendMessage: () => void = async () => {
    try {
      await form.validateFields()
      if (selectedClimber === undefined) return
      const { content } = form.getFieldsValue() as { content: string }
      const res = await sendMessage(selectedClimber._id, content)
      if (res.status === 201) {
        await message.open({ type: 'success', content: 'Successfully sent message!' })
      } else {
        form.setFieldsValue({ content: '' })
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex vertical={true} align="center">
      {contextHolder}
      <Typography.Text>Search for a climber</Typography.Text>
      <AutoComplete
        options={climbers.map((g) => ({
          label: `${g.username}`,
          value: `${g.username}`
        }))}
        style={{ width: '50%' }}
        filterOption={(inputValue, option) => {
          if (option === undefined) return false
          return option.label.includes(inputValue)
        }}
        onSelect={(value) => {
          const setter = climbers.find((s) => s.username === value)
          setSelectedClimber(setter)
        }}
      />
      {selectedClimber !== undefined && (
        <Button danger onClick={handleDeleteClimber} className="mt-5">
          Delete Climber
        </Button>
      )}
      <Divider />
      {selectedClimber !== undefined && (
        <Form form={form}>
          <Typography.Title level={3}>Send {selectedClimber.username} a message</Typography.Title>
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Please input a message.' }]}>
            <Input.TextArea />
          </Form.Item>
          <Flex justify="center">
            <Button type="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </Flex>
        </Form>
      )}
    </Flex>
  )
}

export default AdminUsers
