import React, { useEffect, useState } from 'react'
import {
  AutoComplete,
  Form,
  Typography,
  Select,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Space
} from 'antd'
import { getGyms } from '../api/gym'
import type { IGym } from '../types/gym'
import { type IRoute, RouteTag } from '../types/route'
import { getRoutesByGym } from '../api/route'
import RouteList from '../components/RouteList'
import useMessage from 'antd/es/message/useMessage'
import { useAppSelector } from '../store/rootReducer'
import { userSelector } from '../store/userSlice'
import { Identity } from '../types/user'
import { RoutesContext } from '../components/RoutesContext'
import SelectedRouteModal from '../components/SelectedRouteModal'

const FindRoutes: React.FC = () => {
  const [form] = Form.useForm()
  const [filterForm] = Form.useForm()
  const [gyms, setGyms] = useState<IGym[]>([])
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<IRoute[]>([])
  const [message, contextHolder] = useMessage()
  const [selectedRoute, setSelectedRoute] = useState<IRoute>()
  const user = useAppSelector(userSelector)

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

  const handleSelect: (gymName: string) => void = async (gymName: string) => {
    const gym = gyms.find((g) => g.name === gymName)
    if (gym === undefined) return
    const res = await getRoutesByGym({ gymId: gym._id })
    if (res.status === 200) {
      const routeData = res.data as IRoute[]
      setRoutes(routeData)
      setFilteredRoutes(routeData)
      if (routeData.length === 0)
        await message.open({ type: 'info', content: 'No routes were found.' })
    }
  }

  const handleFilter: () => void = async () => {
    const { tags, keywords } = filterForm.getFieldsValue() as {
      tags: RouteTag[] | null
      keywords: string
    }
    const newFilteredRoutes = []

    for (const route of filteredRoutes) {
      let added = false
      if (tags != null) {
        for (const tag of tags) {
          if (route.tags.includes(tag)) {
            newFilteredRoutes.push(route)
            added = true
            break
          }
        }
      }
      if (added) continue
      if (keywords === undefined) continue
      for (const keyword of keywords.split(',')) {
        if (
          keyword.length !== 0 &&
          (route.details.includes(keyword) ||
            route.goal.includes(keyword) ||
            route.username.includes(keyword))
        ) {
          newFilteredRoutes.push(route)
          break
        }
      }
    }

    setFilteredRoutes(newFilteredRoutes)
  }
  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        filteredRoutes,
        setFilteredRoutes,
        selectedRoute,
        setSelectedRoute: user.identity !== Identity.SETTER ? undefined : setSelectedRoute,
        onDelete: undefined
      }}>
      {contextHolder}
      <Form form={form}>
        <Row justify="center">
          {user.identity === Identity.CLIMBER && (
            <Typography.Title level={3}>I&apos;m climbing at</Typography.Title>
          )}
          {user.identity === Identity.SETTER && (
            <Typography.Title level={3}>I&apos;m setting at</Typography.Title>
          )}
        </Row>
        <Row justify="center">
          <Col xs={24} md={12} lg={10}>
            <Form.Item name="gym">
              <AutoComplete
                placeholder="Pacific Pipe"
                options={gyms.map((g) => ({
                  label: `${g.name} - ${g.address}, ${g.city}, ${g.state}`,
                  value: `${g.name}`
                }))}
                filterOption={(inputValue, option) => {
                  if (option === undefined) return false
                  return option.label.includes(inputValue)
                }}
                onSelect={handleSelect}
                onClear={() => {
                  setRoutes([])
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      {routes.length > 0 && (
        <div>
          <Row justify="center">
            <Typography.Title level={5}>Filter Options</Typography.Title>
          </Row>
          <Form form={filterForm}>
            <Row justify="center">
              <Typography.Text>Keywords (separate by comma)</Typography.Text>
            </Row>
            <Row justify="center">
              <Col xs={24} md={12} lg={10}>
                <Form.Item name="keywords">
                  <Input placeholder="dyno,deadpoint,endurance" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Typography.Text>Tags</Typography.Text>
            </Row>
            <Row justify="center">
              <Col xs={24} md={12} lg={10}>
                <Form.Item name="tags">
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Add tags to your climb"
                    options={options}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Space>
                <Button type="primary" onClick={handleFilter}>
                  Filter
                </Button>
                <Button
                  onClick={() => {
                    filterForm.setFieldsValue({ keywords: '', tags: [] })
                    setFilteredRoutes(routes)
                  }}>
                  Reset
                </Button>
              </Space>
            </Row>
          </Form>
        </div>
      )}
      <Divider />
      <SelectedRouteModal />
      {filteredRoutes.length > 0 && <RouteList />}
    </RoutesContext.Provider>
  )
}

export default FindRoutes
