<template>
  <div>
    <q-table
      :rows="devices"
      :columns="columns"
      flat
      :rows-per-page-options="[10, 20, 50]"
      no-data-label="No Devices Yet"
      loading-label="Loading Devices..."
      rows-per-page-label="Devices per page"
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
            class="text-black text-weight-regular"
          >
            {{ props.row.name }}
          </router-link>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td auto-width :props="props">
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
    <DeleteDeviceDialog
      v-if="deviceToDelete"
      v-model="deleteDialog"
      :device="deviceToDelete"
      @on-deleted="deviceDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import DeleteDeviceDialog from '@/components/devices/DeleteDeviceDialog.vue';
import { PropType, computed, ref } from 'vue';
import { Device } from '@/models/Device';

const props = defineProps({
  modelValue: {
    type: Array as PropType<Device[]>,
    required: true,
  },
  moduleUid: {
    type: String as PropType<string>,
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

<style lang="scss" scoped></style>
