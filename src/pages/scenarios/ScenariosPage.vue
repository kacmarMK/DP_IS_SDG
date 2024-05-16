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
        <template #body-cell-muted="mutedUntil">
          <q-td auto-width :props="mutedUntil">
            <div class="row justify-center items-center">
              <div class="status-dot row items-center justify-center">{{ mutedUntil.row.mutedUntil }}</div>
            </div>
          </q-td>
        </template>
        <template #body-cell-activity="propsActivity">
          <q-td auto-width :props="propsActivity">
            <div class="row justify-center items-center">
              <div class="status-dot row items-center justify-center">
                <q-btn
                  :icon="propsActivity.row.deactivated ? mdiSleep : mdiLightningBolt"
                  round
                  :color="propsActivity.row.deactivated ? 'red' : 'green'"
                  flat
                />
                <q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  {{ propsActivity.row.deactivated ? t('scenario.deactivated') : t('scenario.activated') }}
                </q-tooltip>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn :icon="mdiOpenInNew" color="grey-color" flat round :to="`/scenarios/${props.row.id}`"
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.details') }}
              </q-tooltip>
            </q-btn>

            <q-btn
              :icon="mdiPowerSleep"
              color="grey-color"
              flat
              round
              @click.stop="
                isMuteDialogOpened = true;
                mutedScenario = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]"> {{ t('scenario.mute') }} </q-tooltip>
            </q-btn>
            <q-btn
              :icon="mdiPower"
              color="grey-color"
              flat
              round
              @click.stop="
                isActivityDialogOpened = true;
                activatedScenario = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]"> {{ t('scenario.activity') }} </q-tooltip>
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
  <MuteScenarioDialog
    v-if="mutedScenario"
    v-model="isMuteDialogOpened"
    :scenario="mutedScenario"
    :action-label="t('global.save')"
    min-width="400px"
  />
  <ActivityScenarioDialog
    v-if="activatedScenario"
    v-model="isActivityDialogOpened"
    :scenario="activatedScenario"
    :action-label="t('global.save')"
    min-width="300px"
  />
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
import MuteScenarioDialog from '@/components/scenarios/MuteScenarioDialog.vue';
import ActivityScenarioDialog from '@/components/scenarios/ActivityScenarioDialog.vue';
import {
  mdiOpenInNew,
  mdiPlus,
  mdiBookMultipleOutline,
  mdiSleep,
  mdiLightningBolt,
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

const isMuteDialogOpened = ref(false);
const mutedScenario = ref<Scenario>();

const isActivityDialogOpened = ref(false);
const activatedScenario = ref<Scenario>();

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'mute',
    label: t('scenario.mute_time'),
    field: 'mutedUntil',
    sortable: true,
    align: 'center',
  },
  {
    name: 'activity',
    label: t('scenario.activity'),
    field: '',
    align: 'center',
    sortable: false,
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
