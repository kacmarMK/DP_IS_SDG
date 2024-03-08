<template>
  <div class="row q-col-gutter-xl">
    <div class="col-12 col-md-6">
      <div class="table-name text-secondary">{{ t('recipe.recipe_steps') }}</div>
      <VueDraggable v-model="localSubCommands" :animation="200" handle=".handle" draggable="tr" target="tbody">
        <q-table
          :rows="localSubCommands"
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

          <template #body-cell-step="propsStep">
            <q-td :props="propsStep">
              <div v-if="!propsStep.row.value.recipe">{{ propsStep.row.value.name }}</div>
              <div v-else>
                <q-tree :nodes="getCommandNodes(propsStep.row.value)" node-key="id" :dense="true">
                  <template #default-header="treeProp">
                    <span>{{ treeProp.node.label }}</span>
                    <template v-if="treeProp.node.cycles > 1">
                      <span class="text-grey-8">&nbsp;({{ treeProp.node.cycles }}x)</span>
                    </template>
                  </template>
                </q-tree>
              </div>
            </q-td>
          </template>

          <template #body-cell-cycles="propsCycles">
            <q-td auto-width :props="propsCycles">
              <div>
                <q-input
                  v-model="propsCycles.row.cycles"
                  dense
                  outlined
                  type="number"
                  :min="1"
                  style="min-width: 65px"
                />
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
      <div class="table-name text-secondary">
        {{ t('recipe.available_steps') }}
      </div>

      <q-table
        :rows="filteredCommands"
        :columns="availableCommandsColumns"
        :loading="commandStore.commands.isLoading"
        flat
        hide-header
        :no-data-label="t('recipe.no_commands_for_device_type')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
        :rows-per-page-options="[20, 50, 100, 0]"
        class="shadow"
      >
        <template #top>
          <div class="col-12 q-table__title">
            <q-tabs
              v-model="selectedStepType"
              inline-label
              no-caps
              align="justify"
              indicator-color="primary"
              active-color="primary"
              class="text-secondary bottom-outline"
            >
              <q-tab name="commands" class="outline-bottom-grey" :icon="mdiCodeTags" label="Commands" />
              <q-tab name="subrecipes" class="outline-bottom-grey" :icon="mdiBookMultipleOutline" label="Subrecipes" />
            </q-tabs>
          </div>
        </template>
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

        <template #body-cell-name="propsName">
          <q-td :props="propsName">
            <div v-if="!propsName.row.recipe">{{ propsName.row.name }}</div>
            <div v-else>
              <q-tree :nodes="getCommandNodes(propsName.row)" node-key="id" :dense="true" />
            </div>
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
import { mdiPlus, mdiClose, mdiDrag, mdiCodeTags, mdiBookMultipleOutline } from '@quasar/extras/mdi-v6';
import { VueDraggable } from 'vue-draggable-plus';
import { useCommandStore } from '@/stores/command-store';

const recipe = defineModel<Command>({ required: true });
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
const localSubCommands = ref(getSubCommandsWithCycles(recipe.value.subCommands));

function getSubCommandsWithCycles(commands: Command[] | undefined): { id: number; value: Command; cycles: number }[] {
  if (!commands) return [];

  const groupedCommands: { id: number; value: Command; cycles: number }[] = [];

  commands.forEach((command, index) => {
    const lastGroupedCommand = groupedCommands[groupedCommands.length - 1];
    if (lastGroupedCommand && lastGroupedCommand.value.id === command.id) {
      lastGroupedCommand.cycles += 1;
    } else {
      groupedCommands.push({
        id: index,
        value: command,
        cycles: 1,
      });
    }
  });

  return groupedCommands;
}

const filteredCommands = computed<Command[]>(() => {
  const { deviceType, id: mainCommandId } = recipe.value;
  const showRecipes = selectedStepType.value === 'subrecipes';

  return (
    commandStore.commands.data?.filter((command) => {
      const isDeviceTypeMatch = !deviceType || command.deviceType === deviceType;
      const isRecipeMatch = showRecipes ? command.recipe === true : command.recipe === false;
      const isNotMainCommand = command.id !== mainCommandId;
      return isDeviceTypeMatch && isRecipeMatch && isNotMainCommand;
    }) ?? []
  );
});

function addCommandToRecipe(command: Command) {
  const uniqueId = Date.now() + Math.random();
  localSubCommands.value.push({
    id: uniqueId,
    value: command,
    cycles: 1,
  });
}

function removeCommandFromRecipe(index: number) {
  localSubCommands.value.splice(index, 1);
}

watch(
  localSubCommands,
  (newLocalCommands) => {
    recipe.value.subCommands = newLocalCommands.flatMap((commandWithCycles) =>
      Array.from({ length: commandWithCycles.cycles }, () => ({ ...commandWithCycles.value })),
    );
  },
  { deep: true },
);

// Command nodes
interface CommandNode {
  id: string;
  label: string;
  cycles: number;
  children?: CommandNode[];
}

function getCommandNodes(command: Command): CommandNode[] {
  if (!command) {
    return [];
  }

  function groupSubCommands(subCommands: Command[]): CommandNode[] {
    if (!subCommands) return [];

    const groupedNodes: CommandNode[] = [];

    subCommands.forEach((subCommand) => {
      const lastNode = groupedNodes[groupedNodes.length - 1];
      if (lastNode && lastNode.id === subCommand.id) {
        lastNode.cycles += 1;
      } else {
        groupedNodes.push({
          id: subCommand.id,
          label: subCommand.name,
          cycles: 1,
          children: groupSubCommands(subCommand.subCommands ?? []),
        });
      }
    });

    return groupedNodes;
  }

  const rootNode: CommandNode = {
    id: command.id,
    label: command.name,
    cycles: 1,
    children: groupSubCommands(command.subCommands ?? []),
  };

  return [rootNode];
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
    name: 'step',
    label: t('job.step'),
    field: (row) => row.value.name,
    sortable: false,
    align: 'left',
  },
  {
    name: 'cycles',
    label: t('job.cycle', 2),
    field: '',
    sortable: false,
    align: 'center',
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

<style lang="scss">
.table-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.drag-icon {
  cursor: move;
}

.q-table__top {
  padding: 0 !important;
}

.bottom-outline {
  border-bottom: 1px solid #e0e0e0;
}
</style>
