<template>
  <PageLayout :title="t('scenario.label', 2)">
    <template #actions>
      <q-btn
        class="shadow"
        color="primary"
        :icon="mdiPlus"
        :label="t('scenario.create_scenario')"
        unelevated
        no-caps
        size="15px"
        to="/scenarios/create"
      />
    </template>
    <template #default>
      <q-table
        :rows="store.scenarios"
        :columns="columns"
        :loading="store.isLoadingScenarios"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        :no-data-label="t('table.no_data_label')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
      >
        <template #top>
          <div class="q-mx-auto">
            <q-btn-toggle
              v-model="selectedOption"
              push
              glossy
              spread
              toggle-color="primary"
              :options="translatedOptions"
              style="width: 300px"
              @click="handleToggleClick"
            />
          </div>
        </template>
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon :name="mdiBookMultipleOutline" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn :icon="mdiOpenInNew" color="grey-color" flat round :to="`/scenarios/${props.row.id}`"
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.details') }}
              </q-tooltip>
            </q-btn>

            <q-btn :icon="mdiPowerSleep" color="grey-color" flat round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]"> Mute </q-tooltip>
            </q-btn>
            <q-btn :icon="mdiPower" color="grey-color" flat round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]"> Deactivate </q-tooltip>
            </q-btn>
            <q-btn
              :icon="mdiTrashCanOutline"
              color="grey-color"
              flat
              round
              @click.stop="
                isDeleteDialogOpened = true;
                deletedScenario = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.delete') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>
  </PageLayout>
  <DeleteScenarioDialog
    v-if="deletedScenario"
    v-model="isDeleteDialogOpened"
    :scenario="deletedScenario"
    @on-delete="handleToggleClick"
  />
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { QTableProps } from 'quasar';
import { useScenarioStore } from '@/stores/scenario-store';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Scenario } from '@/models/Scenario';
import DeleteScenarioDialog from '@/components/scenarios/DeleteScenarioDialog.vue';
import {
  mdiOpenInNew,
  mdiPlus,
  mdiBookMultipleOutline,
  mdiPencil,
  mdiTrashCanOutline,
  mdiPowerSleep,
  mdiPower,
} from '@quasar/extras/mdi-v6';

const { t } = useI18n();
const store = useScenarioStore();
store.getScenarios();

const translatedOptions = computed(() => [
  { value: 'all', label: t('scenario.scenario_type_options.option1') },
  { value: 'active', label: t('scenario.scenario_type_options.option2') },
]);

const isDeleteDialogOpened = ref(false);
const selectedOption = ref('all');
const deletedScenario = ref<Scenario>();

async function handleToggleClick() {
  if (selectedOption.value == 'all') {
    await store.getScenarios();
  } else {
    await store.getActiveScenarios();
  }
}

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
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
]);
</script>
<style lang="scss" scoped></style>
