<template>
  <PageLayout :title="t('notification.label', 2)">
    <template #default>
      <div class="q-pa-md row justify-center">
        <q-table
          :rows="store.scenarios"
          :columns="scenarioColumns"
          :loading="store.isLoadingScenarios"
          flat
          bordered
          :rows-per-page-options="[10, 20, 50]"
          class="shadow"
          :no-data-label="t('table.no_data_label')"
          :loading-label="t('table.loading_label')"
          :rows-per-page-label="t('table.rows_per_page_label')"
          style="border-color: black; min-width: 1200px"
          separator="vertical"
          color="primary"
          card-class="bg-indigo-1 text-black"
          table-class="text-grey-8"
          table-header-class="text-black"
        >
        </q-table>
        <div class="q-gutter-md row justify-center">
          <q-btn
            full-width
            style="color: black; min-width: 1200px"
            outline
            label="Zobraziť akceptované notifikácie"
            :icon="clicked ? mdiArrowDownCircleOutline : mdiArrowUpCircleOutline"
            :icon-right="clicked ? mdiArrowDownCircleOutline : mdiArrowUpCircleOutline"
            @click="clicked ? (clicked = false) : (clicked = true)"
          />
        </div>
        <q-table
          v-if="clicked"
          :rows="store.scenarios"
          :columns="storedResolvedScenarioColumns"
          :loading="store.isLoadingScenarios"
          flat
          bordered
          :rows-per-page-options="[10, 20, 50]"
          class="shadow"
          :no-data-label="t('table.no_data_label')"
          :loading-label="t('table.loading_label')"
          :rows-per-page-label="t('table.rows_per_page_label')"
          style="border-color: black; min-width: 1200px"
          separator="vertical"
          color="primary"
          card-class="bg-green-1 text-black"
          table-class="text-grey-8"
          table-header-class="text-black"
        >
        </q-table>
      </div>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { QTableProps } from 'quasar';
import { useScenarioStore } from '@/stores/scenario-store';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Scenario } from '@/models/Scenario';
import DeleteScenarioDialog from '@/components/scenarios/DeleteScenarioDialog.vue';
import MuteScenarioDialog from '@/components/scenarios/MuteScenarioDialog.vue';
import ActivityScenarioDialog from '@/components/scenarios/ActivityScenarioDialog.vue';
import { mdiArrowDownCircleOutline, mdiArrowUpCircleOutline } from '@quasar/extras/mdi-v6';

const { t } = useI18n();
const store = useScenarioStore();
store.getScenariosWithMessage();
const clicked = ref(false);

const scenarioColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'notification',
    label: t('notification.label', 1),
    field: 'notification',
    sortable: true,
    align: 'left',
  },
  {
    name: 'number',
    label: t('notification.number'),
    field: 'number',
    align: 'center',
    sortable: true,
  },
]);

const storedResolvedScenarioColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'notification',
    label: t('notification.label', 1),
    field: 'notification',
    sortable: true,
    align: 'left',
  },
  {
    name: 'level',
    label: t('notification.level'),
    field: 'level',
    sortable: true,
    align: 'center',
  },
  {
    name: 'number',
    label: t('notification.number'),
    field: 'number',
    align: 'center',
    sortable: true,
  },
]);
</script>

<style lang="scss" scoped></style>
