<template>
  <q-btn-toggle
    v-model="selectedStepType"
    spread
    class="shadow custom-toggle q-my-lg"
    no-caps
    rounded
    unelevated
    toggle-color="primary"
    color="white"
    text-color="primary"
    :options="[
      { label: t('command.label', 2), value: 'commands' },
      { label: t('recipe.subrecipe', 2), value: 'subrecipes' },
    ]"
  />
  <div class="row q-col-gutter-xl">
    <div class="col-12 col-md-6">
      <div class="table-name text-secondary">{{ t('recipe.recipe_steps') }}</div>
      <VueDraggable v-model="localRecipeCommands" :animation="200" handle=".handle" draggable="tr" target="tbody">
        <q-table
          :rows="localRecipeCommands"
          :columns="stepColumns"
          flat
          :no-data-label="t('recipe.no_commands_added')"
          :loading-label="t('table.loading_label')"
          :rows-per-page-label="t('table.rows_per_page_label')"
          :rows-per-page-options="[0, 20, 50, 100]"
          hide-pagination
          class="shadow"
        >
          <template #header-cell-drag="propsDrag">
            <q-th auto-width :props="propsDrag" class="drag-th" />
          </template>

          <template #body-cell-drag="propsDrag">
            <q-td auto-width :props="propsDrag">
              <div>
                <q-icon :name="mdiDrag" size="28px" class="handle drag-icon" />
              </div>
            </q-td>
          </template>

          <template #body-cell-remove="propsRemove">
            <q-td auto-width :props="propsRemove">
              <div>
                <q-btn
                  dense
                  :icon="mdiClose"
                  color="red"
                  flat
                  round
                  :disable="props.loading"
                  @click="removeCommandFromRecipe(propsRemove.rowIndex)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </VueDraggable>
    </div>
    <div class="col-12 col-md-6">
      <div v-if="selectedStepType == 'commands'" class="table-name text-secondary">
        {{ t('recipe.available_commands') }}
      </div>

      <div v-if="selectedStepType == 'subrecipes'" class="table-name text-secondary">
        {{ t('recipe.available_subrecipes') }}
      </div>

      <q-table
        :rows="filteredCommands"
        :columns="availableCommandsColumns"
        :loading="commandStore.commands.isLoading"
        flat
        :no-data-label="t('recipe.no_commands_for_device_type')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
        :rows-per-page-options="[20, 50, 100, 0]"
        class="shadow"
      >
        <template #body-cell-actions="propsActions">
          <q-td auto-width :props="propsActions">
            <q-btn
              :disable="props.loading"
              dense
              :icon="mdiPlus"
              color="primary"
              flat
              round
              @click="addCommandToRecipe(propsActions.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Command } from '@/models/Command';
import { mdiPlus, mdiClose, mdiDrag } from '@quasar/extras/mdi-v6';
import { VueDraggable } from 'vue-draggable-plus';
import { useCommandStore } from '@/stores/command-store';

const command = defineModel<Command>({ required: true });
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const commandStore = useCommandStore();
commandStore.commands.refresh();

const selectedStepType = ref('commands');
const localRecipeCommands = ref(command.value.subCommands?.map((c, index) => ({ id: index, value: c })) ?? []);

const filteredCommands = computed<Command[]>(() => {
  const { deviceType, id: mainCommandId } = command.value; // Destructure to get the main command's id
  const showRecipes = selectedStepType.value === 'subrecipes';

  return (
    commandStore.commands.data?.filter((command) => {
      const isDeviceTypeMatch = !deviceType || command.deviceType === deviceType;
      const isRecipeMatch = showRecipes ? command.recipe === true : command.recipe === false;
      const isNotMainCommand = command.id !== mainCommandId; // Check if it's not the main command
      return isDeviceTypeMatch && isRecipeMatch && isNotMainCommand; // Include this condition in return
    }) ?? []
  );
});

function addCommandToRecipe(command: Command) {
  const uniqueId = Date.now() + Math.random();
  localRecipeCommands.value.push({ id: uniqueId, value: command });
}

function removeCommandFromRecipe(index: number) {
  localRecipeCommands.value.splice(index, 1);
}

watch(
  localRecipeCommands,
  (newLocalCommands) => {
    command.value.subCommands = newLocalCommands.map((item) => item.value);
  },
  { deep: true },
);

const stepColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'drag',
    label: '',
    field: '',
    sortable: false,
    align: 'center',
  },
  {
    name: 'step',
    label: t('job.step'),
    field: (row) => row.value.name,
    sortable: false,
    align: 'left',
  },
  {
    name: 'remove',
    label: '',
    field: '',
    sortable: false,
    align: 'center',
  },
]);

const availableCommandsColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
]);
</script>

<style lang="scss" scoped>
.table-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.drag-icon {
  cursor: move;
}

.custom-toggle {
  border: 1px solid var(--q-primary);
}
</style>
