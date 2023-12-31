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
        class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between"
        v-if="dataPointTagTree"
      >
        <div class="col-12">
          <sensor-selection-tree
            :dataPointTagTree="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            class="shadow container q-pa-lg full-height"
          ></sensor-selection-tree>
        </div>
        <div class="col-12">
          <data-point-chart
            :dataPointTags="dataPointTags"
            class="bg-white shadow q-pa-lg"
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
import { collectionToDataPointTagNode } from '@/utils/data-point-tag-nodes';
import { computed } from 'vue';
import { DataPointTag } from '@/models/DataPointTag';

const route = useRoute();

const dataPointTagTree = ref<DataPointTagNode>();

async function getCollection(id: string) {
  const collection = await CollectionService.getCollection(id);
  dataPointTagTree.value = collectionToDataPointTagNode(collection);
}
getCollection(route.params.id.toString());

const tickedNodes = ref<string[]>();

function getDataPointTags(
  node: DataPointTagNode,
  seenUids = new Set(),
): DataPointTag[] {
  if (!node.children) {
    if (node.dataPointTag && !seenUids.has(node.dataPointTag.uid)) {
      seenUids.add(node.dataPointTag.uid);
      return [node.dataPointTag];
    }
    return [];
  }

  const tags = node.children.flatMap((child) =>
    getDataPointTags(child, seenUids),
  );
  if (node.dataPointTag && !seenUids.has(node.dataPointTag.uid)) {
    seenUids.add(node.dataPointTag.uid);
    tags.push(node.dataPointTag);
  }

  return tags;
}

const dataPointTags = computed(() => {
  if (!dataPointTagTree.value) {
    return [];
  }
  return getDataPointTags(dataPointTagTree.value);
});
</script>

<style lang="scss" scoped></style>
