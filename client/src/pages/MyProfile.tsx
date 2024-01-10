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
  Space,
  Image
} from 'antd'
import DefaultImage from '../assets/default.jpg'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadProps, UploadFile } from 'antd/es/upload/interface'
import { useAppDispatch, useAppSelector } from '../store/rootReducer'
import { userSelector, setUser } from '../store/userSlice'
import { editUser, updateAvatar } from '../api/user'
import useMessage from 'antd/es/message/useMessage'
import { resetPasswordViaPassword } from '../api/auth'

const getBase64 = async (file: RcFile): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

const Profile: React.FC = () => {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const user = useAppSelector(userSelector)
  const [editing, setEditing] = useState(false)
  // eslint-disable-next-line
  const [avatar, setAvatar] = useState<string>()
  const dispatch = useAppDispatch()
  const [message, contextHolder] = useMessage()

  useEffect(() => {
    form.setFieldsValue({ ...user })
  }, [user])

  const handleSaveChanges: () => void = async () => {
    try {
      await form.validateFields()
      const { avatar, username, email, location, height, weight, apeIndex } =
        form.getFieldsValue() as {
          avatar: File
          username: string
          email: string
          location: string
          height: number
          weight: number
          apeIndex: number
        }
      const updateRes = await updateAvatar(user._id, avatar)
      let { res } = updateRes
      let avatarKey = ''
      if (res.status !== 200) {
        await message.open({ type: 'error', content: res.data.message })
      } else {
        avatarKey = updateRes.key
      }
      res = await editUser(user._id, username, email, location, height, weight, apeIndex, avatarKey)
      console.log(res, avatarKey)
      if (res.status === 200) {
        dispatch(setUser({ ...res.data, avatar: avatarKey }))
        form.setFieldsValue({ ...res.data, avatar: avatarKey })
        setEditing(false)
        await message.open({ type: 'success', content: 'Modified your profile.' })
      } else {
        form.setFieldsValue({ ...user, avatar: avatarKey })
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePasswordReset: () => void = async () => {
    try {
      await passwordForm.validateFields()
      const { pw, pw1, pw2 } = passwordForm.getFieldsValue() as {
        pw: string
        pw1: string
        pw2: string
      }
      if (pw1 !== pw2) {
        await message.open({ type: 'error', content: 'Passwords must match!' })
        return
      }
      const res = await resetPasswordViaPassword(pw, pw1)
      if (res.status === 200) {
        await message.open({
          type: 'success',
          content: 'Successfully reset password.'
        })
        passwordForm.setFieldsValue({ pw: '', pw1: '', pw2: '' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpload: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    console.log(info)
    // @ts-expect-error expect error
    const base64 = await getBase64(info.file)
    setAvatar(base64)
    form.setFieldValue('avatar', info.fileList[0] as unknown as Blob)
  }
  console.log(avatar)
  return (
    <>
      <Form form={form}>
        {contextHolder}
        <Row justify="center" className="mb-3">
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
        <Row justify="center" align="middle">
          <Col xs={{ span: 6 }} md={{ span: 4, offset: 2 }} className="text-center">
            {avatar !== undefined && (
              <Image preview={false} src={avatar} style={{ borderRadius: '50%' }} />
            )}
            {user?.avatar !== '' && avatar === undefined && (
              <Image preview={false} src={user.avatar} style={{ borderRadius: '50%' }} />
            )}
            {user?.avatar === '' && avatar === undefined && (
              <Image preview={false} src={DefaultImage} style={{ borderRadius: '50%' }} />
            )}
            <Form.Item name="avatar">
              <Upload
                className="flex justify-center mt-3"
                beforeUpload={() => false}
                multiple={false}
                maxCount={1}
                onChange={handleUpload}
                showUploadList={false}>
                <Button disabled={!editing}>Change avatar</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={{ span: 12, offset: 2 }} md={{ span: 12, offset: 2 }}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input a username' }]}>
              <Input disabled={!editing} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input a username' }]}>
              <Input disabled={!editing} />
            </Form.Item>
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
      </Form>
      <Divider />
      <Row justify="center">
        <Typography.Title level={4}>Password Reset</Typography.Title>
      </Row>
      <Form form={passwordForm}>
        <Row justify="center">
          <Col xs={{ span: 20 }} md={{ span: 8 }}>
            <Form.Item
              label="Current Password"
              name="pw"
              rules={[{ required: true, message: 'Please enter your current password.' }]}>
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col xs={{ span: 20 }} md={{ span: 8 }}>
            <Form.Item
              label="New Password"
              name="pw1"
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password.'
                }
              ]}>
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col xs={{ span: 20 }} md={{ span: 8 }}>
            <Form.Item
              label="Reenter New Password"
              name="pw2"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password.'
                }
              ]}>
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Form.Item>
            <Button danger onClick={handlePasswordReset}>
              Reset Password
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  )
}

export default Profile
