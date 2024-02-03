<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">{{ t('command.label', 2) }}</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="primary"
          :icon="mdiPlus"
          :label="t('command.create_command')"
          unelevated
          no-caps
          size="15px"
          @click="createDialogOpen = true"
        />
      </div>
      <q-table
        :rows="store.commands"
        :columns="columns"
        :loading="store.isLoadingCommands"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        :no-data-label="t('table.no_data_label')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
      >
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon :name="mdiCodeTags" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              :icon="mdiPencil"
              color="grey-color"
              flat
              round
              @click.stop="
                editDialogOpen = true;
                commandToEdit = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.edit') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              :icon="mdiTrashCanOutline"
              color="grey-color"
              flat
              round
              @click.stop="
                deleteDialogOpen = true;
                commandToDelete = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.delete') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <create-command-dialog v-model="createDialogOpen" @on-create="store.getCommands" />
      <edit-command-dialog
        v-if="commandToEdit"
        v-model="editDialogOpen"
        :command="commandToEdit"
        @on-update="store.getCommands"
      />
      <delete-command-dialog
        v-if="commandToDelete"
        v-model="deleteDialogOpen"
        :command="commandToDelete"
        @on-deleted="store.getCommands"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useCommandsStore } from '@/stores/commands-store';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiCodeTags, mdiPencil, mdiTrashCanOutline } from '@quasar/extras/mdi-v6';
import { Command } from '@/models/Command';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import CreateCommandDialog from '@/components/commands/CreateCommandDialog.vue';
import EditCommandDialog from '@/components/commands/EditCommandDialog.vue';
import DeleteCommandDialog from '@/components/commands/DeleteCommandDialog.vue';

const { t } = useI18n();
const store = useCommandsStore();
store.getCommands();

const createDialogOpen = ref(false);

const deleteDialogOpen = ref(false);
const commandToDelete = ref<Command>();

const editDialogOpen = ref(false);
const commandToEdit = ref<Command>();

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'deviceType',
    label: t('device.label'),
    field: 'deviceType',
    sortable: true,
    align: 'left',
  },
  {
    name: 'parameters',
    label: t('command.parameters'),
    field: 'params',
    sortable: false,
    align: 'left',
    format: (val: string[]) => val?.join(', '),
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
]);
</script>
<style lang="scss" scoped></style>
