import { Outlet, useNavigate, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState } from 'react'

import { useSelector } from 'react-redux'

import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service'
import { login, signup, logout } from '../store/actions/user.actions'

import { ImgUploader } from '../cmps/ImgUploader'
import { Modal } from '../cmps/Modal'


export function LoginSignup() {
    const navigate = useNavigate()
    const location = useLocation()
    const user = useSelector(storeState => storeState.userModule.user)

    async function onLogout() {
        try {
            await logout()
            navigate('/')
        } catch (err) {
            showErrorMsg('Could not log out')
        }
    }
    
    function onClose() {
        if (location.state?.backgroundLocation) {
            navigate(-1)
        } else {
            navigate('/stay')
        }
    }

    return (
        <Modal title="Welcome to Staybnb" onClose={onClose}>
            {user ? (
                <div className="user-menu">
                    <h3>Hello {user.fullname}</h3>
                    <button onClick={onLogout}>Logout</button>
                </div>
                ) : (
                    <>
                    <nav className="loginsignup-tabs">
                        <NavLink to="login" state={location.state}>
                            Log in
                        </NavLink>

                        <NavLink to="signup" state={location.state}>
                            Sign up
                        </NavLink>
                    </nav>

                    <div className="loginsignup-content">
                        <Outlet />
                    </div>
                </>
            )}
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
            <div className="loginsignup-form-field">
                <input
                    type="email"
                    name="username"
                    autoComplete="email"
                    value={credentials.username}
                    placeholder=""
                    aria-label="Email"
                    onChange={handleChange}
                    required
                />
                <label>Email</label>
            </div>
            
            <div className="loginsignup-form-field">
                <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    placeholder=""
                    aria-label="Password"
                    onChange={handleChange}
                    required
                />
                <label>Password</label>
            </div>
            <button type="submit">Login</button>
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
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            imgUrl
        }))    
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <div className="loginsignup-form-field">
                <input
                    type="text"
                    name="fullname"
                    autoComplete="name"
                    value={credentials.fullname}
                    placeholder=""
                    onChange={handleChange}
                    required
                />
                <label>Full Name</label>
            </div>

            <div className="loginsignup-form-field">
                <input
                    type="text"
                    name="username"
                    autoComplete="email"
                    value={credentials.username}
                    placeholder=""
                    onChange={handleChange}
                    required
                />
                <label>Email</label>
            </div>

            <div className="loginsignup-form-field">
                <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    placeholder=""
                    onChange={handleChange}
                    required
                />
                <label>Password</label>
            </div>
            <ImgUploader onUploaded={onUploaded} />
            <button type="submit">Signup</button>
        </form>
    )
}
