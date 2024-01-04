import type { FC, ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Layout, Flex, Dropdown, Badge, Typography, Image, Menu, Row, Col } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetUser, userSelector } from '../store/userSlice'
import { BellOutlined, LogoutOutlined, ArrowRightOutlined, UserOutlined } from '@ant-design/icons'
import { getReceiverMessages } from '../api/messages'
import { type IMessage } from '../types/message'
import { useAppSelector } from '../store/rootReducer'
import useMessage from 'antd/es/message/useMessage'
import MessageModal from './MessageModal'
import { dateToString } from '../utils/date'
import Logo from '../assets/logo.png'

interface HeaderProps {
  children: ReactNode
}

const UnreadCircle: FC = () => (
  <div
    style={{
      height: 15,
      width: 15,
      borderRadius: '50%',
      backgroundColor: '#bae0ff',
      marginRight: 10,
      marginTop: 3
    }}></div>
)

const Header: FC<HeaderProps> = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [unreadCount, setUnreadCount] = useState(0)
  const [messages, setMessages] = useState<IMessage[]>([])
  const user = useAppSelector(userSelector)
  const [message, contextHolder] = useMessage()
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null)

  useEffect(() => {
    const fetchNotifications: () => void = async () => {
      try {
        const res = await getReceiverMessages(user._id)
        if (res.status === 200) {
          const { messages } = res.data as { messages: IMessage[] }
          const unreadMessages = messages.filter((message) => !message.read)
          setMessages(messages)
          setUnreadCount(unreadMessages.length)
        } else {
          await message.open({ type: 'error', content: res.data.error })
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (user._id !== '') fetchNotifications()
  }, [user._id])

  const handleLogout: () => void = () => {
    dispatch(resetUser())
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    navigate('/login')
    navigate(0)
  }

  const items = [
    {
      key: '1',
      label: (
        <div
          className="text-3xl hover:text-sky-500 menu-icon"
          onClick={() => {
            navigate('/profile')
          }}>
          <UserOutlined className="text-3xl hover:text-sky-500 menu-icon" />
        </div>
      )
    },
    {
      key: '2',
      label: (
        <Dropdown
          menu={{
            items: messages.map((m, i) => {
              const { date } = m as { date: string }
              const item = {
                key: i,
                label: (
                  <Flex
                    vertical={true}
                    onClick={() => {
                      setSelectedMessage(m)
                      setMessages(
                        messages.map((message) => {
                          if (message._id === m._id) return { ...message, read: true }
                          return message
                        })
                      )
                    }}>
                    <Flex>
                      {m.senderUsername} sent you a message! <ArrowRightOutlined className="ml-2" />{' '}
                    </Flex>
                    <Flex>
                      <Typography.Text>{dateToString(date)}</Typography.Text>
                    </Flex>
                  </Flex>
                ),
                icon: !m.read && <UnreadCircle />
              }
              return item
            })
          }}
          trigger={['click']}
          onOpenChange={(open) => {
            setUnreadCount(0)
          }}>
          <div className="flex align-middle cursor-pointer">
            <BellOutlined className="text-3xl text-white hover:text-sky-500" />
            <Badge count={unreadCount} style={{ position: 'absolute', bottom: 15, right: 20 }} />
          </div>
        </Dropdown>
      )
    }
  ]

  return (
    <div>
      {contextHolder}
      <MessageModal message={selectedMessage} setMessage={setSelectedMessage} />
      <Layout.Header>
        <Menu mode="horizontal" direction="rtl" style={{ display: 'block' }}>
          <Menu.Item key="1">
            <Image src={Logo} preview={false} height={40} />
            <Link to="/" />
          </Menu.Item>
          <Menu.Item key="4" style={{ float: 'right' }} className="mr-1" onClick={handleLogout}>
            <LogoutOutlined className="text-3xl text-white hover:text-sky-500 menu-icon" />
          </Menu.Item>
          <Menu.Item
            key="2"
            style={{ float: 'right' }}
            onClick={() => {
              navigate('/profile')
            }}>
            <UserOutlined className="text-3xl text-white hover:text-sky-500 menu-icon" />
          </Menu.Item>
          <Menu.Item key="3" style={{ float: 'right' }}>
            <Dropdown
              menu={{
                items: messages.map((m, i) => {
                  const { date } = m as { date: string }
                  const item = {
                    key: i,
                    label: (
                      <Flex
                        vertical={true}
                        onClick={() => {
                          setSelectedMessage(m)
                          setMessages(
                            messages.map((message) => {
                              if (message._id === m._id) return { ...message, read: true }
                              return message
                            })
                          )
                        }}>
                        <Flex>
                          {m.senderUsername} sent you a message!{' '}
                          <ArrowRightOutlined className="ml-2" />{' '}
                        </Flex>
                        <Flex>
                          <Typography.Text>{dateToString(date)}</Typography.Text>
                        </Flex>
                      </Flex>
                    ),
                    icon: !m.read && <UnreadCircle />
                  }
                  return item
                })
              }}
              trigger={['click']}
              onOpenChange={(open) => {
                setUnreadCount(0)
              }}>
              <div>
                <BellOutlined className="text-3xl text-white hover:text-sky-500 menu-icon" />
                <Badge
                  count={unreadCount}
                  style={{ position: 'absolute', bottom: 15, right: 20 }}
                />
              </div>
            </Dropdown>
          </Menu.Item>
        </Menu>

        {/*
        <Flex justify="space-between" align="center">
          <Link to="/">
            <Image src={Logo} preview={false} height={70} />
          </Link>
          <Space size="large">
            <div
              className="flex align-middle cursor-pointer"
              onClick={() => {
                navigate('/profile')
              }}>
              <UserOutlined className="text-3xl text-white hover:text-sky-500" />
            </div>
            <Dropdown
              menu={{
                items: messages.map((m, i) => {
                  const { date } = m as { date: string }
                  const item = {
                    key: i,
                    label: (
                      <Flex
                        vertical={true}
                        onClick={() => {
                          setSelectedMessage(m)
                          setMessages(
                            messages.map((message) => {
                              if (message._id === m._id) return { ...message, read: true }
                              return message
                            })
                          )
                        }}>
                        <Flex>
                          {m.senderUsername} sent you a message!{' '}
                          <ArrowRightOutlined className="ml-2" />{' '}
                        </Flex>
                        <Flex>
                          <Typography.Text>{dateToString(date)}</Typography.Text>
                        </Flex>
                      </Flex>
                    ),
                    icon: !m.read && <UnreadCircle />
                  }
                  return item
                })
              }}
              trigger={['click']}
              onOpenChange={(open) => {
                setUnreadCount(0)
              }}>
              <div className="flex align-middle cursor-pointer">
                <BellOutlined className="text-3xl text-white hover:text-sky-500" />
                <Badge
                  count={unreadCount}
                  style={{ position: 'absolute', bottom: 15, right: 20 }}
                />
              </div>
            </Dropdown>
            <div className="flex align-middle cursor-pointer" onClick={handleLogout}>
              <LogoutOutlined className="text-3xl text-white hover:text-sky-500" />
            </div>
          </Space>

        </Flex>
            */}
      </Layout.Header>
      <Layout.Content className="m-5">{children}</Layout.Content>
    </div>
  )
}

export default Header
