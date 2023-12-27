import { Input, Modal, Form, Typography, Flex, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { register } from '../api/auth'
import { useAppDispatch } from '../store/rootReducer'
import { setUser } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'
import useMessage from 'antd/es/message/useMessage'

interface RegistrationModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  open,
  setOpen
}: RegistrationModalProps) => {
  const [form] = useForm()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [message, contextHolder] = useMessage()

  const handleRegistration: () => void = async () => {
    try {
      await form.validateFields()
      const { username, password } = form.getFieldsValue()
      const res = await register({ username, password })
      if (res.status === 201) {
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
    <Modal
      open={open}
      title={
        <Flex justify="center">
          <Typography.Title level={3}>Register</Typography.Title>
        </Flex>
      }
      footer={null}>
      {contextHolder}
      <Flex vertical={true} align="center">
        <Form form={form} className="w-3/4">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input a username' }]}>
            <Input name="username" placeholder="Chris" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input a password' }]}>
            <Input name="password" placeholder="Sharma" />
          </Form.Item>
          <Flex justify="space-around">
            <Button type="primary" onClick={handleRegistration}>
              Register
            </Button>
            <Button
              type="default"
              onClick={() => {
                setOpen(false)
              }}>
              Cancel
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Modal>
  )
}

export default RegistrationModal
