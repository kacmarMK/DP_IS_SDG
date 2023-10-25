<template>
  <q-select
    v-model="lang"
    :options="options"
    borderless
    dense
    option-value="value"
    option-label="label"
    emit-value
    map-options
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar class="items-center">
          <div class="fi option-flag" :class="scope.opt.icon"></div>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
      <div class="row items-center">
        <span class="fi selected-flag" :class="scope.opt.icon"></span>
        <div class="q-ml-sm">{{ scope.opt.label }}</div>
      </div>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { ref } from 'vue';

const lang = ref('gb');

const options = [
  { value: 'gb', icon: 'fi-gb', label: 'English' },
  { value: 'sk', icon: 'fi-sk', label: 'Slovenčina' },
  { value: 'cz', icon: 'fi-cz', label: 'Čestina' },
];
</script>

<style lang="scss" scoped>
.option-flag {
  width: 24px;
  height: 24px;
}

.selected-flag {
  width: 16px;
  height: 16px;
}
</style>
