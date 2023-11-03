<template>
  <q-page class="main-padding">
    <div>
      <div class="top-row row items-center">
        <router-link to="/devices">
          <p class="main-text text-accent">Devices ></p>
        </router-link>
        <p class="main-text">&nbsp;Create</p>
      </div>
      <create-device-form class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CreateDeviceForm from 'src/components/CreateDeviceForm.vue';
</script>

<style lang="scss" scoped></style>
