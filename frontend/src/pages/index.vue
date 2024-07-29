<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useUsersStore } from '@/stores/users'
  import { useTeamsStore } from '@/stores/teams'

  const userStore = useUsersStore()
  const teamStore = useTeamsStore()

  const { usersCount } = storeToRefs(userStore)
  const { teamsCount } = storeToRefs(teamStore)

  onMounted(async () => {
    await userStore.getUsersCount()
    await teamStore.getTeamsCount()
  })
</script>

<template>
  <v-toolbar color="primary">
    <v-toolbar-title>Overview</v-toolbar-title>
  </v-toolbar>
  <VContainer class="py-5 px-10" fluid>
    <VRow>
      <VCol cols="6">
        <VCard class="h-100">
          <VCardTitle class="headline d-flex flex-lg-row align-md-center pa-5 ga-3">
            <span class="text-h6 font-weight-bold">Prueba técnica</span>
            <hr class="solid w-100">
            <v-menu>
              <template #activator="{ props }">
                <VBtn
                  color="white"
                  end
                  icon
                  v-bind="props"
                >
                  <VIcon color="black">mdi-dots-vertical</VIcon>
                </VBtn>
              </template>
              <VBtn
                class="my-3"
                color="white"
              >
                <VIcon color="black">mdi-cog</VIcon>
                <span>Config</span>
              </VBtn>
              <VBtn
                color="white"
              >
                <VIcon color="black">mdi-pencil</VIcon>
                <span>Editar</span>
              </VBtn>
            </v-menu>
          </VCardTitle>
          <VCardText class="pl-5">
            <div>
              <p class="text-decoration-underline">Consigna:</p>
              <ul class="pl-6 pb-4 list-none">
                <li>Replicar este dashboard respetando estilos y colores definidos en Figma.</li>
                <li>Agregar vistas para manejo de usuarios, equipos e integraciones, linkeables desde el panel de navegación.</li>
                <li>Realizar un backend para el CRUD de los datos de usuarios, equipos e integraciones implementando los modelos descriptos abajo.</li>
              </ul>
              <p class="text-decoration-underline">Requerimientos:</p>
              <ul class="pl-6">
                <li>Para el frontend utilizar el framework Vue.js con librería de componentes Vuetify.</li>
                <li>Para el backend utilizar el framework Fastapi.</li>
                <li>Entrega del código de frontend y backend en un zip.</li>
              </ul>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="6">
        <VCol cols="12 pt-0">
          <VCard class="pa-4" outlined>
            <VCardTitle>
              <VRow align="center" class="w-100" justify="space-between">
                <VCol>
                  <span>Usuarios</span>
                </VCol>
                <VCol class="text-right">
                  <span class="text-primary font-weight-bold">{{ usersCount }}</span>
                </VCol>
              </VRow>
            </VCardTitle>
          </VCard>
        </VCol>
        <VCol cols="12">
          <VCard class="pa-4" outlined>
            <VCardTitle>
              <VRow align="center" class="w-100" justify="space-between">
                <VCol>
                  <span>Equipos</span>
                </VCol>
                <VCol class="text-right">
                  <span class="text-primary font-weight-bold">{{ teamsCount }}</span>
                </VCol>
              </VRow>
            </VCardTitle>
          </VCard>
        </VCol>
        <VCol cols="12 pb-0">
          <VCard class="pa-4" outlined>
            <VCardTitle>
              <VRow align="center" class="w-100" justify="space-between">
                <VCol>
                  <span>Integraciones</span>
                </VCol>
                <VCol class="text-right">
                  <span class="text-primary font-weight-bold">{{ 0 }}</span>
                </VCol>
              </VRow>
            </VCardTitle>
          </VCard>
        </VCol>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12">
        <VCard class="pa-5">
          <VCardTitle class="headline">Modelos de datos</VCardTitle>
          <VCardText>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style lang="scss" scoped>
ul {
  list-style: disc;
}

li::marker {
  font-size: 12px
}
</style>
