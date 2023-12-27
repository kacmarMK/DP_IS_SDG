<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Edit collection</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input autofocus label="Name" v-model="collection.name" />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          color="primary"
          label="Create Collection"
          no-caps
          @click="updateCollection"
          :loading="updatingCollection"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
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
const emit = defineEmits(['update:modelValue', 'onUpdate']);

function deepCopyCollection(collectionObject: Collection) {
  return JSON.parse(JSON.stringify(collectionObject));
}

const isDialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const updatingCollection = ref(false);
const collection = ref<Collection>(deepCopyCollection(props.collection));

async function updateCollection() {
  try {
    updatingCollection.value = true;
    await CollectionService.updateCollection(
      props.collection.uid,
      collection.value,
    );
    isDialogVisible.value = false;
    emit('onUpdate');
    toast.success('Collection updated!');
  } catch (error) {
    handleError(error, 'Updating collection failed!');
  } finally {
    updatingCollection.value = false;
  }
}

watch(
  () => props.collection,
  (value) => {
    collection.value = deepCopyCollection(value);
  },
);
</script>

<style lang="scss" scoped></style>
