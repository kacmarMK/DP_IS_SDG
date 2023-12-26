<template>
  <q-dialog v-model="isVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete collection</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Are you sure you want to delete {{ props.collection.name }} collection?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="grey-9" label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Delete"
          color="red"
          :loading="isDeletingCollection"
          no-caps
          @click="deleteCollection()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import type { Collection } from '@/models/Collection';
import CollectionService from '@/services/CollectionService';
import { handleError } from '@/utils/error-handler';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

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
const emit = defineEmits(['update:modelValue', 'onDeleted']);

const isVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const isDeletingCollection = ref(false);

async function deleteCollection() {
  try {
    isDeletingCollection.value = true;
    await CollectionService.deleteCollection(props.collection.uid);
    isVisible.value = false;
    emit('onDeleted');
    toast.success('Collection deleted!');
  } catch (error) {
    handleError(error, 'Deleting collection failed!');
  } finally {
    isDeletingCollection.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
