<template>
  <dialog-common
    v-model="isDialogOpen"
    :title="t('module.edit_module')"
    :action-label="t('global.save')"
    :loading="updatingModule"
    @on-submit="updateModule"
  >
    <module-form v-model="moduleInput" />
  </dialog-common>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import ModuleService from '@/services/ModuleService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { Module, ModuleInput } from '@/models/Module';
import { useI18n } from 'vue-i18n';
import DialogCommon from '@/components/core/DialogCommon.vue';
import ModuleForm from '@/components/modules/ModuleForm.vue';

const { t } = useI18n();

const props = defineProps({
  module: {
    type: Object as PropType<Module>,
    required: true,
  },
});
const emit = defineEmits(['onUpdate']);

const isDialogOpen = defineModel<boolean>();

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
    isDialogOpen.value = false;
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
