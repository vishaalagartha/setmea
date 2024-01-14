import { Input, Modal, Form, Typography, Flex, Button, Space, App } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { requestResetPassword } from '../api/auth'
import { useNavigate } from 'react-router-dom'

interface PasswordResetModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  open,
  setOpen
}: PasswordResetModalProps) => {
  const [form] = useForm()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const handleResetPassword: () => void = async () => {
    try {
      await form.validateFields()
      const { email } = form.getFieldsValue() as { email: string }
      const res = await requestResetPassword(email)
      if (res.status === 200) {
        await message.success('Please check your email for a link to reset your password.')
        navigate('/')
      } else {
        await message.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await message.error(JSON.stringify(error))
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.setFieldsValue({ email: '' })
        setOpen(false)
      }}
      title={
        <Flex justify="center">
          <Typography.Title level={3}>Reset Password</Typography.Title>
        </Flex>
      }
      footer={null}>
      <Flex vertical={true} align="center">
        <Form form={form}>
          <Space direction="vertical">
            <Typography.Text>Please enter your email:</Typography.Text>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input an email' }]}>
              <Input placeholder="crusher@bishop.com" style={{ width: 400 }} />
            </Form.Item>
          </Space>
          <Flex justify="center">
            <Button type="primary" onClick={handleResetPassword}>
              Send email
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Modal>
  )
}

export default PasswordResetModal
