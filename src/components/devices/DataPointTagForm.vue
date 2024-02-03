<template>
  <div class="data-point-container q-my-md">
    <div class="row items-center justify-end">
      <q-btn flat round color="grey-color" :icon="mdiTrashCanOutline" dense @click="emit('remove')" />
    </div>
    <div class="row q-col-gutter-lg">
      <q-input
        ref="dataTagNameRef"
        v-model="dataPointTagName"
        :rules="nameRules"
        class="col-12 col-md-6"
        :label="t('global.name')"
      />
      <q-input ref="tagRef" v-model="dataPointTag" :rules="tagRules" class="col-12 col-md-6" :label="t('device.tag')" />
      <q-input
        ref="unitRef"
        v-model="dataPointTagUnit"
        :rules="unitRules"
        class="col-12 col-md-6"
        :label="t('device.unit')"
      />
      <q-input
        ref="decimalRef"
        v-model.number="dataPointTagDecimal"
        type="number"
        inputmode="numeric"
        mask="#"
        :rules="decimalRules"
        class="col-12 col-md-6"
        :label="t('device.decimal')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiTrashCanOutline } from '@quasar/extras/mdi-v6';
import { QInput } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const dataPointTagName = defineModel<string>('dataPointTagName', {
  required: true,
});
const dataPointTag = defineModel<string>('dataPointTag', {
  required: true,
});
const dataPointTagUnit = defineModel<string>('dataPointTagUnit', {
  required: true,
});
const dataPointTagDecimal = defineModel<number>('dataPointTagDecimal', {
  required: true,
});
const emit = defineEmits(['remove']);

const { t } = useI18n();

const dataTagNameRef = ref<QInput>();
const tagRef = ref<QInput>();
const unitRef = ref<QInput>();
const decimalRef = ref<QInput>();

//For outside validation
const getAllRefs = () => [dataTagNameRef.value, tagRef.value, unitRef.value, decimalRef.value];

const nameRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const tagRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const unitRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];

const decimalRules = [
  (val: string) => (val != null && isNumeric(val)) || t('global.rules.required'),
  (val: number) => val >= 0 || t('device.rules.decimal_min'),
];

const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};

defineExpose({
  getAllRefs,
});
</script>
