import React, { useEffect, useState } from 'react'
import {
  AutoComplete,
  Form,
  Input,
  Typography,
  Button,
  Select,
  Row,
  Col,
  InputNumber,
  Upload,
  App
} from 'antd'
import { getGyms } from '../api/gym'
import type { UploadChangeParam } from 'antd/es/upload'
import type { UploadProps, UploadFile } from 'antd/es/upload/interface'
import { RouteTag } from '../types/route'
import type { IGym } from '../types/gym'
import { createRoute, putRouteMedia, postRouteMedia } from '../api/route'
import type { IUser } from '../types/user'
import { getUsersByIdentity } from '../api/user'
import { UploadOutlined } from '@ant-design/icons'
import { resizeImage, convertFile } from '../utils/media'

const RouteRequestForm: React.FC = () => {
  const [form] = Form.useForm()
  const [gyms, setGyms] = useState<IGym[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [setters, setSetters] = useState<IUser[]>([])
  const [selectedGym, setSelectedGym] = useState<IGym>()
  const { message } = App.useApp()
  const options = Object.values(RouteTag).map((t) => ({ name: t, value: t }))

  useEffect(() => {
    const fetchGyms: () => void = async () => {
      const res = await getGyms()
      if (res.status === 200) {
        const gymData = res.data as IGym[]
        setGyms(gymData)
      }
    }
    const fetchSetters: () => void = async () => {
      const res = await getUsersByIdentity('setter')
      if (res.status === 200) {
        const setters = res.data as IUser[]
        setSetters(setters)
      }
    }
    fetchGyms()
    fetchSetters()
  }, [])

  const addRouteMedia: (routeId: string) => void = async (routeId: string) => {
    try {
      const hide = message.loading('Uploading media...', 0)
      const files = fileList.map((f) => f.originFileObj)
      setFileList([])
      const resizedFilesPromises = files.map(
        async (f) =>
          await new Promise((resolve) => {
            if (f instanceof File) {
              if (f.name.endsWith('jpeg') || f.name.endsWith('jpg') || f.name.endsWith('png'))
                resolve(resizeImage(f))
              else resolve(convertFile(f))
            }
          })
      )
      const resizedFiles = await Promise.all(resizedFilesPromises)
      const puts = resizedFiles.map(
        async (f) =>
          await new Promise((resolve) => {
            if (f instanceof File) resolve(putRouteMedia(routeId, f))
          })
      )
      await Promise.all(puts).then(async (responses) => {
        const mediaFiles = responses.map((resp) => {
          const { key } = resp as { key: string }
          return key
        })

        const res = await postRouteMedia(routeId, mediaFiles)
        hide()
        if (res.status === 200) {
          await message.success('Successfully uploaded media.')
        } else {
          await message.error('Failed to upload media. Please retry creating route.')
        }
      })
    } catch (error) {
      setFileList([])
      console.error(error)
      await message.error(JSON.stringify(error))
    }
  }

  const handleCreateRequest: () => void = async () => {
    try {
      await form.validateFields()
      const {
        gym: gymName,
        goal,
        details,
        tags,
        zone,
        grade,
        requestedSetter: requestedSetterName
      } = form.getFieldsValue()
      const gym = gyms.find((g) => g.name === gymName)
      const setter = setters.find((s) => s.username === requestedSetterName)
      if (gym === undefined) throw new Error('Invalid gym selected')
      const res = await createRoute({
        goal,
        gymId: gym._id,
        details,
        tags,
        zone,
        grade,
        requestedSetterId: setter === undefined ? undefined : setter._id
      })
      if (res.status === 201) {
        form.setFieldsValue({
          goal: '',
          gym: '',
          details: '',
          tags: [],
          zone: '',
          requestedSetter: ''
        })
        await message.success('Successfully created route!')
        const routeId = res.data._id
        addRouteMedia(routeId as string)
      } else {
        await message.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await message.error(JSON.stringify(error))
    }
  }
  const handleUpload: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList)
  }

  return (
    <Form form={form} layout={'horizontal'}>
      <Row justify="center">
        <Typography.Title level={3}>As a climber</Typography.Title>
      </Row>
      <Row justify="center">
        <Typography.Title level={3}>climbing at</Typography.Title>
      </Row>
      <Row justify="center">
        <Col xs={20} md={12} lg={8}>
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
            <Col xs={20} md={12} lg={8}>
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
          <Col xs={20} md={12} lg={8}>
            <Form.Item
              name="goal"
              rules={[{ required: true, message: 'Please describe your goal.' }]}>
              <Input placeholder="crimp endurance" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Typography.Title level={3}>so set me a</Typography.Title>
        </Row>
        <Row justify="center">
          <Col xs={20} md={12} lg={8}>
            <Form.Item name="details">
              <Input.TextArea placeholder="a 10-15 move power-endurance crimp line with incut edges on a 35-50 degree surface. I want it to feel like 3 Moonboard problems in one!" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col xs={20} md={12} lg={8}>
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
          <Col xs={22} md={12} lg={8}>
            <Form.Item name="requestedSetter" label="Request a specific setter">
              <AutoComplete
                options={setters.map((s) => ({
                  label: `${s.username}`,
                  value: `${s.username}`
                }))}
                filterOption={(inputValue, option) => {
                  if (option === undefined) return false
                  return option.label.includes(inputValue)
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Form.Item name="grade" label="Grade request">
            <InputNumber prefix="V" min={0} max={17} />
          </Form.Item>
        </Row>
        <Row justify="center" className="mb-3">
          <Upload
            beforeUpload={() => false}
            onChange={handleUpload}
            fileList={fileList}
            accept={'image/png, image/jpeg, image/jpg, video/*'}>
            <Button icon={<UploadOutlined />}>Upload media describing route</Button>
          </Upload>
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
