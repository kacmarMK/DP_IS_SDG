<template>
  <q-page class="main-padding">
    <div>
      <div class="top-row row items-center">
        <router-link :to="`/devices/${route.params.id.toString()}`">
          <p class="main-text text-accent">Device ></p>
        </router-link>
        <p class="main-text">&nbsp;Edit</p>
      </div>
      <create-device-form
        :is-editing="true"
        :editing-device-id="route.params.id.toString()"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CreateDeviceForm from 'src/components/CreateDeviceForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="scss" scoped></style>
