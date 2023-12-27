import type { FC, ReactNode } from 'react'
import { Layout, Menu, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetUser } from '../store/userSlice'

interface HeaderProps {
  children: ReactNode
}

const Header: FC<HeaderProps> = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout: () => void = () => {
    dispatch(resetUser())
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    navigate('/login')
    navigate(0)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider collapsible breakpoint="lg" collapsedWidth={0}>
        <Menu theme="dark" mode="inline" />
      </Layout.Sider>
      <Layout className="site-layout">
        <Layout.Header>
          <Button type="link" onClick={handleLogout}>
            <div style={{ color: 'white' }}>Logout</div>
          </Button>
        </Layout.Header>
        <Layout.Content className="m-5">{children}</Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Header
