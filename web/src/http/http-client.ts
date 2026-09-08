import { env } from '@config/env'
import axios from 'axios'

export const httpClient = axios.create({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
})
