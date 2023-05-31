import {useState } from 'react'

async function fetchData() {
    const response = await fetch('../api/connection')
    const data = await response.json()
    return data
}

export default function useClient() {
const [dbUsers, setDbUsers] = useState<Array<any>>([])

    async function handleClick() {
        const data = await fetchData()
        setDbUsers(data)
    }
    return {dbUsers, handleClick}
}