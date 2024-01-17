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
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="data_object" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              icon="mdi-pencil"
              color="grey-color"
              flat
              round
              @click.stop="
                store.editDialog = true;
                store.editedCommand = props.row;
                store.editCommandId = props.row.value?.id;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="mdi-trash-can-outline"
              color="grey-color"
              flat
              round
              @click.stop="
                store.deleteDialog = true;
                store.deletingCommand = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <create-command-dialog />
    <edit-command-dialog />
    <delete-command-dialog />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useCommandsStore } from '@/stores/commands-store';
import CreateCommandDialog from '@/components/commands/CreateCommandDialog.vue';
import EditCommandDialog from '@/components/commands/EditCommandDialog.vue';
import DeleteCommandDialog from '@/components/commands/DeleteCommandDialog.vue';

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
    name: 'deviceType',
    label: 'Device',
    field: 'deviceType',
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
