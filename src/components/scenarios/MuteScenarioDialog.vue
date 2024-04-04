<template>
  <q-dialog v-model="isDialogOpen">
    <q-card class="q-pa-xs" :style="dialogStyle">
      <q-card-section>
        <div class="text-h6">
          {{ t('scenario.mute') + ' ' + scenario.name }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model.number="minutes" outlined :label="t('scenario.form.set_muted_until')" rounded :dense="false" />
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
          @click="setMutedUntil"
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

var minutes = ref<number | null>(null);
const scenarioStore = useScenarioStore();
const { t } = useI18n();
const $q = useQuasar();

const dialogStyle = computed(() => ({
  minWidth: $q.screen.gt.sm ? props.minWidth : undefined,
  width: !$q.screen.gt.sm ? '100%' : undefined,
}));

watch(minutes, (newValue, oldValue) => {
  // Convert newValue to a number if it's not already, and check if it's an integer
  const numericValue = Number(newValue);
  if (!Number.isInteger(numericValue)) {
    // Reset to the old value or set a default valid value
    minutes.value = oldValue ?? null;
  } else {
    // If numericValue is a valid integer, update minutes with the numeric value
    // This step ensures minutes is always stored as a number, not a string
    minutes.value = numericValue;
  }
});

async function setMutedUntil() {
  if (minutes.value) {
    scenarioStore.muteScenario(props.scenario.id, minutes.value);
  }
  isDialogOpen.value = false;
  minutes.value = null;
}
</script>
