import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Flex, Form, Typography, Input, Button, Divider } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import { useForm } from 'antd/es/form/Form'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setUser } from '../store/userSlice'
import RegistrationModal from '../components/RegistrationModal'
import PasswordResetModal from '../components/PasswordResetModal'
import { login } from '../api/auth'
import { useNavigate } from 'react-router-dom'

const Landing: React.FC = () => {
  const [form] = useForm()
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [passwordResetModalOpen, setResetPasswordModalOpen] = useState(false)
  const dispatch = useDispatch()
  const [message, contextHolder] = useMessage()
  const navigate = useNavigate()

  const handleLogin: () => Promise<void> = async () => {
    try {
      await form.validateFields()
      const { username, password } = form.getFieldsValue()
      const res = await login({ username, password })
      if (res.status === 200) {
        const { token, ...fieldsToStore } = res.data as {
          token: string
          identity: string
          _id: string
        }
        dispatch(setUser(fieldsToStore))
        localStorage.setItem('token', token)
        localStorage.setItem('id', fieldsToStore._id)
        const { identity } = fieldsToStore as { identity: string }
        if (identity === 'admin') navigate('/admin')
        else navigate('/')
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Flex vertical={true} justify="center" align="center" className="h-screen">
      {contextHolder}
      <Typography.Title level={1}>Log In</Typography.Title>
      <Form form={form}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input a username' }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" className="w-100 h-10" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input a password!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Flex justify="center">
          <Form.Item>
            <Button
              type="primary"
              onClick={() => {
                void handleLogin()
              }}>
              Log In
            </Button>
          </Form.Item>
        </Flex>
        <Typography.Text>
          Have no account yet?{' '}
          <Typography.Link
            onClick={() => {
              setRegistrationModalOpen(true)
            }}>
            Sign Up
          </Typography.Link>
        </Typography.Text>
        <Divider />
        <Typography.Text>
          Forgot your password?{' '}
          <Typography.Link
            onClick={() => {
              setResetPasswordModalOpen(true)
            }}>
            Reset it here.
          </Typography.Link>
        </Typography.Text>
      </Form>
      <RegistrationModal open={registrationModalOpen} setOpen={setRegistrationModalOpen} />
      <PasswordResetModal open={passwordResetModalOpen} setOpen={setResetPasswordModalOpen} />
    </Flex>
  )
}

export default Landing
