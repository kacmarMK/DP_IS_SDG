<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Edit module</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input autofocus label="Name" v-model="moduleLocal.name" />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          color="primary"
          label="Create Module"
          no-caps
          @click="updateModule"
          :loading="updatingModule"
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

function deepCopyModule(moduleObject: ModuleInput) {
  return JSON.parse(JSON.stringify(moduleObject));
}

const isDialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const updatingModule = ref(false);
const moduleLocal = ref<ModuleInput>(deepCopyModule(props.module));

async function updateModule() {
  try {
    updatingModule.value = true;
    await ModuleService.updateModule(props.module.uid, moduleLocal.value);
    isDialogVisible.value = false;
    emit('onUpdate');
    toast.success('Module updated!');
  } catch (error) {
    handleError(error, 'Updating module failed!');
  } finally {
    updatingModule.value = false;
  }
}

watch(
  () => props.module,
  (value) => {
    moduleLocal.value = deepCopyModule(value);
  },
);
</script>

<style lang="scss" scoped></style>
