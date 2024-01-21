<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">{{ t('module.edit_module') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input
          v-model="moduleInput.name"
          autofocus
          :label="t('global.name')"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="t('global.save')"
          no-caps
          :loading="updatingModule"
          @click="updateModule"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import ModuleService from '@/services/ModuleService';
import { handleError } from '@/utils/error-handler';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import { Module, ModuleInput } from '@/models/Module';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  module: {
    type: Object as PropType<Module>,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'onUpdate']);

const isDialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

function newModuleInput(module: Module): ModuleInput {
  return {
    name: module.name,
  };
}

const updatingModule = ref(false);
const moduleInput = ref<ModuleInput>(newModuleInput(props.module));

async function updateModule() {
  try {
    updatingModule.value = true;
    await ModuleService.updateModule(props.module.uid, moduleInput.value);
    isDialogVisible.value = false;
    emit('onUpdate');
    toast.success(t('module.toasts.update_success'));
  } catch (error) {
    handleError(error, t('module.toasts.update_failed'));
  } finally {
    updatingModule.value = false;
  }
}

watch(
  () => props.module,
  (value) => {
    moduleInput.value = newModuleInput(value);
  },
);
</script>

<style lang="scss" scoped></style>
