<template>
  <dialog-common
    v-model="isDialogOpen"
    :title="t('collection.edit_collection')"
    :action-label="t('global.save')"
    :loading="updatingCollection"
    @on-submit="updateCollection"
  >
    <collection-form v-model="collectionInput" />
  </dialog-common>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import type { Collection, CollectionInput } from '@/models/Collection';
import CollectionService from '@/services/CollectionService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import DialogCommon from '@/components/core/DialogCommon.vue';
import CollectionForm from '@/components/collections/CollectionForm.vue';

const { t } = useI18n();

const props = defineProps({
  collection: {
    type: Object as PropType<Collection>,
    required: true,
  },
});

const isDialogOpen = defineModel<boolean>();

const emit = defineEmits(['onUpdate']);

function newCollectionInput(collection: Collection): CollectionInput {
  return {
    name: collection.name,
  };
}

const updatingCollection = ref(false);
const collectionInput = ref<CollectionInput>(newCollectionInput(props.collection));

async function updateCollection() {
  try {
    updatingCollection.value = true;
    await CollectionService.updateCollection(props.collection.uid, collectionInput.value);
    isDialogOpen.value = false;
    emit('onUpdate');
    toast.success(t('collection.toasts.update_success'));
  } catch (error) {
    handleError(error, t('collection.toasts.update_failed'));
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
