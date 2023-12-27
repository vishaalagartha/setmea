import React from 'react'
import { Flex, Form, Input, Radio, Typography } from 'antd'

const Home: React.FC = () => {
  const [form] = Form.useForm()

  return (
    <Flex vertical={true} align="center">
      <Form form={form} layout={'horizontal'} className="w-1/2 text-center">
        <Typography.Title level={3}>I am a</Typography.Title>
        <Form.Item name={'type'}>
          <Radio.Button value="climber">Climber</Radio.Button>
          <Radio.Button value="routesetter">Routesetter</Radio.Button>
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

export default Home
