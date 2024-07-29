import { apiClient } from './client'

export type Membership = {
  readonly membership_id: number
  readonly team_id: number
  readonly user_id: number
}

export const fetchMemberships = async (params?: { team_id?: number, user_id?: number }) =>
  await apiClient<{ data: Membership[] }>('/team-memberships', { params })

export const fetchMembership = async (membershipId: Membership['membership_id']) =>
  await apiClient<{ data: Membership }>(`/team-memberships/${membershipId}`)

export const createMembership = async (membership: Omit<Membership, 'membership_id'>) =>
  await apiClient<{ data: Membership }>('/team-memberships', { method: 'POST', body: membership })

export const deleteMembership = async (membershipId: Membership['membership_id']) =>
  await apiClient(`/team-memberships/${membershipId}`, { method: 'DELETE' })
