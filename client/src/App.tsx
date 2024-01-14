import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Layout, App as AntdApp } from 'antd'
import Home from './pages/Home'
import Landing from './pages/Landing'
import MyProfile from './pages/MyProfile'
import UserProfile from './pages/UserProfile'
import './App.css'
import 'antd/dist/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProtectedRoute from './components/ProtectedRoute'
import PasswordReset from './pages/ResetPassword'
import AdminHome from './pages/admin/AdminHome'
import AdminGyms from './pages/admin/AdminGyms'
import AdminSetters from './pages/admin/AdminSetters'
import AdminUsers from './pages/admin/AdminUsers'
import RouteRequests from './pages/RouteRequests'
import { colors } from './utils/theme'
import { Identity } from './types/user'
import SetRequests from './pages/SetRequests'
import FindRoutes from './pages/FindRoutes'
import RoutePage from './pages/Route'
import RouteHistory from './pages/RouteHistory'

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: colors.bg_sky_700,
            colorPrimaryHover: colors.bg_sky_600,
            colorLink: colors.bg_sky_700,
            colorLinkHover: colors.bg_sky_600
          },
          Typography: {
            colorLink: colors.bg_sky_700,
            colorLinkActive: colors.bg_sky_600,
            colorText: colors.bg_sky_950,
            colorTextHeading: colors.bg_sky_950
          },
          Input: {
            borderRadius: 10,
            colorBorder: colors.bg_sky_700,
            colorPrimaryBorder: colors.bg_sky_700,
            activeBorderColor: colors.bg_sky_600
          },
          InputNumber: {
            borderRadius: 10,
            colorBorder: colors.bg_sky_700,
            colorPrimaryBorder: colors.bg_sky_700,
            activeBorderColor: colors.bg_sky_600
          },
          Select: {
            borderRadius: 10,
            colorBorder: colors.bg_sky_700,
            optionActiveBg: colors.bg_sky_300,
            optionSelectedBg: colors.bg_sky_200
          },
          Layout: {
            headerBg: colors.bg_sky_950,
            headerHeight: 100,
            headerPadding: '0px 10px 0px 20px',
            bodyBg: colors.white
          },
          Menu: {
            colorBgBase: colors.bg_sky_950,
            itemBg: colors.bg_sky_950,
            itemSelectedBg: colors.bg_sky_950,
            itemSelectedColor: colors.bg_sky_950,
            itemActiveBg: colors.bg_sky_950
          },
          List: {
            colorBorder: colors.bg_sky_500
          }
        }
      }}>
      <AntdApp>
        <Layout>
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedRoute identity={Identity.ADMIN} />} path="/admin">
                <Route Component={AdminHome} path="/admin/" />
                <Route Component={AdminGyms} path="/admin/gyms" />
                <Route Component={AdminSetters} path="/admin/setters" />
                <Route Component={AdminUsers} path="/admin/users" />
              </Route>
              <Route Component={Landing} path="/login" />
              <Route Component={PasswordReset} path="/passwordReset" />
              <Route element={<ProtectedRoute identity={undefined} />} path="/">
                <Route Component={Home} path="/" />
                <Route Component={MyProfile} path="/profile" />
                <Route Component={UserProfile} path="/profile/:id" />
                <Route Component={RoutePage} path="/routes/:id" />
              </Route>
              <Route element={<ProtectedRoute identity={Identity.SETTER} />} path="/">
                <Route Component={SetRequests} path="/set-requests" />
                <Route Component={RouteHistory} path="/set-history" />
              </Route>
              <Route element={<ProtectedRoute identity={Identity.CLIMBER} />} path="/">
                <Route Component={FindRoutes} path="/browse" />
                <Route Component={RouteRequests} path="/route-requests" />
                <Route Component={RouteHistory} path="/route-history" />
              </Route>
            </Routes>
          </BrowserRouter>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
