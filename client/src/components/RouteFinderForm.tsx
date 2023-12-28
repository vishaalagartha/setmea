import React from 'react'
import { AutoComplete, Flex, Form, Input, Typography } from 'antd'

const RouteFinderForm: React.FC = () => {
  const [form] = Form.useForm()

  return (
    <Flex vertical={true} align="center">
      <Form form={form} layout={'horizontal'} className="w-1/2 text-center">
        <Typography.Title level={3}>As a climber</Typography.Title>
        <Typography.Title level={3}>climbing at</Typography.Title>
        <Form.Item name="gym">
          <AutoComplete />
        </Form.Item>
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

export default RouteFinderForm
