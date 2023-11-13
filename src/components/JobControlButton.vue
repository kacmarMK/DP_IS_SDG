<template>
  <q-btn
    class="full-width"
    :color="color"
    padding="0.5rem 0.3rem"
    size="14px"
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
