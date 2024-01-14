<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ description }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="grey-9" label="Cancel" no-caps />
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
import { handleError } from '@/utils/error-handler';
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  itemUid: {
    type: String,
    required: true,
  },
  deleteFunction: {
    type: Function,
    required: true,
  },
  title: {
    type: String,
    default: 'Delete',
  },
  description: {
    type: String,
    default: 'Are you sure you want to delete this item?',
  },
  successMessage: {
    type: String,
    default: 'Deleted successfully!',
  },
  failedMessage: {
    type: String,
    default: 'Deleting failed!',
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
    await props.deleteFunction(props.itemUid);
    isVisible.value = false;
    emit('onDeleted');
    toast.success(props.successMessage);
  } catch (error) {
    handleError(error, props.failedMessage);
  } finally {
    isDeleteInProgress.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
