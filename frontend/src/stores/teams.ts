import { createTeam, deleteTeam, fetchTeams, fetchTeamsCount, type Team, updateTeam } from '@/api/teams'
import { defineStore } from 'pinia'
import { useMembershipsStore } from './memberships'
import { useUsersStore } from './users'

export const useTeamsStore = defineStore('teams', () => {
  const teamMembershipsStore = useMembershipsStore()
  const usersStore = useUsersStore()

  const teams = ref<Team[]>([])
  const _teamsCount = ref<number>(0)
  const teamsCount = computed(() => teams.value.length || _teamsCount.value)

  async function getAll () {
    try {
      const res = await fetchTeams()
      teams.value = res.data
    } catch (err) {
      console.error(err)
    }
  }

  async function add (team: Omit<Team, 'team_id'>) {
    try {
      const res = await createTeam(team)
      teams.value = [...teams.value, res.data]
    } catch (err) {
      console.error(err)
    }
  }

  async function update (team: Team) {
    try {
      await updateTeam(team)
      const index = teams.value.findIndex(t => t.team_id === team.team_id)

      if (index >= 0) {
        teams.value[index] = { ...teams.value[index], ...team }
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function remove (teamId: Team['team_id']) {
    try {
      await deleteTeam(teamId)
      teams.value = teams.value.filter(t => t.team_id !== teamId)
    } catch (err) {
      console.error(err)
    }
  }

  async function getTeamsCount () {
    try {
      const res = await fetchTeamsCount()
      _teamsCount.value = res
    } catch (err) {
      console.error(err)
    }
  }

  async function getTeamMembers (teamId: number) {
    const memberships = await teamMembershipsStore.getTeamMembers(teamId)
    const userIds = memberships.map(m => m.user_id)
    return usersStore.users.filter(user => userIds.includes(user.user_id))
  }

  async function addUserToTeam (teamId: number, userId: number) {
    return teamMembershipsStore.addUserToTeam(teamId, userId)
  }

  async function removeUserFromTeam (teamId: number, userId: number) {
    const memberships = await teamMembershipsStore.getTeamMembers(teamId)
    const membership = memberships.find(m => m.user_id === userId)

    if (membership) await teamMembershipsStore.removeUserFromTeam(membership.membership_id)
  }

  return { teams, teamsCount, getTeamsCount, getAll, add, update, remove, removeUserFromTeam, getTeamMembers, addUserToTeam }
})
