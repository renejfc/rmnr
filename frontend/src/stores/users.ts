import { createUser, deleteUser, fetchUsers, fetchUsersCount, updateUser, type User } from '@/api/users'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const _usersCount = ref<number>(0)
  const usersCount = computed(() => users.value.length || _usersCount.value)

  async function getAll () {
    try {
      const res = await fetchUsers()
      users.value = res.data
    } catch (err) {
      console.error(err)
    }
  }

  async function add (user: Omit<User, 'user_id'>) {
    try {
      const res = await createUser(user)
      users.value = [...users.value, res.data]
    } catch (err) {
      console.error(err)
    }
  }

  async function update (user: Partial<User> & Pick<User, 'user_id'>) {
    try {
      await updateUser(user)
      const index = users.value.findIndex(u => u.user_id === user.user_id)

      if (index >= 0) { users.value[index] = { ...users.value[index], ...user } }
    } catch (err) {
      console.error(err)
    }
  }

  async function remove ({ user_id }: User) {
    try {
      await deleteUser(user_id)
      users.value = users.value.filter(u => u.user_id !== user_id)
    } catch (err) {
      console.error(err)
    }
  }

  async function getUsersCount () {
    try {
      const res = await fetchUsersCount()
      _usersCount.value = res
    } catch (err) {
      console.error(err)
    }
  }

  return { users, usersCount, getUsersCount, getAll, add, update, remove }
})
