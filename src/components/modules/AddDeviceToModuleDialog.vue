<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">{{ t('device.add_device') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-select
          v-model="selectedDeviceId"
          :options="filteredDevices"
          :label="t('device.label')"
          emit-value
          map-options
          option-value="uid"
          option-label="name"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="t('global.add')"
          no-caps
          :loading="addingInProgress"
          @click="addDevice"
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
import { Module } from '@/models/Module';
import { useDevicesStore } from '@/stores/devices-store';
import { Device } from '@/models/Device';
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
  alreadyAddedDevices: {
    type: Array as PropType<Device[]>,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'onAdded']);

const isDialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const filteredDevices = computed(() => {
  return deviceStore.devices.filter(
    (device) =>
      !props.alreadyAddedDevices.find(
        (alreadyAddedDevice) => alreadyAddedDevice.uid === device.uid,
      ),
  );
});

const deviceStore = useDevicesStore();
const selectedDeviceId = ref<string>();
const addingInProgress = ref(false);

async function addDevice() {
  if (!selectedDeviceId.value) return;
  addingInProgress.value = true;
  try {
    await ModuleService.addDeviceToModule(
      props.module.uid,
      selectedDeviceId.value,
    );
    toast.success(t('module.toasts.add_device_to_module_success'));
    emit('onAdded');
    isDialogVisible.value = false;
  } catch (error) {
    handleError(error, t('module.toasts.add_device_to_module_failed'));
  } finally {
    addingInProgress.value = false;
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      selectedDeviceId.value = undefined;
    }
  },
);

if (deviceStore.devices.length === 0) deviceStore.getDevices();
</script>

<style lang="scss" scoped></style>
