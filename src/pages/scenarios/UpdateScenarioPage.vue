<!--<template>
  <PageLayout
    :title="t('global.edit', 1)"
    :previous-title="scenario?.name ?? t('scenario.label', 1)"
    :previous-route="'/scenarios/' + scenario?.id"
  >
    <template #default>
      <ScenarioForm />
    </template>
  </PageLayout>
</template>-->

<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row items-center">
        <router-link class="main-text text-accent text-weight-medium z-fab" :to="'/scenarios'">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          {{ t('scenario.label', 2) }} >&nbsp;
        </router-link>
        <router-link class="main-text text-accent text-weight-medium z-fab" :to="'/scenarios/' + scenario?.id">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          {{ scenario?.name ?? t('scenario.label', 1) }} >&nbsp;
        </router-link>
        <p class="main-text z-index">{{ t('global.edit', 1) }}</p>
        <q-space></q-space>
        <div class="actions"></div>
      </div>
      <ScenarioForm v-if="scenario" mode="edit" :scenario-data="scenario" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ScenarioService from '@/services/ScenarioService';
import { ref } from 'vue';
import { Scenario } from '@/models/Scenario';
import ScenarioForm from '@/components/scenarios/ScenarioForm.vue';

const route = useRoute();
const { t } = useI18n();
const scenarioId = route.params.id.toString();
const scenario = ref<Scenario>();

getScenario();

async function getScenario() {
  scenario.value = await ScenarioService.getScenarioById(scenarioId);
}
</script>

<style lang="scss" scoped>
.z-index {
  z-index: 1001;
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
