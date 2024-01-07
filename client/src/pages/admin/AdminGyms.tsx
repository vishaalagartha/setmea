import React, { useEffect, useState } from 'react'
import { AutoComplete, Flex, Button, Form, Input, Select, Typography, Divider, Tag } from 'antd'
import { useForm } from 'antd/es/form/Form'
import GymForm from '../../components/GymForm'
import { getGyms, editGym, deleteGym, addGymZone, deleteZone } from '../../api/gym'
import type { IGym } from '../../types/gym'
import useMessage from 'antd/es/message/useMessage'
import { states } from '../../utils/constants'

const AdminGyms: React.FC = () => {
  const [gyms, setGyms] = useState<IGym[]>([])
  const [autocompleteForm] = useForm()
  const [form] = useForm()
  const [zoneForm] = useForm()
  const [openGymForm, setOpenGymForm] = useState(false)
  const [message, contextHolder] = useMessage()
  const [selectedGym, setSelectedGym] = useState<IGym>()

  const fetchGyms: () => void = async () => {
    const res = await getGyms()
    if (res.status === 200) {
      const gymData = res.data as IGym[]
      setGyms(gymData)
    }
  }

  useEffect(() => {
    fetchGyms()
  }, [openGymForm])

  const handleEditGym: () => void = async () => {
    try {
      await form.validateFields()
      if (selectedGym === undefined) return
      const { name, address, city, state } = form.getFieldsValue()
      const res = await editGym({ id: selectedGym._id, name, address, city, state })
      if (res.status === 200) {
        fetchGyms()
        setSelectedGym(undefined)
        form.setFieldsValue({ name: '', city: '', address: '', state: '' })
        autocompleteForm.setFieldValue('name', '')
        await message.open({ type: 'success', content: 'Successfully edited gym!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteGym: () => void = async () => {
    try {
      await form.validateFields()
      if (selectedGym === undefined) return
      const res = await deleteGym({ id: selectedGym._id })
      if (res.status === 200) {
        setSelectedGym(undefined)
        fetchGyms()
        form.setFieldsValue({ name: '', city: '', address: '', state: '' })
        await message.open({ type: 'success', content: 'Successfully deleted gym!' })
        autocompleteForm.setFieldValue('name', '')
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddZone: () => void = async () => {
    try {
      await zoneForm.validateFields()
      if (selectedGym === undefined) return
      const { zone } = zoneForm.getFieldsValue() as { zone: string }
      const res = await addGymZone(selectedGym._id, zone)
      if (res.status === 200) {
        setSelectedGym({ ...selectedGym, zones: [...selectedGym.zones, zone] })
        fetchGyms()
        zoneForm.setFieldsValue({ zone: '' })
        await message.open({ type: 'success', content: 'Successfully added zone to gym!' })
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteZone: (name: string) => void = async (zone: string) => {
    try {
      if (selectedGym === undefined) return
      const res = await deleteZone(selectedGym._id, zone)
      if (res.status === 200) {
        fetchGyms()
        setSelectedGym({ ...selectedGym, zones: selectedGym.zones.filter((z) => z !== zone) })
        zoneForm.setFieldsValue({ zone: '' })
        await message.open({ type: 'success', content: 'Successfully deleted zone.' })
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
      <Form form={autocompleteForm} className="w-1/2">
        <Form.Item name="name" className="w-full">
          <AutoComplete
            className="w-full"
            options={gyms.map((g) => ({
              label: `${g.name} - ${g.address}, ${g.city}, ${g.state}`,
              value: `${g.name}`
            }))}
            filterOption={(inputValue, option) => {
              if (option === undefined) return false
              return option.label.includes(inputValue)
            }}
            onSelect={(value) => {
              const gym = gyms.find((g) => g.name === value)
              setSelectedGym(gym)
              form.setFieldsValue({ ...gym })
            }}
          />
        </Form.Item>
      </Form>

      {selectedGym !== undefined && (
        <Flex vertical={true} align="center" className="my-5">
          <Form form={form}>
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
              <Button type="primary" onClick={handleEditGym}>
                Edit Gym
              </Button>
              <Button danger onClick={handleDeleteGym}>
                Delete Gym
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setSelectedGym(undefined)
                  form.setFieldsValue({ name: '', city: '', address: '', state: '' })
                  autocompleteForm.setFieldValue('name', '')
                }}>
                Cancel
              </Button>
            </Flex>
          </Form>
        </Flex>
      )}
      <Divider />
      {selectedGym !== undefined && (
        <div className="w-1/2">
          <Typography.Title level={4} className="flex justify-center">
            Add or Remove Zones
          </Typography.Title>
          <Typography.Title level={5}>Current zones:</Typography.Title>
          {selectedGym.zones.length === 0 && 'No current zones'}
          {selectedGym.zones.map((name: string, i) => {
            return (
              <Tag
                className="m-1"
                key={i}
                closable={true}
                onClose={() => {
                  handleDeleteZone(name)
                }}>
                {name}
              </Tag>
            )
          })}
          <Form form={zoneForm} className="mt-5">
            <Form.Item
              label="Zone name"
              name="zone"
              rules={[{ required: true, message: 'Please input zone name' }]}>
              <Input />
            </Form.Item>
            <Flex justify="center" align="center" className="mt-5">
              <Button type="primary" onClick={handleAddZone}>
                Add Zone
              </Button>
            </Flex>
          </Form>
        </div>
      )}
      {selectedGym === undefined && (
        <Flex justify="center" align="center" className="mt-5">
          <Button
            type="primary"
            onClick={() => {
              setOpenGymForm(true)
            }}>
            Create New Gym
          </Button>
        </Flex>
      )}
      <GymForm open={openGymForm} setOpen={setOpenGymForm} />
    </Flex>
  )
}

export default AdminGyms
