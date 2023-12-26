<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Device</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to delete this device?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey-9" label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Delete"
          color="red"
          :loading="isDeletingDevice"
          no-caps
          @click="deleteDevice()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import type { Device } from '@/models/Device';
import DeviceService from '@/services/DeviceService';
import { handleError } from '@/utils/error-handler';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  device: {
    type: Object as PropType<Device>,
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

const isDeletingDevice = ref(false);

async function deleteDevice() {
  try {
    isDeletingDevice.value = true;
    await DeviceService.deleteDevice(props.device.uid);
    isVisible.value = false;
    emit('onDeleted');
    toast.success('Collection deleted!');
  } catch (error) {
    handleError(error, 'Deleting collection failed!');
  } finally {
    isDeletingDevice.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
