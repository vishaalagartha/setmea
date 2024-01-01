import React, { useEffect, useState } from 'react'
import { AutoComplete, Flex, Button, Form, Input, Typography, Divider } from 'antd'
import { register, requestResetPassword } from '../../api/auth'
import { deleteUser, getUsersByIdentity } from '../../api/user'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { type IUser } from '../../types/user'
import { useNavigate } from 'react-router-dom'

const AdminSetters: React.FC = () => {
  const [form] = useForm()
  const [setters, setSetters] = useState<IUser[]>([])
  const [message, contextHolder] = useMessage()
  const navigate = useNavigate()
  const [selectedSetter, setSelectedSetter] = useState<IUser>()

  const fetchSetters: () => void = async () => {
    const res = await getUsersByIdentity('setter')
    if (res.status === 200) {
      const gymData = res.data as IUser[]
      setSetters(gymData)
    }
  }

  useEffect(() => {
    fetchSetters()
  }, [])

  const handleDeleteSetter: () => void = async () => {
    try {
      if (selectedSetter === undefined) return
      const res = await deleteUser(selectedSetter._id)
      if (res.status === 200) {
        await message.open({ type: 'success', content: 'Successfully deleted setter!' })
        setSelectedSetter(undefined)
        fetchSetters()
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateSetter: () => void = async () => {
    try {
      await form.validateFields()
      const { username, email } = form.getFieldsValue() as { username: string; email: string }
      const password = Math.random().toString(36).slice(-8)
      const registerRes = await register({ username, password, identity: 'setter', email })
      if (registerRes.status === 201) {
        const requestResetResp = await requestResetPassword(email)
        if (requestResetResp.status === 200) {
          await message.open({
            type: 'success',
            content: `Please have ${username} navigate to their email to and reset their password within the next hour.`
          })
          navigate('/')
        } else {
          form.setFieldsValue({ username: '', email: '' })
          await message.open({ type: 'error', content: requestResetResp.data.message })
        }
      } else {
        form.setFieldsValue({ username: '', email: '' })
        await message.open({ type: 'error', content: registerRes.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex vertical={true} align="center">
      {contextHolder}
      <Typography.Text>Search for a setter to remove</Typography.Text>
      <AutoComplete
        options={setters.map((g) => ({
          label: `${g.username}`,
          value: `${g.username}`
        }))}
        style={{ width: '50%' }}
        filterOption={(inputValue, option) => {
          if (option === undefined) return false
          return option.label.includes(inputValue)
        }}
        onSelect={(value) => {
          const setter = setters.find((s) => s.username === value)
          setSelectedSetter(setter)
        }}
      />
      {selectedSetter !== undefined && (
        <Button danger onClick={handleDeleteSetter} className="mt-5">
          Delete Setter
        </Button>
      )}
      <Divider />
      <Form form={form}>
        <Typography.Title level={3}>Create a setter</Typography.Title>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input a username' }]}>
          <Input placeholder="Chris" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'Invalid email' },
            { required: true, message: 'Please input a email' }
          ]}>
          <Input placeholder="crusher@bishop.com" />
        </Form.Item>
        <Flex justify="center">
          <Button type="primary" onClick={handleCreateSetter}>
            Create Setter
          </Button>
        </Flex>
      </Form>
    </Flex>
  )
}

export default AdminSetters
