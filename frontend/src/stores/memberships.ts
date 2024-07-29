import { defineStore } from 'pinia'
import { createMembership, deleteMembership, fetchMemberships, type Membership } from '@/api/memberships'

export const useMembershipsStore = defineStore('memberships', () => {
  const memberships = ref<Membership[]>([])

  async function getTeamMembers (teamId: number) {
    try {
      const res = await fetchMemberships({ team_id: teamId })
      return res.data
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async function getUserTeams (userId: number) {
    try {
      const res = await fetchMemberships({ user_id: userId })
      return res.data
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async function addUserToTeam (teamId: number, userId: number) {
    try {
      const res = await createMembership({ team_id: teamId, user_id: userId })
      memberships.value = [...memberships.value, res.data]
      return res.data
    } catch (err) {
      console.error(err)
    }
  }

  async function removeUserFromTeam (membershipId: number) {
    try {
      await deleteMembership(membershipId)
      memberships.value = memberships.value.filter(m => m.membership_id !== membershipId)
    } catch (err) {
      console.error(err)
    }
  }

  return { memberships, getTeamMembers, getUserTeams, addUserToTeam, removeUserFromTeam }
})
