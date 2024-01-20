<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">{{ t('collection.edit_collection') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input
          v-model="collectionInput.name"
          autofocus
          :label="t('global.name')"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="t('global.save')"
          no-caps
          :loading="updatingCollection"
          @click="updateCollection"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import type { Collection, CollectionInput } from '@/models/Collection';
import CollectionService from '@/services/CollectionService';
import { handleError } from '@/utils/error-handler';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
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
const emit = defineEmits(['update:modelValue', 'onUpdate']);

function newCollectionInput(collection: Collection): CollectionInput {
  return {
    name: collection.name,
  };
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
const collectionInput = ref<CollectionInput>(
  newCollectionInput(props.collection),
);

async function updateCollection() {
  try {
    updatingCollection.value = true;
    await CollectionService.updateCollection(
      props.collection.uid,
      collectionInput.value,
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
    collectionInput.value = newCollectionInput(value);
  },
);
</script>

<style lang="scss" scoped></style>
