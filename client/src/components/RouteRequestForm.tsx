import React, { useEffect, useState } from 'react'
import { AutoComplete, Flex, Form, Input, Typography, Button, Select } from 'antd'
import GymForm from './GymForm'
import { getGyms } from '../api/gym'
import { RouteTag } from '../types/route'
import type { IGym } from '../types/gym'
import { createRoute } from '../api/route'
import useMessage from 'antd/es/message/useMessage'

const RouteRequestForm: React.FC = () => {
  const [form] = Form.useForm()
  const [openGymForm, setOpenGymForm] = useState(false)
  const [gyms, setGyms] = useState<IGym[]>([])
  const [message, contextHolder] = useMessage()
  const options = Object.values(RouteTag).map((t) => ({ name: t, value: t }))

  useEffect(() => {
    const fetchGyms: () => void = async () => {
      const res = await getGyms()
      if (res.status === 200) {
        const gymData = res.data as IGym[]
        setGyms(gymData)
      }
    }
    fetchGyms()
  }, [openGymForm])

  const handleCreateRequest: () => void = async () => {
    try {
      await form.validateFields()
      const { gym: gymName, goal, details, tags } = form.getFieldsValue()
      const gym = gyms.find((g) => g.name === gymName)
      if (gym === undefined) throw new Error('Invalid gym selected')
      const res = await createRoute({ goal, gymId: gym._id, details, tags })
      if (res.status === 201) {
        form.setFieldsValue({ goal: '', gym: '', details: '', tags: [] })
        await message.open({ type: 'success', content: 'Successfully created route!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex vertical={true} align="center">
      {contextHolder}
      <Form form={form} layout={'horizontal'} className="w-1/2 text-center">
        <Typography.Title level={3}>As a climber</Typography.Title>
        <Typography.Title level={3}>climbing at</Typography.Title>
        <Form.Item name="gym" rules={[{ required: true, message: 'Please select a gym.' }]}>
          <AutoComplete
            options={gyms.map((g) => ({
              label: `${g.name} - ${g.address}, ${g.city}, ${g.state}`,
              value: `${g.name}`
            }))}
            style={{ width: '80%' }}
            filterOption={(inputValue, option) => {
              if (option === undefined) return false
              return option.label.includes(inputValue)
            }}
          />
        </Form.Item>
        <Flex justify="center" align="center" className="mb-3">
          Can&apos;t find your gym?{' '}
          <Button
            type="link"
            className="p-0 ml-1"
            onClick={() => {
              setOpenGymForm(true)
            }}>
            Try creating one!
          </Button>
        </Flex>
        <GymForm open={openGymForm} setOpen={setOpenGymForm} />
        <Typography.Title level={3}>aiming to improve my</Typography.Title>
        <Form.Item name="goal" rules={[{ required: true, message: 'Please select a gym.' }]}>
          <Input placeholder="crimp endurance" />
        </Form.Item>
        <Typography.Title level={3}>so set me a</Typography.Title>
        <Form.Item name="details">
          <Input.TextArea placeholder="a 10-15 move power-endurance crimp line with incut edges on a 35-50 degree surface. I want it to feel like 3 Moonboard problems in one!" />
        </Form.Item>
        <Form.Item name="tags">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Add tags to your climb"
            options={options}
          />
        </Form.Item>
        <Flex justify="space-around">
          <Button type="primary" onClick={handleCreateRequest}>
            Create Route Request
          </Button>
        </Flex>
      </Form>
    </Flex>
  )
}

export default RouteRequestForm
