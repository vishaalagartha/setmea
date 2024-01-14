import { Flex, Form, Input, Typography, Button, App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { resetPasswordViaEmail } from '../api/auth'
import React from 'react'

const PasswordReset: React.FC = () => {
  const [form] = useForm()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const handleResetPassword: () => void = async () => {
    try {
      await form.validateFields()
      const { password1, password2 } = form.getFieldsValue() as {
        password1: string
        password2: string
      }
      if (password1 !== password2) {
        await message.error('Passwords must match.')
      }
      const queryParameters = new URLSearchParams(window.location.search)
      const token = queryParameters.get('token')
      const userId = queryParameters.get('id')
      if (token !== null && userId !== null) {
        localStorage.setItem('token', token)
        const res = await resetPasswordViaEmail(userId, password1)
        if (res.status === 200) {
          await message.success('Successfully reset password.')

          localStorage.removeItem('token')
          navigate('/')
        } else {
          await message.error(JSON.stringify(res.data.message))
        }
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex justify="center" align="center" className="h-screen">
      <Form form={form} className="w-1/2">
        <Flex justify="center">
          <Typography.Title level={3}>Reset your password</Typography.Title>
        </Flex>
        <Form.Item
          label="Password"
          name="password1"
          rules={[{ required: true, message: 'Please input a new password' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Retype Password"
          name="password2"
          rules={[{ required: true, message: 'Please retype your password' }]}>
          <Input.Password />
        </Form.Item>
        <Flex justify="center">
          <Button type="primary" onClick={handleResetPassword}>
            Reset
          </Button>
        </Flex>
      </Form>
    </Flex>
  )
}

export default PasswordReset
