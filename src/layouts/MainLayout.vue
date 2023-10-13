<template>
  <q-layout view="lHh LpR lfr">
    <q-header class="bg-white text-secondary shadow">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-white shadow"
    >
      <div class="column q-px-lg full-height">
        <router-link class="q-my-lg q-mx-auto full-width" to="/">
          <q-img
            src="../assets/logo.png"
            height="3.7rem"
            fit="contain"
            no-spinner
            no-transition
          />
        </router-link>
        <div class="links">
          <side-menu-button to="/" :exact="true" label="Home" icon="mdi-home" />
          <side-menu-button
            to="/company"
            label="Team"
            icon="mdi-account-group"
          />
          <side-menu-button
            to="/collections"
            label="Collections"
            icon="mdi-source-fork"
          />
          <side-menu-button
            to="/notifications"
            label="Notifications"
            icon="mdi-bell"
          />
          <side-menu-button
            to="/recipes"
            label="Recipes"
            icon="mdi-book-multiple"
          />
          <side-menu-button to="/jobs" label="Jobs" icon="mdi-list-status" />
          <side-menu-button
            to="/commands"
            label="Commands"
            icon="mdi-code-tags"
          />
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideMenuButton from 'src/components/SideMenuButton.vue';
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
