<template>
  <PageLayout
    :title="scenario?.name ?? t('scenario.label', 1)"
    :previous-title="t('scenario.label', 2)"
    previous-route="/scenarios"
  >
    <template #actions>
      <q-btn
        class="shadow"
        color="primary"
        :icon="mdiPencil"
        :label="t('scenario.edit_scenario')"
        unelevated
        no-caps
        size="15px"
        :to="'/scenarios/' + scenario?.id + '/edit'"
      />
    </template>
    <template #default>
      <ScenarioForm v-if="scenario" mode="detail" :scenario-data="scenario" />
    </template>
  </PageLayout>
</template>
<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ScenarioService from '@/services/ScenarioService';
import { ref } from 'vue';
import { Scenario } from '@/models/Scenario';
import ScenarioForm from '@/components/scenarios/ScenarioForm.vue';
import { mdiPencil } from '@quasar/extras/mdi-v6';

const route = useRoute();
const { t } = useI18n();
const scenarioId = route.params.id.toString();
const scenario = ref<Scenario>();

getScenario();

async function getScenario() {
  scenario.value = await ScenarioService.getScenarioById(scenarioId);
}
</script>

<style lang="scss" scoped></style>
