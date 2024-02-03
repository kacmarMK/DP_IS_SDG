<template>
  <dialog-common
    v-model="isDialogOpen"
    :title="t('module.create_module')"
    :action-label="t('global.create')"
    :loading="creatingModule"
    @on-submit="createModule"
  >
    <module-form v-model="moduleObj" />
  </dialog-common>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import type { Collection } from '@/models/Collection';
import ModuleService from '@/services/ModuleService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { ModuleInput } from '@/models/Module';
import { useI18n } from 'vue-i18n';
import DialogCommon from '@/components/core/DialogCommon.vue';
import ModuleForm from '@/components/modules/ModuleForm.vue';

const { t } = useI18n();

const props = defineProps({
  collection: {
    type: Object as PropType<Collection>,
    required: true,
  },
});
const emit = defineEmits(['onCreate']);

const isDialogOpen = defineModel<boolean>();

const getEmptyModule = (): ModuleInput => ({
  name: '',
});

const creatingModule = ref(false);
const moduleObj = ref<ModuleInput>(getEmptyModule());

async function createModule() {
  try {
    creatingModule.value = true;
    const createdModule = await ModuleService.createModule(moduleObj.value);
    await ModuleService.addModuleToCollection(props.collection.uid, createdModule.uid);
    moduleObj.value = getEmptyModule();
    isDialogOpen.value = false;
    emit('onCreate');
    toast.success(t('module.toasts.create_success'));
  } catch (error) {
    handleError(error, t('module.toasts.create_failed'));
  } finally {
    creatingModule.value = false;
  }
}
</script>
