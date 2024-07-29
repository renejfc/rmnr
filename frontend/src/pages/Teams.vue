<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useTeamsStore } from '@/stores/teams'
  import type { Team } from '@/api/teams'

  const teamStore = useTeamsStore()
  const { teams } = storeToRefs(teamStore)

  const tableHeaders = [
    { title: 'Name', key: 'name', align: 'center' },
    { title: 'Members', key: 'members', align: 'center' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
  ]

  const addTeamForm = reactive({
    valid: false,
    name: '',
    nameRules: [
      (v: string) => !!v || 'Please enter a name',
    ],
  })

  const dialog = ref(false)
  const openDialog = () => dialog.value = true
  const openEditDialog = () => { isEditing.value = true; openDialog() }
  const closeDialog = () => dialog.value = false
  const closeEditDialog = () => { isEditing.value = false; closeDialog() }
  const isEditing = ref(false)

  const addTeam = async () => {
    if (!addTeamForm.valid) return

    await teamStore.add({
      name: addTeamForm.name,
    })

    closeDialog()
  }

  const editingTeam = ref<Team>()
  const editTeamForm = reactive({
    valid: true,
    name: '',
    nameRules: [
      (v: string) => !!v || 'Please enter a name',
    ],
  })

  const editDialog = (team: Team) => {
    editingTeam.value = team
    editTeamForm.name = team.name
    openEditDialog()
  }

  const editTeam = async () => {
    if (!editTeamForm.valid || !editingTeam?.value?.team_id) return

    await teamStore.update({
      team_id: editingTeam.value.team_id,
      name: editTeamForm.name,
    })

    closeEditDialog()
  }

  const deleteTeam = async (team: Team) => {
    await teamStore.remove(team.team_id)
  }

  const teamMemberstTableHeaders = [
    { title: 'Name', key: 'first_name', align: 'center' },
    { title: 'Email', key: 'email', align: 'center' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
  ]

  const teamMembersDialog = ref(false)
  const openTeamMembersDialog = async (team: Team) => {
    teamMembersDialog.value = true
  }

  onMounted(async () => {
    await teamStore.getAll()
  })
</script>

<template>
  <v-data-table density="comfortable" :headers="(tableHeaders as any)" :items="teams">
    <template #top>
      <v-toolbar color="primary">
        <v-toolbar-title>Teams</v-toolbar-title>
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ props }">
            <v-btn dark v-bind="props">New Team</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ isEditing ? 'Edit Team' : 'New Team' }}</span>
            </v-card-title>
            <v-card-text>
              <v-form v-if="!isEditing" v-model="addTeamForm.valid" @submit.prevent="addTeam">
                <v-text-field
                  v-model="addTeamForm.name"
                  label="Name"
                  name="name"
                  :rules="addTeamForm.nameRules"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
                  <v-btn color="blue-darken-1" type="submit" variant="text">Save</v-btn>
                </v-card-actions>
              </v-form>
              <v-form v-else v-model="editTeamForm.valid" @submit.prevent="editTeam">
                <v-text-field
                  v-model="editTeamForm.name"
                  label="Name"
                  name="name"
                  :rules="editTeamForm.nameRules"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
                  <v-btn color="blue-darken-1" type="submit" variant="text">Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-icon class="me-2" @click="editDialog(item)">
        mdi-pencil
      </v-icon>
      <v-icon @click="deleteTeam(item)">
        mdi-delete
      </v-icon>
    </template>
    <template #item.members="{ item }">
      <v-icon class="me-2" @click="openTeamMembersDialog(item)">
        mdi-eye
      </v-icon>
    </template>
  </v-data-table>
  <v-dialog v-model="teamMembersDialog" max-width="70%">
      <v-card>
        <v-card-title>
          <span class="text-h5">Members</span>
        </v-card-title>
        <v-card-text>
          <v-data-table density="compact" :headers="(teamMemberstTableHeaders as any)" :items="[]">
          </v-data-table>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>
