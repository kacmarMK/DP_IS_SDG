<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Account Settings</p>
      </div>
    </div>
    <q-card class="shadow q-mb-lg">
      <q-tabs
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-route-tab
          :to="{ path: '/account' }"
          style="min-width: 130px"
          name="account"
          icon="mdi-account"
          label="Account"
          no-caps
        />
        <q-route-tab
          :to="{ path: '/account/users' }"
          style="min-width: 130px"
          name="usermanagement"
          icon="mdi-account-group"
          label="User Management"
          no-caps
        />
      </q-tabs>
    </q-card>
    <router-view />
  </q-page>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped></style>
