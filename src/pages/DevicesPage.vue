<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Devices</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="primary"
          unelevated
          no-caps
          size="15px"
          label="Create Device"
          @click="createDialog = true"
        />
      </div>
      <q-table
        :rows="devices"
        :columns="columns"
        :loading="isLoadingDevices"
        flat
        class="shadow"
        no-data-label="No Devices Yet"
        loading-label="Loading Devices..."
      >
        <template v-slot:no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="devices" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn icon="mdi-pencil" color="grey-color" flat round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Edit
              </q-tooltip></q-btn
            >
            <q-btn icon="mdi-trash-can-outline" color="grey-color" flat round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Delete
              </q-tooltip></q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="createDialog">
      <q-card style="min-width: 350px" class="q-pa-">
        <q-card-section>
          <div class="text-h6">Create new device</div>
        </q-card-section>

        <q-card-section class="q-pt-none column q-gutter-md">
          <q-input label="Name" v-model="deviceCreate.name" />
          <q-input label="Mac" v-model="deviceCreate.mac" />
          <q-select
            label="Type"
            v-model="deviceCreate.type"
            :options="Object.values(DeviceTypeEnum)"
          >
          </q-select>
          <q-input label="Version" v-model="deviceCreate.version" />
          <q-input label="Firmware" v-model="deviceCreate.firmware" />
          <q-input label="Init Api Key" v-model="deviceCreate.initApiKey" />
          <q-checkbox
            class="q-mt-lg"
            v-model="deviceCreate.deactivated"
            dense
            label="Deactivated"
            color="primary"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup no-caps />
          <q-btn
            unelevated
            color="primary"
            label="Create device"
            no-caps
            @click="createDevice"
            :loading="isCreatingDevice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DeviceCreate, Device } from '../models/Device';
import DeviceTypeEnum from 'src/models/DeviceType';
import { toast } from 'vue3-toastify';
import deviceService from 'src/services/DeviceService';
import { QTableProps } from 'quasar';

// Get devices
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
const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    sortable: true,
    align: 'left',
  },
  {
    name: 'version',
    label: 'Version',
    field: 'version',
    sortable: true,
    align: 'left',
  },
  {
    name: 'firmware',
    label: 'Firmware',
    field: 'firmware',
    sortable: true,
    align: 'left',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
];

getDevices();

//Create device
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
</script>

<style lang="scss" scoped></style>
