import React, { useEffect, useState } from 'react'
import {
  Form,
  Typography,
  Input,
  Divider,
  Upload,
  Row,
  Col,
  InputNumber,
  Button,
  Space
} from 'antd'
import { useAppDispatch, useAppSelector } from '../store/rootReducer'
import { userSelector, setUser } from '../store/userSlice'
import { editUser } from '../api/user'
import useMessage from 'antd/es/message/useMessage'

const Profile: React.FC = () => {
  const [form] = Form.useForm()
  const user = useAppSelector(userSelector)
  const [editing, setEditing] = useState(false)
  const dispatch = useAppDispatch()
  const [message, contextHolder] = useMessage()

  useEffect(() => {
    form.setFieldsValue({ ...user })
  }, [])

  const handleSaveChanges: () => void = async () => {
    try {
      await form.validateFields()
      const { avatar, username, email, location, height, weight, apeIndex } =
        form.getFieldsValue() as {
          avatar: string
          username: string
          email: string
          location: string
          height: number
          weight: number
          apeIndex: number
        }
      console.log(avatar)
      const res = await editUser(user._id, username, email, location, height, weight, apeIndex)
      if (res.status === 200) {
        dispatch(setUser(res.data))
        form.setFieldsValue(res.data)
        setEditing(false)
        await message.open({ type: 'success', content: 'Modified your profile.' })
      } else {
        form.setFieldsValue({ ...user })
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form form={form}>
      {contextHolder}
      <Form.Item name="avatar">
        <Upload disabled={!editing} />
      </Form.Item>
      <Row justify="center">
        <Typography.Title level={3}>General</Typography.Title>
      </Row>
      <Row justify="center">
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input a username' }]}>
            <Input disabled={!editing} />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input a username' }]}>
            <Input disabled={!editing} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} md={17}>
          <Form.Item label="Location" name="location">
            <Input disabled={!editing} />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row justify="center">
        <Typography.Title level={4}>Metrics</Typography.Title>
      </Row>
      <Row justify="center">
        <Col xs={{ span: 13 }} md={{ span: 6 }}>
          <Form.Item label="Height" name="height">
            <InputNumber min={0} disabled={!editing} addonAfter="in" />
          </Form.Item>
        </Col>
        <Col xs={{ span: 13 }} md={{ span: 6, offset: 1 }}>
          <Form.Item label="Bodyweight" name="weight">
            <InputNumber min={0} disabled={!editing} addonAfter="lbs" />
          </Form.Item>
        </Col>
        <Col xs={{ span: 13 }} md={{ span: 6, offset: 1 }}>
          <Form.Item label="Ape Index" name="apeIndex">
            <InputNumber disabled={!editing} addonAfter="in" />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        {editing && (
          <Space>
            <Button type="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button
              onClick={() => {
                form.setFieldsValue({ ...user })
                setEditing(false)
              }}>
              Cancel
            </Button>
          </Space>
        )}
        {!editing && (
          <Button
            type="primary"
            onClick={() => {
              setEditing(true)
            }}>
            Edit Settings
          </Button>
        )}
      </Row>
    </Form>
  )
}

export default Profile
