import { Input, Modal, Form, Typography, Flex, Button, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { createGym } from '../api/gym'

const states = [
  { name: 'AL', value: 'AL' },
  { name: 'AK', value: 'AK' },
  { name: 'AS', value: 'AS' },
  { name: 'AZ', value: 'AZ' },
  { name: 'AR', value: 'AR' },
  { name: 'CA', value: 'CA' },
  { name: 'CO', value: 'CO' },
  { name: 'CT', value: 'CT' },
  { name: 'DE', value: 'DE' },
  { name: 'DC', value: 'DC' },
  { name: 'FM', value: 'FM' },
  { name: 'FL', value: 'FL' },
  { name: 'GA', value: 'GA' },
  { name: 'GU', value: 'GU' },
  { name: 'HI', value: 'HI' },
  { name: 'ID', value: 'ID' },
  { name: 'IL', value: 'IL' },
  { name: 'IN', value: 'IN' },
  { name: 'IA', value: 'IA' },
  { name: 'KS', value: 'KS' },
  { name: 'KY', value: 'KY' },
  { name: 'LA', value: 'LA' },
  { name: 'ME', value: 'ME' },
  { name: 'MH', value: 'MH' },
  { name: 'MD', value: 'MD' },
  { name: 'MA', value: 'MA' },
  { name: 'MI', value: 'MI' },
  { name: 'MN', value: 'MN' },
  { name: 'MS', value: 'MS' },
  { name: 'MO', value: 'MO' },
  { name: 'MT', value: 'MT' },
  { name: 'NE', value: 'NE' },
  { name: 'NV', value: 'NV' },
  { name: 'NH', value: 'NH' },
  { name: 'NJ', value: 'NJ' },
  { name: 'NM', value: 'NM' },
  { name: 'NY', value: 'NY' },
  { name: 'NC', value: 'NC' },
  { name: 'ND', value: 'ND' },
  { name: 'MP', value: 'MP' },
  { name: 'OH', value: 'OH' },
  { name: 'OK', value: 'OK' },
  { name: 'OR', value: 'OR' },
  { name: 'PW', value: 'PW' },
  { name: 'PA', value: 'PA' },
  { name: 'PR', value: 'PR' },
  { name: 'RI', value: 'RI' },
  { name: 'SC', value: 'SC' },
  { name: 'SD', value: 'SD' },
  { name: 'TN', value: 'TN' },
  { name: 'TX', value: 'TX' },
  { name: 'UT', value: 'UT' },
  { name: 'VT', value: 'VT' },
  { name: 'VI', value: 'VI' },
  { name: 'VA', value: 'VA' },
  { name: 'WA', value: 'WA' },
  { name: 'WV', value: 'WV' },
  { name: 'WI', value: 'WI' },
  { name: 'WY', value: 'WY' }
]

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
      footer={null}>
      {contextHolder}
      <Flex vertical={true} align="center">
        <Form form={form} className="w-3/4">
          <Form.Item
            label="Gym Name"
            name="name"
            rules={[{ required: true, message: 'Please input a name' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Gym Address"
            name="address"
            rules={[{ required: true, message: 'Please input an address' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input a city' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: 'Please input a state' }]}>
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
              }}>
              Cancel
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Modal>
  )
}

export default GymForm
