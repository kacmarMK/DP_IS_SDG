<template>
  <div>
    <q-card class="q-pa-lg shadow">
      <div class="row items-center q-col-gutter-x-xl q-col-gutter-y-md">
        <q-input
          ref="nameRef"
          v-model="command.name"
          :rules="nameRules"
          :disable="props.loading"
          :label="t('global.name')"
          class="col-12 col-lg-6"
        />
        <q-select
          ref="deviceTypeRef"
          v-model="command.deviceType"
          :rules="deviceTypeRules"
          :disable="props.loading"
          class="col-12 col-lg-6"
          :label="t('device.device_type')"
          :options="Object.values(DeviceTypeEnum)"
        />
      </div>
    </q-card>
    <CommandStepsSelect v-model="command" class="q-mt-md" :loading="props.loading" />
    <!-- <SubrecipeStepsSelect v-show="selectedStepType === 'subrecipes'" v-model="recipe" :loading="props.loading" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DeviceTypeEnum from '@/models/DeviceType';
import { isFormValid } from '@/utils/form-validation';
import CommandStepsSelect from '@/components/recipes/CommandStepsSelect.vue';
import { Command, getEmptyCommandInputAsRecipe } from '@/models/Command';

const command = defineModel<Command>({ required: true, default: getEmptyCommandInputAsRecipe() });
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
defineExpose({ validate });

const { t } = useI18n();

const nameRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const deviceTypeRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];

const nameRef = ref();
const deviceTypeRef = ref();

function validate() {
  const refs = [nameRef.value, deviceTypeRef.value];
  return isFormValid(refs);
}
</script>
