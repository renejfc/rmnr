import { apiClient } from './client'

export type Team = {
  readonly team_id: number
  name: string
}

export const fetchTeams = async () => await apiClient<{ data: Team[]}>('/teams')
export const fetchTeam = async (teamId: Team['team_id']) => await apiClient<{ data: Team}>(`/teams/${teamId}`)
export const createTeam = async (team: Omit<Team, 'team_id'>) => await apiClient<{ data: Team }>(`/teams`, { method: 'POST', body: team })
export const updateTeam = async (team: Team) => await apiClient<{ data: Team }>(`/teams/${team.team_id}`, { method: 'PUT', body: team })
export const deleteTeam = async (teamId: Team['team_id']) => await apiClient(`/teams/${teamId}`, { method: 'DELETE' })
export const fetchTeamsCount = async () => await apiClient<number>('/teams/count')
