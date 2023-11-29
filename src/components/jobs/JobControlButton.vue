<template>
  <q-btn
    dense
    class="full-width bg-white no-wrap text-no-wrap"
    :color="color"
    padding="0.6rem 0.8rem"
    size="13px"
    outline
    :disable="disable"
    :loading="loading"
  >
    <q-icon left size="1.5em" :name="icon" />
    <div>{{ props.label }}</div>
  </q-btn>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  color: String,
  icon: String,
  disable: Boolean,
  loading: Boolean,
});
</script>
