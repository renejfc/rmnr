import { ofetch } from 'ofetch'

const API_VERSION = 'v1'
const API_PREFIX = 'api'
const API_BASE = `${API_PREFIX}/${API_VERSION}`
const baseURL = `${import.meta.env.VITE_BACKEND_URL}/${API_BASE}`

export const apiClient = ofetch.create({ baseURL })
