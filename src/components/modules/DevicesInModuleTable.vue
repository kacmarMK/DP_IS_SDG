<template>
  <div>
    <div class="q-mb-md row">
      <p class="devices-text">Devices</p>
      <q-space></q-space>
      <q-btn
        class="shadow bg-white"
        color="primary"
        unelevated
        outline
        no-caps
        size="15px"
        label="Add device"
        icon="mdi-plus"
        @click="addDeviceDialog = true"
      />
    </div>
    <q-table
      :rows="devices"
      :columns="columns"
      flat
      hide-pagination
      no-data-label="No Devices Yet"
      loading-label="Loading Devices..."
      class="outline shadow"
    >
      <template v-slot:no-data="{ message }">
        <div class="full-width column flex-center q-pa-lg nothing-found-text">
          <q-icon name="devices" class="q-mb-md" size="50px"></q-icon>
          {{ message }}
        </div>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props" no-hover>
          {{ props.row[props.col.field] }}
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props" no-hover>
          <router-link
            :to="`/devices/${props.row.uid}`"
            class="text-black text-weight-regular"
          >
            {{ props.row.name }}
          </router-link>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td auto-width :props="props" no-hover>
          <q-btn
            icon="mdi-open-in-new"
            color="grey-color"
            flat
            round
            :to="`/devices/${props.row.uid}`"
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              Open
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="mdi-pencil"
            color="grey-color"
            flat
            round
            :to="`/devices/${props.row.uid}/edit`"
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              Edit
            </q-tooltip>
          </q-btn>
          <q-btn
            @click.stop="
              deleteDialog = true;
              deviceToDelete = props.row;
            "
            icon="mdi-trash-can-outline"
            color="grey-color"
            flat
            round
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              Delete
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <RemoveDeviceModuleDialog
      v-if="deviceToDelete"
      v-model="deleteDialog"
      :device="deviceToDelete"
      :module="module"
      @on-deleted="deviceDeleted"
    />
    <AddDeviceToModuleDialog
      v-model="addDeviceDialog"
      :module="module"
      :alreadyAddedDevices="devices"
      @on-added="emit('onChange', devices)"
    />
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import RemoveDeviceModuleDialog from './RemoveDeviceModuleDialog.vue';
import AddDeviceToModuleDialog from './AddDeviceToModuleDialog.vue';
import { PropType, computed, ref } from 'vue';
import { Device } from '@/models/Device';
import { Module } from '@/models/Module';

const props = defineProps({
  modelValue: {
    type: Array as PropType<Device[]>,
    required: true,
  },
  module: {
    type: Object as PropType<Module>,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'onChange']);

const devices = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const deleteDialog = ref(false);
const deviceToDelete = ref<Device>();
function deviceDeleted() {
  devices.value = devices.value.filter(
    (device) => device.uid !== deviceToDelete.value?.uid,
  );
  emit('onChange', devices.value);
}

const addDeviceDialog = ref(false);

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
</script>

<style lang="scss" scoped>
.devices-text {
  font-size: 1.4em;
  font-weight: 600;
  margin: 0;
  padding: 0;
  color: $secondary;
}
</style>
