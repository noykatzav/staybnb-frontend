import { Outlet, useNavigate, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState } from 'react'

import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service'
import { login, signup } from '../store/actions/user.actions'

import { ImgUploader } from '../cmps/ImgUploader'
import { Modal } from '../cmps/Modal'


export function LoginSignup() {
    const navigate = useNavigate()
    const location = useLocation()

    function onClose() {
        if (location.state?.backgroundLocation) {
            navigate(-1)
        } else {
            navigate('/stay')
        }
    }

    return (
        <Modal title="Welcome to Stay" onClose={onClose}>

            <nav className="auth-tabs">
                <NavLink to="login" state={location.state}>
                    Log in
                </NavLink>

                <NavLink to="signup" state={location.state}>
                    Sign up
                </NavLink>
            </nav>

            <div className="auth-content">
                <Outlet />
            </div>

        </Modal>
    )
}

export function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' })

    const navigate = useNavigate()

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password) return
        try {
            await login(credentials)
            navigate('/')
        } catch (err) {
            showErrorMsg('Invalid username or password')
        }
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    return (
        <form className="login-form" onSubmit={onLogin}>
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                aria-label="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                aria-label="Password"
                onChange={handleChange}
                required
            />
            <button>Login</button>
        </form>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname) return
        try {
            await signup(credentials)
            clearState()
            navigate('/')
        } catch (err) {
            showErrorMsg(err.message === 'Username already exists' ? err.message : 'Cannot sign up')
        }
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <ImgUploader onUploaded={onUploaded} />
            <button>Signup</button>
        </form>
    )
}
