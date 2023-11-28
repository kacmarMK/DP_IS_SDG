<template>
  <router-link :to="to" :exact="exact">
    <q-btn
      no-caps
      flat
      :label="label"
      align="left"
      class="menu-btn q-my-xs"
      :icon="icon"
      size="15px"
      padding="10px"
    >
    </q-btn
  ></router-link>
</template>

<script>
export default {
  props: {
    label: String,
    icon: String,
    to: String,
    exact: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 500;
  color: #8296bd;
  i {
    color: #9eb3d3;
  }
}

.router-link-exact-active {
  .q-btn {
    background-color: #edf1fc;
    color: $primary;
  }
}
</style>
