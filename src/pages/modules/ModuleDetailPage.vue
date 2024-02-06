<template>
  <PageLayout
    v-if="dataPointTagTree"
    :title="dataPointTagTree.name"
    :previous-title="t('module.label')"
    :previous-route="'/collections'"
  >
    <div v-if="dataPointTagTree" class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between">
      <div class="col-12">
        <sensor-selection-tree
          v-model:tickedNodes="tickedNodes"
          :data-point-tag-tree="dataPointTagTree"
          class="shadow container q-pa-lg full-height"
        ></sensor-selection-tree>
      </div>
      <div class="col-12">
        <data-point-chart
          v-model:tickedNodes="tickedNodes"
          :data-point-tags="dataPointTags"
          class="bg-white shadow q-pa-lg"
          @refresh="refresh"
        ></data-point-chart>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import DataPointChart from '@/components/datapoints/DataPointChart.vue';
import { ref } from 'vue';
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { extractNodeKeys, moduleToDataPointTagNode, nodeToDataPointTags } from '@/utils/data-point-tag-nodes';
import { computed } from 'vue';
import ModuleService from '@/services/ModuleService';
import { useI18n } from 'vue-i18n';
import PageLayout from '@/layouts/PageLayout.vue';
import { useAsyncData } from '@/composables/useAsyncData';

const { t } = useI18n();
const route = useRoute();

const tickedNodes = ref<string[]>();
const dataPointTagTree = ref<DataPointTagNode>();
const { refresh } = useAsyncData(getModule, t('module.toasts.load_failed'));

async function getModule() {
  const collection = await ModuleService.getModule(route.params.id.toString());
  dataPointTagTree.value = moduleToDataPointTagNode(collection);
  tickedNodes.value = extractNodeKeys(dataPointTagTree.value);
}

const dataPointTags = computed(() => {
  if (!dataPointTagTree.value) {
    return [];
  }
  return nodeToDataPointTags(dataPointTagTree.value);
});
</script>

<style lang="scss" scoped></style>
