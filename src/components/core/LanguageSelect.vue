<template>
  <q-select
    v-model="locale"
    :options="options"
    borderless
    dense
    option-value="value"
    option-label="label"
    emit-value
    map-options
    @update:model-value="localeStorage = $event"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar class="items-center">
          <component :is="scope.opt.icon" class="option-flag" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #selected-item="scope">
      <div class="row items-center">
        <component :is="scope.opt.icon" class="selected-flag" />
        <div class="q-ml-sm">{{ scope.opt.label }}</div>
      </div>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import SKFlag from '@/assets/flags/sk.svg';
import GBFlag from '@/assets/flags/gb.svg';
import ESFlag from '@/assets/flags/es.svg';
import FRFlag from '@/assets/flags/fr.svg';

const localeStorage = useStorage('locale', 'en');
const { locale } = useI18n();

const options = [
  { value: 'en', icon: GBFlag, label: 'English' },
  { value: 'sk', icon: SKFlag, label: 'Slovenčina' },
  { value: 'es', icon: ESFlag, label: 'Español' },
  { value: 'fr', icon: FRFlag, label: 'Français' },
  // { value: 'cs', icon: 'CZFlag', label: 'Čestina' },
];
</script>

<style lang="scss" scoped>
.option-flag {
  width: 24px;
  height: 24px;
}

.selected-flag {
  height: 13px;
}
</style>
