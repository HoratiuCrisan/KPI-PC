import axios from 'axios'

export default async function handler(req: any, res: any) {
    try {
        const response = await axios.get('../../backend/crud/views')
        const users = response.data
        res.json(users)
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error getting users'})
    }
}