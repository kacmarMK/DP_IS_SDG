<!-- eslint-disable vue/no-mutating-props -->
<template>
  <q-dialog v-model="isDialogOpen">
    <q-card class="q-pa-xs" :style="dialogStyle">
      <q-card-section>
        <div class="text-h6">
          {{ t('scenario.activity') + ' ' + scenario.name }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <div class="row justify-center items-center">
          <q-toggle
            v-model="scenario.deactivated"
            color="red"
            size="130px"
            :checked-icon="mdiSleep"
            :unchecked-icon="mdiLightningBolt"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="actionLabel"
          no-caps
          :loading="loading"
          padding="6px 20px"
          @click="setActivity"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { PropType, computed, ref, watch, defineProps, handleError } from 'vue';
import { Scenario } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import { useScenarioStore } from '@/stores/scenario-store';
import { mdiSleep, mdiLightningBolt } from '@quasar/extras/mdi-v6';

const scenarioStore = useScenarioStore();
const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  scenario: {
    type: Object as PropType<Scenario>,
    required: true,
  },
  actionLabel: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  minWidth: {
    type: String,
    required: false,
    default: '350px',
  },
});

const { t } = useI18n();
const $q = useQuasar();

const dialogStyle = computed(() => ({
  minWidth: $q.screen.gt.sm ? props.minWidth : undefined,
  width: !$q.screen.gt.sm ? '100%' : undefined,
}));

async function setActivity() {
  scenarioStore.editScenario(props.scenario);
  isDialogOpen.value = false;
}
</script>
