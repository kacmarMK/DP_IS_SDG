<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Commands</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="secondary"
          label="Create new command"
          unelevated
          no-caps
          size="15px"
          @click="store.createDialog = true"
        />
      </div>
      <q-table
        :rows="store.commands"
        :columns="columns"
        :loading="store.isLoadingCommands"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        no-data-label="No Commands Found"
        loading-label="Loading Commands..."
        rows-per-page-label="Commands per page"
      >
        <template v-slot:no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="data_object" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
      </q-table>
    </div>
    <create-command-dialog />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useCommandsStore } from '../stores/commands-store';
import CreateCommandDialog from '../components/CreateCommandDialog.vue';

const store = useCommandsStore();
store.getCommands();

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
    name: 'deactivated',
    label: 'Command Deactivated?',
    field: 'deactivated',
    sortable: true,
    align: 'left',
  },
];
</script>
<style lang="scss" scoped></style>
