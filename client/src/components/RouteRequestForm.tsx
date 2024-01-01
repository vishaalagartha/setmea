import React, { useEffect, useState } from 'react'
import { AutoComplete, Form, Input, Typography, Button, Select, Row, Col } from 'antd'
import { getGyms } from '../api/gym'
import { RouteTag } from '../types/route'
import type { IGym } from '../types/gym'
import { createRoute } from '../api/route'
import useMessage from 'antd/es/message/useMessage'

const RouteRequestForm: React.FC = () => {
  const [form] = Form.useForm()
  const [gyms, setGyms] = useState<IGym[]>([])
  const [selectedGym, setSelectedGym] = useState<IGym>()
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
  }, [])

  const handleCreateRequest: () => void = async () => {
    try {
      await form.validateFields()
      const { gym: gymName, goal, details, tags, zone } = form.getFieldsValue()
      const gym = gyms.find((g) => g.name === gymName)
      if (gym === undefined) throw new Error('Invalid gym selected')
      const res = await createRoute({ goal, gymId: gym._id, details, tags, zone })
      if (res.status === 201) {
        form.setFieldsValue({ goal: '', gym: '', details: '', tags: [], zone: '' })
        await message.open({ type: 'success', content: 'Successfully created route!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form form={form} layout={'horizontal'}>
      {contextHolder}
      <Row justify="center">
        <Typography.Title level={3}>As a climber</Typography.Title>
      </Row>
      <Row justify="center">
        <Typography.Title level={3}>climbing at</Typography.Title>
      </Row>
      <Row justify="center">
        <Col xs={24} md={12} lg={8}>
          <Form.Item name="gym" rules={[{ required: true, message: 'Please select a gym.' }]}>
            <AutoComplete
              options={gyms.map((g) => ({
                label: `${g.name} - ${g.address}, ${g.city}, ${g.state}`,
                value: `${g.name}`
              }))}
              filterOption={(inputValue, option) => {
                if (option === undefined) return false
                return option.label.includes(inputValue)
              }}
              onSelect={(name) => {
                const gym = gyms.find((g) => g.name === name)
                if (gym !== undefined) setSelectedGym(gym)
              }}
              onChange={() => {
                setSelectedGym(undefined)
                form.setFieldValue('zone', '')
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      {selectedGym !== undefined && selectedGym.zones.length > 0 && (
        <div>
          <Row justify="center">
            <Typography.Title level={3}>in the zone</Typography.Title>
          </Row>
          <Row justify="center">
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="zone">
                <Select
                  options={selectedGym.zones.map((z) => {
                    return { name: z, value: z }
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
      <div>
        <Row justify="center">
          <Typography.Title level={3}>aiming to improve my</Typography.Title>
        </Row>
        <Row justify="center">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="goal" rules={[{ required: true, message: 'Please select a gym.' }]}>
              <Input placeholder="crimp endurance" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Typography.Title level={3}>so set me a</Typography.Title>
        </Row>
        <Row justify="center">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="details">
              <Input.TextArea placeholder="a 10-15 move power-endurance crimp line with incut edges on a 35-50 degree surface. I want it to feel like 3 Moonboard problems in one!" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="tags">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Add tags to your climb"
                options={options}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Button type="primary" onClick={handleCreateRequest}>
            Create Route Request
          </Button>
        </Row>
      </div>
    </Form>
  )
}

export default RouteRequestForm
