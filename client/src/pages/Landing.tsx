import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Typography, Input, Button, Divider, Row, Col, Image } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import { useForm } from 'antd/es/form/Form'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/userSlice'
import RegistrationModal from '../components/RegistrationModal'
import PasswordResetModal from '../components/PasswordResetModal'
import { login } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from '@tsparticles/slim' // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const Landing: React.FC = () => {
  const [form] = useForm()
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [passwordResetModalOpen, setResetPasswordModalOpen] = useState(false)
  const dispatch = useDispatch()
  const [message, contextHolder] = useMessage()
  const navigate = useNavigate()
  const [init, setInit] = useState(false)

  // this should be run only once per application lifetime
  useEffect(() => {
    void initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      // await loadAll(engine);
      // await loadFull(engine);
      await loadSlim(engine)
      // await loadBasic(engine);
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options = {
    fpsLimit: 100,
    particles: {
      number: {
        value: 70
      },
      color: {
        value: '#ffffff',
        animation: {
          enable: true,
          speed: 20,
          sync: true
        }
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.1
      },
      size: {
        value: { min: 1, max: 3 }
      },
      links: {
        enable: true,
        distance: 100,
        color: 'random',
        opacity: 0.4,
        width: 1,
        triangles: {
          enable: true,
          color: '#e0fee6',
          opacity: 0.3
        }
      },
      move: {
        enable: true,
        speed: 2
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse'
        },
        onClick: {
          enable: true,
          mode: 'push'
        }
      },
      modes: {
        repulse: {
          distance: 200
        },
        push: {
          quantity: 4
        }
      }
    },
    background: {
      color: '#0c4a6e'
    }
  }

  const handleLogin: () => Promise<void> = async () => {
    try {
      await form.validateFields()
      const { username, password } = form.getFieldsValue()
      const res = await login({ username, password })
      if (res.status === 200) {
        const { token, ...fieldsToStore } = res.data as {
          token: string
          identity: string
          _id: string
        }
        dispatch(setUser(fieldsToStore))
        localStorage.setItem('token', token)
        localStorage.setItem('id', fieldsToStore._id)
        const { identity } = fieldsToStore as { identity: string }
        if (identity === 'admin') navigate('/admin')
        else navigate('/')
      } else {
        await message.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }
  if (init)
    return (
      <div className="relative">
        <Particles
          className="absolute top-0 left-0 bottom-0 right-0 padding-0"
          id="tsparticles"
          options={options}
        />
        <div className="absolute left-0 bottom-0 right-0 m-auto w-full top-48">
          {contextHolder}
          <Row justify="center" className="mb-10">
            <Col xs={10} md={6}>
              <Image src={Logo} preview={false} />
            </Col>
          </Row>
          <Form form={form}>
            <Row justify="center">
              <Col xs={20} md={8}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input a username' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Username" className="w-100 h-10" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={20} md={8}>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input a password!' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Form.Item>
                <Button
                  className="text-sky-600"
                  onClick={() => {
                    void handleLogin()
                  }}>
                  Log In
                </Button>
              </Form.Item>
            </Row>
            <Row justify="center">
              <Typography.Text className="text-white">
                Have no account yet?{' '}
                <Typography.Link
                  className="landing-link"
                  onClick={() => {
                    setRegistrationModalOpen(true)
                  }}>
                  Sign Up
                </Typography.Link>
              </Typography.Text>
            </Row>
            <Divider />
            <Row justify="center">
              <Typography.Text className="text-white">
                Forgot your password?{' '}
                <Typography.Link
                  className="landing-link"
                  onClick={() => {
                    setResetPasswordModalOpen(true)
                  }}>
                  Reset it here.
                </Typography.Link>
              </Typography.Text>
            </Row>
          </Form>
          <RegistrationModal open={registrationModalOpen} setOpen={setRegistrationModalOpen} />
          <PasswordResetModal open={passwordResetModalOpen} setOpen={setResetPasswordModalOpen} />
        </div>
      </div>
    )
  return <></>
}

export default Landing
