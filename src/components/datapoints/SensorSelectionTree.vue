<template>
  <div>
    <div class="text-weight-medium text-h6">Sensors</div>
    <div class="column q-mt-sm q-gutter-y-sm" v-if="dataPointTagTree.children">
      <q-tree
        :nodes="dataPointTagTree.children"
        node-key="uid"
        label-key="name"
        tick-strategy="leaf"
        no-nodes-label="No sensors available"
        default-expand-all
        v-model:ticked="tickedNodes"
        v-model:expanded="expanded"
        :class="noChildren ? 'no-children' : ''"
      >
        <template v-slot:default-header="prop">
          <div
            v-if="prop.node.dataPointTag"
            class="text-weight-medium text-primary cursor-pointer"
            @click="prop.ticked = !prop.ticked"
          >
            {{ prop.node.name }} ({{ prop.node.dataPointTag.unit }})
          </div>
          <div v-else>
            {{ prop.node.name }}
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { computed } from 'vue';
import { PropType, ref } from 'vue';

const props = defineProps({
  dataPointTagTree: {
    type: Object as PropType<DataPointTagNode>,
    required: true,
  },
});
const tickedNodes = defineModel<string[]>('tickedNodes');
const expanded = ref<string[]>(extractNodeKeys(props.dataPointTagTree));

const noChildren = computed(() => {
  return (
    props.dataPointTagTree.children?.every((node) => node.dataPointTag) || false
  );
});

function extractNodeKeys(node: DataPointTagNode): string[] {
  if (!node.children) {
    return [node.uid];
  }
  return [node.uid, ...node.children.flatMap(extractNodeKeys)];
}
tickedNodes.value = extractNodeKeys(props.dataPointTagTree);
</script>

<style lang="scss">
.no-children {
  .q-tree__node-header {
    padding-left: 0 !important;
    padding-bottom: 0.5rem;
  }
}
</style>
