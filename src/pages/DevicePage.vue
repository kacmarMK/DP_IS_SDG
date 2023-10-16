<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <router-link
          class="main-text text-accent text-weight-medium"
          to="/devices"
          >Devices ></router-link
        >
        <p class="main-text">&nbsp;{{ device?.name }}</p>
        <q-space></q-space>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Device } from '../models/Device';
import deviceService from 'src/services/DeviceService';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

const route = useRoute();

// Get device
const device = ref<Device | null>(null);
const isLoadingDevice = ref(false);
async function getDevice() {
  try {
    isLoadingDevice.value = true;
    device.value = await deviceService.getDevice(route.params.id.toString());
  } catch (error) {
    console.log(error);
    toast.error('Loading device failed!');
  } finally {
    isLoadingDevice.value = false;
  }
}
getDevice();
</script>

<style lang="scss" scoped></style>
