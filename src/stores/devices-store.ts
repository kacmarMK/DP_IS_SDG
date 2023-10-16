import { defineStore } from 'pinia';
import { Device, DeviceCreate } from 'src/models/Device';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import deviceService from 'src/services/DeviceService';

export const useDevicesStore = defineStore('devices', () => {
  //Devices
  const devices = ref<Device[]>([]);
  const isLoadingDevices = ref(false);
  async function getDevices() {
    try {
      isLoadingDevices.value = true;
      devices.value = await deviceService.getDevices();
    } catch (error) {
      console.log(error);
      toast.error('Loading devices failed!');
    } finally {
      isLoadingDevices.value = false;
    }
  }

  //Create device dialog
  const createDialog = ref(false);
  const deviceCreate = ref<DeviceCreate>({
    name: '',
    mac: '',
    type: undefined,
    version: '',
    firmware: '',
    initApiKey: '',
    deactivated: false,
  });
  const isCreatingDevice = ref(false);
  async function createDevice() {
    try {
      isCreatingDevice.value = true;
      await deviceService.createDevice(deviceCreate.value);
      toast.success('Device created!');
      getDevices();
      createDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Creating device failed!');
    } finally {
      isCreatingDevice.value = false;
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
      console.log(error);
      toast.error('Deleting device failed!');
    } finally {
      deleteInProgress.value = false;
    }
  }

  // Device info
  const device = ref<Device | null>(null);
  const isLoadingDevice = ref(false);
  async function getDevice(uid: string) {
    try {
      isLoadingDevice.value = true;
      if (device.value?.uid != uid) {
        device.value = null;
      }

      device.value = await deviceService.getDevice(uid); // route.params.id.toString()
    } catch (error) {
      console.log(error);
      toast.error('Loading device failed!');
    } finally {
      isLoadingDevice.value = false;
    }
  }

  return {
    devices,
    isLoadingDevices,
    getDevices,
    createDialog,
    deviceCreate,
    isCreatingDevice,
    createDevice,
    deleteDialog,
    deleteInProgress,
    deletingDevice,
    deleteDevice,
    device,
    isLoadingDevice,
    getDevice,
  };
});
