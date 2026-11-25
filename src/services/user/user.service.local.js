import { storageService } from '../async-storage.service'
import { saveToStorage } from '../util.service'
import demoUsers from '../../data/demo-users.json'

const STORAGE_KEY = 'user'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
}

let seedUsersPromise

async function getUsers() {
    await _ensureUsers()
    const users = await storageService.query(STORAGE_KEY)
    return users.map(_withoutPassword)
}

async function getById(userId) {
    await _ensureUsers()
    const user = await storageService.get(STORAGE_KEY, userId)
    return _withoutPassword(user)
}

async function remove(userId) {
    await _ensureUsers()
    return storageService.remove(STORAGE_KEY, userId)
}

async function update({ _id, score }) {
    await _ensureUsers()
    const user = await storageService.get(STORAGE_KEY, _id)
    user.score = score
    await storageService.put(STORAGE_KEY, user)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser?._id === user._id) saveLoggedinUser(user)

    return _withoutPassword(user)
}

async function login(userCred) {
    await _ensureUsers()
    const users = await storageService.query(STORAGE_KEY)
    const user = users.find(user => user.username === userCred.username && user.password === userCred.password)

    if (!user) throw new Error('Invalid username or password')
    return saveLoggedinUser(user)
}

async function signup(userCred) {
    await _ensureUsers()
    const users = await storageService.query(STORAGE_KEY)
    if (users.some(user => user.username === userCred.username)) throw new Error('Username already exists')

    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000
    userCred.isHost = false

    const user = await storageService.post(STORAGE_KEY, userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        score: user.score, 
        isAdmin: user.isAdmin,
        isHost: user.isHost
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

async function _createUsers() {
    const users = await storageService.query(STORAGE_KEY)
    if (users.length) return

    saveToStorage(STORAGE_KEY, demoUsers)
}

function _ensureUsers() {
    seedUsersPromise ||= _createUsers()
    return seedUsersPromise
}

function _withoutPassword(user) {
    const publicUser = { ...user }
    delete publicUser.password
    return publicUser
}
