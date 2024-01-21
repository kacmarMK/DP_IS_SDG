import { defineStore } from 'pinia';
import { Device } from 'src/models/Device';
import { ref } from 'vue';
import deviceService from 'src/services/DeviceService';
import { handleError } from '@/utils/error-handler';
import { useI18n } from 'vue-i18n';

export const useDevicesStore = defineStore('devices', () => {
  const { t } = useI18n();
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
      handleError(error, t('device.toasts.loading_failed', 2));
    } finally {
      isLoadingDevices.value = false;
    }
  }

  return {
    devices,
    isLoadingDevices,
    getDevices,
  };
});
