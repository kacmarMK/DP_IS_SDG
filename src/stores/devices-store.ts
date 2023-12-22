import { defineStore } from 'pinia';
import { Device } from 'src/models/Device';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import deviceService from 'src/services/DeviceService';
import { handleError } from '@/utils/error-handler';

export const useDevicesStore = defineStore('devices', () => {
  //Devices
  const devices = ref<Device[]>([]);
  const isLoadingDevices = ref(false);
  async function getDevices() {
    try {
      isLoadingDevices.value = true;
      devices.value = await deviceService.getDevices();
    } catch (error) {
      handleError(error, 'Loading devices failed!');
    } finally {
      isLoadingDevices.value = false;
    }
  }

  //Delete device dialog
  const deleteDialog = ref(false);
  const deleteInProgress = ref(false);
  const deletingDevice = ref<Device>();
  async function deleteDevice() {
    const deletingDeviceId = deletingDevice.value?.uid;
    if (!deletingDeviceId) {
      return;
    }

    try {
      deleteInProgress.value = true;
      await deviceService.deleteDevice(deletingDeviceId);
      toast.success('Device deleted!');
      getDevices();
      deleteDialog.value = false;
    } catch (error) {
      handleError(error, 'Deleting device failed!');
    } finally {
      deleteInProgress.value = false;
    }
  }

  // Device info
  const device = ref<Device | null>(null);
  const isLoadingDevice = ref(false);
  const isRefreshingDevice = ref(false);
  async function getDevice(uid: string) {
    try {
      isLoadingDevice.value = true;
      if (device.value?.uid != uid) {
        device.value = null;
      }
      device.value = await deviceService.getDevice(uid);
    } catch (error) {
      handleError(error, 'Loading device failed!');
    } finally {
      isLoadingDevice.value = false;
    }
  }
  async function refreshDevice() {
    try {
      if (!device.value) {
        return;
      }
      isRefreshingDevice.value = true;
      device.value = await deviceService.getDevice(device.value.uid);
    } catch (error) {
      handleError(error, 'Refreshing device failed!');
    } finally {
      isRefreshingDevice.value = false;
    }
  }

  return {
    devices,
    isLoadingDevices,
    getDevices,
    deleteDialog,
    deleteInProgress,
    deletingDevice,
    deleteDevice,
    device,
    isLoadingDevice,
    getDevice,
    refreshDevice,
    isRefreshingDevice,
  };
});
