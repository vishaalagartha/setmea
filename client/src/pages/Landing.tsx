import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Row, Col, Form, Typography, Input, Button } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import { useForm } from 'antd/es/form/Form'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setUser } from '../store/userSlice'
import RegistrationModal from '../components/RegistrationModal'
import { login } from '../api/auth'
import { useNavigate } from 'react-router-dom'

const Landing: React.FC = () => {
  const [form] = useForm()
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  // eslint-disable-next-line
  const dispatch = useDispatch()
  const [message, contextHolder] = useMessage()
  const navigate = useNavigate()

  const handleLogin: () => Promise<void> = async () => {
    try {
      await form.validateFields()
      const { username, password } = form.getFieldsValue()
      const res = await login({ username, password })
      if (res.status === 200) {
        const { token, ...fieldsToStore } = res as { token: string; userId: string }
        dispatch(setUser(fieldsToStore))
        localStorage.setItem('token', token)
        localStorage.setItem('id', fieldsToStore.userId)
        navigate('/')
      } else {
        await message.open({ type: 'error', content: res.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={14} lg={14} xl={14}>
          <Row justify="center" align="middle">
            {contextHolder}
            <div>
              <Typography.Title level={1}>Log In</Typography.Title>
              <Form form={form}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input a username' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Username" className="w-100 h-10" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input a password!' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    onClick={() => {
                      void handleLogin()
                    }}>
                    Log In
                  </Button>
                </Form.Item>
              </Form>
              <Typography.Text>
                Have no account yet?{' '}
                <Typography.Link
                  onClick={() => {
                    setRegistrationModalOpen(true)
                  }}>
                  Sign Up
                </Typography.Link>
              </Typography.Text>
              <RegistrationModal open={registrationModalOpen} setOpen={setRegistrationModalOpen} />
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Landing
