<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">{{ t('module.create_module') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="moduleObj.name" autofocus :label="t('global.name')" />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="t('global.create')"
          no-caps
          :loading="creatingModule"
          @click="createModule"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import type { Collection } from '@/models/Collection';
import ModuleService from '@/services/ModuleService';
import { handleError } from '@/utils/error-handler';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import { ModuleInput } from '@/models/Module';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  collection: {
    type: Object as PropType<Collection>,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'onCreate']);

const isDialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const getEmptyModule = (): ModuleInput => ({
  name: '',
});

const creatingModule = ref(false);
const moduleObj = ref<ModuleInput>(getEmptyModule());

async function createModule() {
  try {
    creatingModule.value = true;
    const createdModule = await ModuleService.createModule(moduleObj.value);
    await ModuleService.addModuleToCollection(
      props.collection.uid,
      createdModule.uid,
    );
    moduleObj.value = getEmptyModule();
    isDialogVisible.value = false;
    emit('onCreate');
    toast.success(t('module.toasts.create_success'));
  } catch (error) {
    handleError(error, t('module.toasts.create_failed'));
  } finally {
    creatingModule.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
