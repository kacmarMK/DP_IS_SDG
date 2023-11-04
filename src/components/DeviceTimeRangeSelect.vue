<template>
  <q-select
    ref="dateSelect"
    class="date-picker"
    v-model="store.selectedTimeRange"
    :options="store.timeRanges"
    label="Time Range"
    option-value="timeRange"
    outlined
    dense
    map-options
  >
    <template v-slot:prepend>
      <q-icon name="mdi-clock-outline" />
    </template>
    <template v-slot:option="scope">
      <q-item
        class="row items-center"
        clickable
        @click="
          store.selectedTimeRange = scope.opt;
          store.isCustomTimeRangeSelected = false;
        "
        v-close-popup
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #after-options>
      <q-item clickable>
        <q-item-section>
          <q-item-label>Custom</q-item-label>
        </q-item-section>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date
            v-model="store.customTimeRangeSelected"
            @update:model-value="store.isCustomTimeRangeSelected = true"
            range
          >
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
      <template v-if="store.isCustomTimeRangeSelected"
        >{{ store.customTimeRangeSelected.from }} -
        {{ store.customTimeRangeSelected.to }}</template
      >
      <template v-else-if="scope.opt.name">
        {{ scope.opt.title }}
      </template>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useDevicesStore } from 'src/stores/devices-store';

const store = useDevicesStore();
</script>

<style lang="scss" scoped>
.date-picker {
  min-width: 190px;
}
</style>
