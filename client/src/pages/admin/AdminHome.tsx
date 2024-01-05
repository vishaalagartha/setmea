import React from 'react'
import { Row, Card, Flex, Typography, Button, Col } from 'antd'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'

/*
Admin capabilities:
- Create setter
- Create gym
- Delete user
- Delete route
*/

const AdminHome: React.FC = () => {
  return (
    <Row justify="center">
      <Col xs={20} md={6} lg={6} className="m-5">
        <Card
          className="h-full"
          title={
            <Flex>
              <Typography.Title level={3}>Gyms Hub</Typography.Title>
            </Flex>
          }
        >
          <Typography.Title level={4}>
            Facilitates access to create gyms and gym zones.
          </Typography.Title>
          <Link to="/admin/gyms">
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Go to Gyms Hub
            </Button>{' '}
          </Link>
        </Card>
      </Col>
      <Col xs={20} md={6} lg={6} className="m-5">
        <Card
          className="h-full"
          title={
            <Flex>
              <Typography.Title level={3}>Setters Hub</Typography.Title>
            </Flex>
          }
        >
          <Typography.Title level={4}>Create credentials for and delete setters.</Typography.Title>
          <Link to="/admin/setters">
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Go to Setters Hub
            </Button>
          </Link>
        </Card>
      </Col>
      <Col xs={20} md={6} lg={6} className="m-5">
        <Card
          className="h-full"
          title={
            <Flex>
              <Typography.Title level={3}>Users Hub</Typography.Title>
            </Flex>
          }
        >
          <Typography.Title level={4}>Manage unruly users.</Typography.Title>
          <Link to="/admin/users">
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Go to Users Hub
            </Button>
          </Link>
        </Card>
      </Col>
    </Row>
  )
}

export default AdminHome
