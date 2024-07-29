import { apiClient } from './client'

export type User = {
  readonly user_id: number
  first_name: string
  last_name: string
  email: string
  status: string
}

export const fetchUsers = async () => await apiClient<{ data: User[]}>('/users')
export const fetchUser = async (userId: User['user_id']) => await apiClient<{ data: User}>(`/users/${userId}`)
export const createUser = async (user: Omit<User, 'user_id'>) => await apiClient<{ data: User }>(`/users`, { method: 'POST', body: user })
export const updateUser = async (user: Partial<User> & Pick<User, 'user_id'>) => await apiClient<{ data: User }>(`/users/${user.user_id}`, { method: 'PUT', body: user })
export const deleteUser = async (userId: User['user_id']) => await apiClient(`/users/${userId}`, { method: 'DELETE' })
export const fetchUsersCount = async () => await apiClient<number>('/users/count')
