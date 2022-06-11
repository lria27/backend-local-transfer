import {useState, useCallback, useEffect} from 'react'
const storageName = 'marketData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [marketId, setMarketId] = useState(null)
    const [role, setRole] = useState(null)

    const login = useCallback((jwtToken, id, role) => {
        setToken(jwtToken)
        setMarketId(id)
        setRole(role)
        localStorage.setItem(storageName, JSON.stringify({
            marketId: id, token: jwtToken, role: role
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setMarketId(null)
        setRole(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.marketId, data.role)
        }
        setReady(true)
    }, [login])

    return { login, logout, role ,token, marketId, ready }
}