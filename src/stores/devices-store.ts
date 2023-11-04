import { defineStore } from 'pinia';
import { Device } from 'src/models/Device';
import { computed, ref } from 'vue';
import { toast } from 'vue3-toastify';
import deviceService from 'src/services/DeviceService';
import { format, subSeconds } from 'date-fns';

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
  const isRefreshingDevice = ref(false);
  async function getDevice(uid: string) {
    try {
      isLoadingDevice.value = true;
      if (device.value?.uid != uid) {
        device.value = null;
      }
      device.value = await deviceService.getDevice(uid);
    } catch (error) {
      console.log(error);
      toast.error('Loading device failed!');
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
      refreshKey.value++;
    } catch (error) {
      console.log(error);
      toast.error('Refreshing device failed!');
    } finally {
      isRefreshingDevice.value = false;
    }
  }
  const timeRanges = ref([
    {
      title: 'Last 10 Minutes',
      name: '10m',
      time: 600,
    },
    {
      title: 'Last 1 Hour',
      name: '1h',
      time: 3600,
    },
    {
      title: 'Last 6 Hours',
      name: '6h',
      time: 21600,
    },
    {
      title: 'Last 12 Hours',
      name: '12h',
      time: 43200,
    },
  ]);
  const selectedTimeRange = ref(timeRanges.value[1]);
  const customTimeRangeSelected = ref({
    from: new Date(),
    to: new Date(),
  });
  const isCustomTimeRangeSelected = ref(false);
  const refreshKey = ref(0);
  const timeRangeComputed = computed(() => {
    refreshKey.value;
    if (isCustomTimeRangeSelected.value) {
      return {
        from: format(
          new Date(customTimeRangeSelected.value.from),
          'yyyy-MM-dd HH:mm:ss'
        ),
        to: format(
          new Date(customTimeRangeSelected.value.to),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
    } else {
      return {
        from: format(
          subSeconds(new Date(), selectedTimeRange.value.time),
          'yyyy-MM-dd HH:mm:ss'
        ),
        to: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      };
    }
  });

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
    timeRanges,
    selectedTimeRange,
    customTimeRangeSelected,
    timeRangeComputed,
    isCustomTimeRangeSelected,
  };
});
