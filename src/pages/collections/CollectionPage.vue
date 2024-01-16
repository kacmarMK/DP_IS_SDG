<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <router-link
          class="main-text text-accent text-weight-medium z-fab"
          to="/collections"
          >Collection ></router-link
        >
        <p v-if="dataPointTagTree" class="main-text z-fab">
          &nbsp;{{ dataPointTagTree.name }}
        </p>
      </div>
      <div
        v-if="dataPointTagTree"
        class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between"
      >
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
            @refresh="getCollection()"
          ></data-point-chart>
        </div>
      </div>
      <div></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import DataPointChart from '@/components/datapoints/DataPointChart.vue';
import CollectionService from '@/services/CollectionService';
import { ref } from 'vue';
import { DataPointTagNode } from '@/models/DataPointTagNode';
import {
  collectionToDataPointTagNode,
  nodeToDataPointTags,
} from '@/utils/data-point-tag-nodes';
import { computed } from 'vue';
import { handleError } from '@/utils/error-handler';

const route = useRoute();

const tickedNodes = ref<string[]>();
const dataPointTagTree = ref<DataPointTagNode>();
const isLoadingCollection = ref(false);

async function getCollection() {
  try {
    isLoadingCollection.value = true;
    const collection = await CollectionService.getCollection(
      route.params.id.toString(),
    );
    dataPointTagTree.value = collectionToDataPointTagNode(collection);
  } catch (error) {
    handleError(error, 'Loading collection failed!');
  } finally {
    isLoadingCollection.value = false;
  }
}
getCollection();

const dataPointTags = computed(() => {
  if (!dataPointTagTree.value) {
    return [];
  }
  return nodeToDataPointTags(dataPointTagTree.value);
});
</script>

<style lang="scss" scoped></style>
