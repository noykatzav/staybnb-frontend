import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function AdminIndex() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.user)
    const users = useSelector(storeState => storeState.userModule.users)
    const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
    const isAdmin = Boolean(user?.isAdmin)

    useEffect(() => {
        if (!isAdmin) {
            navigate('/')
            return
        }
        async function onLoadUsers() {
            try {
                await loadUsers()
            } catch (err) {
                showErrorMsg('Cannot load users')
            }
        }
        onLoadUsers()
    }, [isAdmin, navigate])

    async function onRemoveUser(userId) {
        try {
            await removeUser(userId)
            showSuccessMsg('User removed')
        } catch (err) {
            showErrorMsg('Cannot remove user')
        }
    }

    if (!isAdmin) return null

    return (
        <section className="admin-index">
            {isLoading && 'Loading...'}
            {users && <ul>
                {users.map(user => <li key={user._id}>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                    <button onClick={() => onRemoveUser(user._id)}>Remove {user.username}</button>
                </li>)}
            </ul>}
        </section>
    )
}
