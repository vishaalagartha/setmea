import { Input, Modal, Form, Typography, Flex, Button, Radio } from 'antd'
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
  const options = [
    { label: 'Climber', value: 'climber' },
    { label: 'Setter', value: 'setter' }
  ]

  const handleRegistration: () => void = async () => {
    try {
      await form.validateFields()
      const { username, password, identity } = form.getFieldsValue()
      const res = await register({ username, password, identity })
      if (res.status === 201) {
        const { token, ...fieldsToStore } = res.data as { token: string; userId: string }
        dispatch(setUser(fieldsToStore))
        localStorage.setItem('token', token)
        localStorage.setItem('id', fieldsToStore.userId)
        navigate('/')
      } else {
        form.setFieldsValue({ username: '', password: '', identity: 'climber' })
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.setFieldsValue({ username: '', password: '', identity: 'climber' })
        setOpen(false)
      }}
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
          <Flex justify="center">
            <Form.Item
              label="I am a"
              name="identity"
              initialValue="climber"
              rules={[{ required: true }]}>
              <Radio.Group options={options} optionType="button" buttonStyle="solid" />
            </Form.Item>
          </Flex>
          <Flex justify="space-around">
            <Button type="primary" onClick={handleRegistration}>
              Register
            </Button>
            <Button
              type="default"
              onClick={() => {
                setOpen(false)
                form.setFieldsValue({ username: '', password: '', identity: 'climber' })
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
