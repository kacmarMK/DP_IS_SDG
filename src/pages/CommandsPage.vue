<template>
  <div class="q-pa-md">
    <q-table flat bordered title="Commands" :columns="columns" row-key="id">
      <!--<template v-slot:top>
        <q-space />
        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>-->
    </q-table>
  </div>
</template>

<script setup lang="ts">
//import { ref } from 'vue';
import { QTableProps } from 'quasar';
import { useCommandsStore } from '../stores/commands-store';

const store = useCommandsStore();
//store.getCommands();

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'params',
    label: 'Parameters',
    field: 'params',
    sortable: false,
    align: 'left',
  },
  {
    name: 'deviceType',
    label: 'Device Type',
    field: 'deviceType',
    sortable: true,
    align: 'left',
  },
  {
    name: 'createdAt',
    label: 'Creation date',
    field: 'createdAt',
    sortable: true,
    align: 'left',
  },
  {
    name: 'deactivated',
    label: 'Command Deactivated',
    field: 'deactivated',
    sortable: true,
    align: 'left',
  },
];
</script>
<style lang="scss" scoped></style>
