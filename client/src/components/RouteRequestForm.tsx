import React, { useEffect, useState } from 'react'
import { AutoComplete, Flex, Form, Input, Typography, Button } from 'antd'
import GymForm from './GymForm'
import { getGyms } from '../api/gym'
import type { IGym } from '../types/gym'

interface GymObject {
  label: string
  value: string
}

const RouteRequestForm: React.FC = () => {
  const [form] = Form.useForm()
  const [openGymForm, setOpenGymForm] = useState(false)
  const [gyms, setGyms] = useState<GymObject[]>([])

  useEffect(() => {
    const fetchGyms: () => void = async () => {
      const res = await getGyms()
      if (res.status === 200) {
        const gymData = res.data as IGym[]
        const gymStrings = gymData.map((g: IGym) => {
          return { label: `${g.name} - ${g.address}, ${g.city}, ${g.state}`, value: `${g.name}` }
        })
        setGyms(gymStrings)
      }
    }
    fetchGyms()
  }, [openGymForm])
  console.log(gyms)
  return (
    <Flex vertical={true} align="center">
      <Form form={form} layout={'horizontal'} className="w-1/2 text-center">
        <Typography.Title level={3}>As a climber</Typography.Title>
        <Typography.Title level={3}>climbing at</Typography.Title>
        <Form.Item name="gym">
          <AutoComplete
            options={gyms}
            filterOption={(inputValue, option) => {
              if (option === undefined) return false
              return option.label.includes(inputValue)
            }}
          />
        </Form.Item>
        <Flex>
          Can&apos;t find your gym?{' '}
          <Button
            type="link"
            onClick={() => {
              setOpenGymForm(true)
            }}>
            Try creating one!
          </Button>
        </Flex>
        <GymForm open={openGymForm} setOpen={setOpenGymForm} />
        <Typography.Title level={3}>aiming to improve my</Typography.Title>
        <Form.Item name="goal">
          <Input />
        </Form.Item>
        <Typography.Title level={3}>so set me a</Typography.Title>
        <Form.Item name="details">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default RouteRequestForm
