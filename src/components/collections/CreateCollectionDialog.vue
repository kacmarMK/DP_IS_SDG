<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">{{ t('collection.create_collection') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input
          v-model="collection.name"
          autofocus
          :label="t('global.name')"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="t('global.create')"
          no-caps
          :loading="creatingCollection"
          @click="createCollection"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CollectionInput } from '@/models/Collection';
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

const getEmptyCollection = (): CollectionInput => ({
  name: '',
});

const creatingCollection = ref(false);
const collection = ref<CollectionInput>(getEmptyCollection());

async function createCollection() {
  try {
    creatingCollection.value = true;
    await CollectionService.createCollection(collection.value);
    collection.value = getEmptyCollection();
    isDialogVisible.value = false;
    emit('onCreate');
    toast.success(t('collection.toasts.create_success'));
  } catch (error) {
    handleError(error, t('collection.toasts.create_failed'));
  } finally {
    creatingCollection.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
