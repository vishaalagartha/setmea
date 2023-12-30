import React, { createContext, useEffect, useState } from 'react'
import { AutoComplete, Flex, Form, Typography, Select, Input, Button } from 'antd'
import { getGyms } from '../api/gym'
import type { IGym } from '../types/gym'
import { type IRoute, RouteTag } from '../types/route'
import { getRoutesByGym } from '../api/route'
import RouteList from './RouteList'
interface RoutesInterface {
  routes: IRoute[]
  setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
  filteredRoutes: IRoute[]
  setFilteredRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>
}

export const RoutesContext = createContext<RoutesInterface | undefined>(undefined)

const RouteFinderForm: React.FC = () => {
  const [form] = Form.useForm()
  const [filterForm] = Form.useForm()
  const [gyms, setGyms] = useState<IGym[]>([])
  const [routes, setRoutes] = useState<IRoute[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<IRoute[]>([])

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
            console.log('adding', tag)
            newFilteredRoutes.push(route)
            added = true
            break
          }
        }
      }
      if (added) continue
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
    <RoutesContext.Provider value={{ routes, setRoutes, filteredRoutes, setFilteredRoutes }}>
      <Flex vertical={true}>
        <Form form={form} layout={'horizontal'} className="flex-col">
          <Typography.Title className="flex justify-center" level={3}>
            I&apos;m setting at
          </Typography.Title>
          <Form.Item name="gym" className="flex justify-center">
            <AutoComplete
              style={{ width: 400 }}
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
        </Form>
        {routes.length > 0 && (
          <Flex vertical={true} align="center">
            <Typography.Title level={5}>Filter Options</Typography.Title>
            <Form form={filterForm} className="flex-col align-baseline">
              <Typography.Text>Keywords (separate by comma):</Typography.Text>
              <Form.Item name="keywords">
                <Input placeholder="dyno,deadpoint,endurance" />
              </Form.Item>
              <Typography.Text>Tags:</Typography.Text>
              <Form.Item name="tags">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 400 }}
                  placeholder="Add tags to your climb"
                  options={options}
                />
              </Form.Item>
              <Flex justify="space-around" className="mb-5">
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
              </Flex>
            </Form>
          </Flex>
        )}
        <RouteList routes={filteredRoutes} />
      </Flex>
    </RoutesContext.Provider>
  )
}

export default RouteFinderForm
