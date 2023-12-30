import type { FC, ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Layout, Button, Flex, Space, Dropdown, Badge, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetUser, userSelector } from '../store/userSlice'
import { BellOutlined, LogoutOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { getReceiverMessages } from '../api/messages'
import { type IMessage } from '../types/message'
import { useAppSelector } from '../store/rootReducer'
import useMessage from 'antd/es/message/useMessage'
import MessageModal from './MessageModal'
import { dateToString } from '../utils/date'

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

  return (
    <Layout className="h-full">
      {contextHolder}
      <MessageModal message={selectedMessage} setMessage={setSelectedMessage} />
      <Layout.Header>
        <Flex justify="space-between" align="center">
          <div className="logo" />
          <Space>
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
                <BellOutlined className="text-3xl text-white" />
                <Badge
                  count={unreadCount}
                  style={{ position: 'absolute', bottom: 15, right: 20 }}
                />
              </div>
            </Dropdown>
            <Button type="link" onClick={handleLogout}>
              <LogoutOutlined className="text-3xl text-white" />
            </Button>
          </Space>
        </Flex>
      </Layout.Header>
      <Layout.Content className="m-5 h-full">{children}</Layout.Content>
    </Layout>
  )
}

export default Header
