<script setup lang="ts"></script>

<template>
  <VNavigationDrawer class="pa-2" permanent theme="dark" :width="204">
    <VListItem
      active-class="active-color"
      class="mb-2"
      link
      rounded
      title="Overview"
      to="/"
    />
    <VListItem
      active-class="active-color"
      class="mb-2"
      link
      rounded
      title="Usuarios"
      to="/users"
    />
    <VListItem
      active-class="active-color"
      class="mb-2"
      link
      rounded
      title="Equipos"
      to="/teams"
    />
  </VNavigationDrawer>
</template>

<style scoped>
.active-color {
  color: black;
  background-color: white;
}
</style>
