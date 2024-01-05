import { Input, Modal, Form, Typography, Flex, Button, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { createGym } from '../api/gym'
import { states } from '../utils/constants'
interface GymFormProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const GymForm: React.FC<GymFormProps> = ({ open, setOpen }: GymFormProps) => {
  const [form] = useForm()
  const [message, contextHolder] = useMessage()

  const handleClick: () => void = async () => {
    try {
      await form.validateFields()
      const { name, address, city, state } = form.getFieldsValue()
      const res = await createGym({ name, address, city, state })
      if (res.status === 201) {
        await message.open({ type: 'success', content: 'Successfully created gym!' })
        form.setFieldsValue({ name: '', city: '', address: '', state: '' })
        setOpen(false)
      } else {
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
        form.setFieldsValue({ name: '', city: '', address: '', state: '' })
        setOpen(false)
      }}
      title={
        <Flex justify="center">
          <Typography.Title level={3}>Create Gym</Typography.Title>
        </Flex>
      }
      footer={null}
    >
      {contextHolder}
      <Flex vertical={true} align="center">
        <Form form={form} className="w-3/4">
          <Form.Item
            label="Gym Name"
            name="name"
            rules={[{ required: true, message: 'Please input a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gym Address"
            name="address"
            rules={[{ required: true, message: 'Please input an address' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input a city' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: 'Please input a state' }]}
          >
            <Select options={states} />
          </Form.Item>
          <Flex justify="space-around">
            <Button type="primary" onClick={handleClick}>
              Create Gym
            </Button>
            <Button
              type="default"
              onClick={() => {
                setOpen(false)
                form.setFieldsValue({ name: '', city: '', address: '', state: '' })
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Modal>
  )
}

export default GymForm
