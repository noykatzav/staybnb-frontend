import { Routes, Route, Navigate } from 'react-router'

import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StayIndex } from './pages/StayIndex.jsx'
import { Chat } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { StayDetails } from './pages/StayDetails.jsx'
import { UserDetails } from './pages/UserDetails'

import { StayHeader } from './cmps/header/StayHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { HostIndex } from './pages/HostIndex'


export function RootCmp() {
    return (
        <div className="main-container">
            <StayHeader />
            <UserMsg />

            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/stay" replace />} />
                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route>
                    <Route path="stay" element={<StayIndex />} />
                    <Route path="stay/:stayId" element={<StayDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="hosting" element={<HostIndex />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}


