<template>
  <div>
    <q-card class="q-pa-lg shadow">
      <div class="row items-center q-col-gutter-lg">
        <q-input v-model="recipe.name" :label="t('global.name')" class="col-12 col-md-5 col-lg-4" />
        <q-select
          ref="typeRef"
          v-model="recipe.deviceType"
          class="col-12 col-md-4 col-lg-3"
          :label="t('device.device_type')"
          :options="Object.values(DeviceTypeEnum)"
        />
        <q-checkbox v-model="recipe.subRecipe" dense label="Subrecipe" class="col-auto" />
      </div>
    </q-card>
    <div class="q-mt-auto row q-col-gutter-xl">
      <div class="col-12 col-md-6">
        <div class="table-name text-secondary">Recipe Steps</div>
        <VueDraggable v-model="localRecipeCommands" :animation="200" handle=".handle" draggable="tr" target="tbody">
          <q-table
            :rows="localRecipeCommands"
            :columns="stepColumns"
            flat
            :no-data-label="`No commands added to this recipe`"
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

            <template #body-cell-step="propsStep">
              <q-td auto-width :props="propsStep">
                <div>{{ propsStep.rowIndex + 1 }}</div>
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
                    @click="removeCommandFromRecipe(propsRemove.rowIndex)"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </VueDraggable>
      </div>
      <div class="col-12 col-md-6">
        <div class="table-name text-secondary">Available Commands</div>
        <q-table
          :rows="filteredCommands"
          :columns="availableCommandsColumns"
          :loading="commands.isLoading"
          flat
          :no-data-label="`No commands available for this device type`"
          :loading-label="t('table.loading_label')"
          :rows-per-page-label="t('table.rows_per_page_label')"
          :rows-per-page-options="[20, 50, 100, 0]"
          class="shadow"
        >
          <template #body-cell-actions="propsActions">
            <q-td auto-width :props="propsActions">
              <div>
                <q-btn dense :icon="mdiPlus" color="primary" flat round @click="addCommandToRecipe(propsActions.row)" />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecipeInput, getEmptyRecipeInput } from '@/models/Recipe';
import { QTableProps } from 'quasar';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DeviceTypeEnum from '@/models/DeviceType';
import { Command } from '@/models/Command';
import CommandService from '@/services/CommandService';
import { mdiPlus, mdiClose, mdiDrag } from '@quasar/extras/mdi-v6';
import { VueDraggable } from 'vue-draggable-plus';
import { useAsyncData } from '@/composables/useAsyncData';

const recipe = defineModel<RecipeInput>({ required: true, default: getEmptyRecipeInput() });

const { t } = useI18n();

const localRecipeCommands = ref(recipe.value.commands?.map((c, index) => ({ id: index, value: c })) ?? []);

const commands = reactive(
  useAsyncData(() => CommandService.getCommands('NONE', 'NONE'), t('command.toasts.load_failed')),
);

const filteredCommands = computed<Command[]>(() => {
  return (
    commands.data?.filter((command) => {
      if (!recipe.value.deviceType) {
        return true;
      }
      return command.deviceType === recipe.value.deviceType;
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

const stepColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'drag',
    label: '',
    field: '',
    sortable: false,
    align: 'center',
  },
  {
    name: 'command',
    label: t('command.label'),
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
  {
    name: 'parameters',
    label: t('command.parameters'),
    field: 'params',
    sortable: false,
    align: 'left',
    format: (val: string[]) => val?.join(', '),
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

.shrink-width {
  width: 0rem;
}

.drag-th {
  width: 60px;
}
</style>
