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
          @click="store.createDialog = true"
        />
      </div>
      <q-table
        :rows="store.devices"
        :columns="columns"
        :loading="store.isLoadingDevices"
        flat
        :rows-per-page-options="[10, 20, 50]"
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

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <router-link
              :to="`/devices/${props.row.uid}`"
              class="text-primary text-weight-medium"
            >
              {{ props.row.name }}
            </router-link>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              icon="mdi-open-in-app"
              color="grey-color"
              flat
              round
              :to="`/devices/${props.row.uid}`"
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Open
              </q-tooltip></q-btn
            >
            <q-btn icon="mdi-pencil" color="grey-color" flat round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Edit
              </q-tooltip></q-btn
            >
            <q-btn
              @click.stop="
                store.deleteDialog = true;
                store.deletingDevice = props.row;
              "
              icon="mdi-trash-can-outline"
              color="grey-color"
              flat
              round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Delete
              </q-tooltip></q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>
    <create-device-dialog />
    <delete-device-dialog />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps } from 'quasar';
import { useDevicesStore } from '../stores/devices-store';
import CreateDeviceDialog from '../components/CreateDeviceDialog.vue';
import DeleteDeviceDialog from '../components/DeleteDeviceDialog.vue';

const store = useDevicesStore();
store.getDevices();

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'mac',
    label: 'Mac Address',
    field: 'mac',
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
</script>

<style lang="scss" scoped></style>
