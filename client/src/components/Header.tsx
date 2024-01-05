import type { FC, ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Layout, Flex, Dropdown, Badge, Typography, Image } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { resetUser, userSelector } from '../store/userSlice'
import {
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
  ArrowRightOutlined,
  UserOutlined,
  UnorderedListOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import { getReceiverMessages } from '../api/messages'
import { type IMessage } from '../types/message'
import { useAppSelector } from '../store/rootReducer'
import useMessage from 'antd/es/message/useMessage'
import MessageModal from './MessageModal'
import { dateToString } from '../utils/date'
import Logo from '../assets/logo.png'
import { Identity } from '../types/user'

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
  const [toggled, setToggled] = useState(false)
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

  const messageElements =
    messages.length === 0
      ? [{ key: '1', label: 'You currently have no messages!' }]
      : messages.map((m, i) => {
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

  return (
    <div>
      {contextHolder}
      <MessageModal message={selectedMessage} setMessage={setSelectedMessage} />
      <Navbar
        expand="lg"
        variant="dark"
        className="bg-sky-950"
        onToggle={(toggled) => {
          setToggled(toggled)
        }}>
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <Image src={Logo} preview={false} width={200} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse className="justify-end" id="responsive-navbar-nav">
            <Nav>
              {user.identity === Identity.CLIMBER && (
                <Nav.Link href="/browse" className="mx-3">
                  <div className="flex text-slate-50 hover:text-sky-500">
                    <SearchOutlined className="text-3xl" />
                    {toggled && <div className="ml-3">Browse Requests</div>}
                  </div>
                </Nav.Link>
              )}
              {user.identity === Identity.CLIMBER && (
                <Nav.Link href="/route-requests" className="mx-3">
                  <div className="flex text-slate-50 hover:text-sky-500">
                    <UnorderedListOutlined className="text-3xl" />
                    {toggled && <div className="ml-3">My Requests</div>}
                  </div>
                </Nav.Link>
              )}
              {user.identity === Identity.CLIMBER && (
                <Nav.Link href="/route-history" className="mx-3">
                  <div className="flex text-slate-50 hover:text-sky-500">
                    <HistoryOutlined className="text-3xl" />
                    {toggled && <div className="ml-3">My History</div>}
                  </div>
                </Nav.Link>
              )}
              {user.identity === Identity.SETTER && (
                <Nav.Link href="/set-requests" className="mx-3">
                  <div className="flex text-slate-50 hover:text-sky-500">
                    <UnorderedListOutlined className="text-3xl" />
                    {toggled && <div className="ml-3">My Set Requests</div>}
                  </div>
                </Nav.Link>
              )}
              {user.identity === Identity.SETTER && (
                <Nav.Link href="/set-history" className="mx-3">
                  <div className="flex text-slate-50 hover:text-sky-500">
                    <HistoryOutlined className="text-3xl" />
                    {toggled && <div className="ml-3">My History</div>}
                  </div>
                </Nav.Link>
              )}
              <Nav.Link className="mx-3">
                <div
                  className="flex text-slate-50 hover:text-sky-500"
                  onClick={() => {
                    navigate('/profile')
                  }}>
                  <UserOutlined className="text-3xl" />
                  {toggled && <div className="ml-3">My Profile</div>}
                </div>
              </Nav.Link>
              <Nav.Link className="mx-3">
                <Dropdown
                  menu={{
                    items: messageElements
                  }}
                  trigger={['click']}
                  onOpenChange={(open) => {
                    setUnreadCount(0)
                  }}>
                  <div className="flex align-middle cursor-pointer text-slate-50 hover:text-sky-500">
                    <BellOutlined className="text-3xl" />
                    <Badge
                      className="text-3xl"
                      count={unreadCount}
                      style={{ position: 'absolute', bottom: 15, right: 20 }}
                    />
                    {toggled && <div className="ml-3">Messages</div>}
                  </div>
                </Dropdown>
              </Nav.Link>
              <Nav.Link className="mx-3">
                <div className="flex text-slate-50 hover:text-sky-500" onClick={handleLogout}>
                  <LogoutOutlined className="text-3xl" />
                  {toggled && <div className="ml-3">Logout</div>}
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Layout.Content className="m-5">{children}</Layout.Content>
    </div>
  )
}

export default Header
