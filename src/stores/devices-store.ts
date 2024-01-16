import { defineStore } from 'pinia';
import { Device } from 'src/models/Device';
import { ref } from 'vue';
import deviceService from 'src/services/DeviceService';
import { handleError } from '@/utils/error-handler';

export const useDevicesStore = defineStore('devices', () => {
  //Devices
  const devices = ref<Device[]>([]);
  const isLoadingDevices = ref(false);
  async function getDevices() {
    try {
      isLoadingDevices.value = true;
      const [ownedDevices, sharedDevices] = await Promise.all([
        deviceService.getDevices(),
        deviceService.getSharedDevices(),
      ]);
      devices.value = [...ownedDevices, ...sharedDevices];
    } catch (error) {
      handleError(error, 'Loading devices failed!');
    } finally {
      isLoadingDevices.value = false;
    }
  }

  // Device info

  return {
    devices,
    isLoadingDevices,
    getDevices,
  };
});
