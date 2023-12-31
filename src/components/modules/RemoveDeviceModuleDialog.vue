<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Remove device</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to remove this device from {{ module.name }}?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey-9" label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Delete"
          color="red"
          :loading="isDeleteInProgress"
          no-caps
          @click="handleDelete()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Device } from '@/models/Device';
import { Module } from '@/models/Module';
import { handleError } from '@/utils/error-handler';
import { ref, computed, PropType } from 'vue';
import { toast } from 'vue3-toastify';
import ModuleService from '@/services/ModuleService';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
  module: {
    type: Object as PropType<Module>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'onDeleted']);
const isVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const isDeleteInProgress = ref(false);
async function handleDelete() {
  try {
    isDeleteInProgress.value = true;
    await ModuleService.removeDeviceFromModule(
      props.module.uid,
      props.device.uid,
    );
    isVisible.value = false;
    emit('onDeleted');
    toast.success('Device removed from module');
  } catch (error) {
    handleError(error, 'Removing device failed!');
  } finally {
    isDeleteInProgress.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
