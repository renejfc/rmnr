<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useUsersStore } from '@/stores/users'
  import { User } from '@/api/users'

  const store = useUsersStore()
  const { users } = storeToRefs(store)

  const tableHeaders = [
    { title: 'First Name', key: 'first_name', align: 'center' },
    { title: 'Last Name', key: 'last_name', align: 'center' },
    { title: 'Email', key: 'email', align: 'center' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
  ]

  const addUserForm = reactive({
    valid: false,
    first_name: '',
    firstNameRules: [
      (v: string) => !!v || 'Please enter a first name',
    ],
    last_name: '',
    lastNameRules: [
      (v: string) => !!v || 'Please enter a last name',
    ],
    email: '',
    emailRules: [
      (v: string) => !!v || 'Email address is required',
      (v: string) => /.+@.+/.test(v) || 'Please enter a valid email address',
    ],
    status: '',
    statusRules: [
      (v: string) => !!v || 'Please select a status',
    ],
  })

  const dialog = ref(false)
  const openDialog = () => dialog.value = true
  const openEditDialog = () => { isEditing.value = true; openDialog() }
  const closeDialog = () => dialog.value = false
  const closeEditDialog = () => { isEditing.value = false; closeDialog() }
  const isEditing = ref(false)

  const addUser = async () => {
    if (!addUserForm.valid) return

    await store.add({
      email: addUserForm.email,
      first_name: addUserForm.first_name,
      last_name: addUserForm.last_name,
      status: addUserForm.status,
    })

    closeDialog()
  }

  const editingUser = ref<User>()
  const editUserForm = reactive({
    valid: false,
    first_name: '',
    firstNameRules: [
      (v: string) => !!v || 'Please enter a first name',
    ],
    last_name: '',
    lastNameRules: [
      (v: string) => !!v || 'Please enter a last name',
    ],
    email: '',
    emailRules: [
      (v: string) => !!v || 'Email address is required',
      (v: string) => /.+@.+/.test(v!) || 'Please enter a valid email address',
    ],
    status: '',
    statusRules: [
      (v: string) => !!v || 'Please select a status',
    ],
  })

  const editDialog = (user: User) => {
    editingUser.value = user
    editUserForm.first_name = user.first_name
    editUserForm.last_name = user.last_name
    editUserForm.email = user.email
    editUserForm.status = user.status
    openEditDialog()
  }

  const editUser = async () => {
    if (!editUserForm.valid || !editingUser?.value?.user_id) return

    await store.update({
      user_id: editingUser.value.user_id,
      first_name: editUserForm.first_name,
      last_name: editUserForm.last_name,
      email: editUserForm.email,
      status: editUserForm.status,
    })

    closeEditDialog()
  }

  const deleteUser = async (user: User) => {
    await store.remove(user)
  }

  onMounted(async () => {
    await store.getAll()
  })
</script>

<template>
  <v-data-table density="comfortable" :headers="(tableHeaders as any)" :items="users">
    <template #top>
      <v-toolbar color="primary">
        <v-toolbar-title>Users</v-toolbar-title>
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ props }">
            <v-btn dark v-bind="props">New User</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ isEditing ? 'Edit User' : 'New User' }}</span>
            </v-card-title>
            <v-card-text>
              <v-form v-if="!isEditing" v-model="addUserForm.valid" @submit.prevent="addUser">
                <v-text-field
                  v-model="addUserForm.first_name"
                  label="First Name"
                  name="first_name"
                  :rules="addUserForm.firstNameRules"
                />
                <v-text-field
                  v-model="addUserForm.last_name"
                  label="Last Name"
                  name="last_name"
                  :rules="addUserForm.lastNameRules"
                />
                <v-text-field v-model="addUserForm.email" label="Email" name="email" :rules="addUserForm.emailRules" />
                <v-select
                  v-model="addUserForm.status"
                  :items="['Active', 'Inactive']"
                  label="Status"
                  name="status"
                  :rules="addUserForm.statusRules"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
                  <v-btn block color="blue-darken-1" type="submit" variant="text">Save</v-btn>
                </v-card-actions>
              </v-form>
              <v-form v-else v-model="editUserForm.valid" @submit.prevent="editUser">
                <v-text-field
                  v-model="editUserForm.first_name"
                  label="First Name"
                  name="first_name"
                  :rules="editUserForm.firstNameRules"
                />
                <v-text-field
                  v-model="editUserForm.last_name"
                  label="Last Name"
                  name="last_name"
                  :rules="editUserForm.lastNameRules"
                />
                <v-text-field v-model="editUserForm.email" label="Email" name="email" :rules="editUserForm.emailRules" />
                <v-select
                  v-model="editUserForm.status"
                  :items="['Active', 'Inactive']"
                  label="Status"
                  name="status"
                  :rules="editUserForm.statusRules"
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
      <v-icon @click="deleteUser(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
