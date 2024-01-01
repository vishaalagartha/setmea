import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Layout } from 'antd'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import './App.css'
import 'antd/dist/reset.css'
import ProtectedRoute from './components/ProtectedRoute'
import PasswordReset from './pages/ResetPassword'
import AdminHome from './pages/admin/AdminHome'
import AdminGyms from './pages/admin/AdminGyms'
import AdminSetters from './pages/admin/AdminSetters'
import AdminUsers from './pages/admin/AdminUsers'
import { colors } from './utils/theme'

/*
Colors:
#00538C;
#002B5E;
#B8C4CA;
*/

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
            colorLinkActive: colors.bg_sky_600
          },
          Input: {
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
            bodyBg: colors.white
          }
        }
      }}>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute admin={true} />} path="/admin">
              <Route Component={AdminHome} path="/admin/" />
              <Route Component={AdminGyms} path="/admin/gyms" />
              <Route Component={AdminSetters} path="/admin/setters" />
              <Route Component={AdminUsers} path="/admin/users" />
            </Route>
            <Route Component={Landing} path="/login" />
            <Route Component={PasswordReset} path="/passwordReset" />
            <Route element={<ProtectedRoute admin={false} />} path="/">
              <Route Component={Home} path="/" />
              <Route Component={Profile} path="/profile" />
            </Route>
          </Routes>
        </BrowserRouter>
      </Layout>
    </ConfigProvider>
  )
}

export default App
