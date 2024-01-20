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
        <q-space />
        <language-select class="q-mr-md"></language-select>
        <q-btn
          class="q-mr-xs"
          flat
          dense
          size="18px"
          round
          padding="4px"
          icon="account_circle"
          :ripple="false"
        >
          <q-menu>
            <q-list style="min-width: 150px" class="text-secondary">
              <q-item>
                <q-item-section class="q-py-xs">
                  <div class="text-weight-medium">
                    {{ authStore.user?.name }}
                  </div>
                  <div class="text-grey-color">{{ authStore.user?.mail }}</div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable to="/account">
                <div class="row items-center q-gutter-sm">
                  <q-icon size="24px" name="person_outline" />
                  <div>{{ t('global.account') }}</div>
                </div>
              </q-item>
              <!-- <q-item clickable to="/settings">
                <div class="row items-center q-gutter-sm">
                  <q-icon size="24px" name="mdi-cog-outline" />
                  <div>Settings</div>
                </div>
              </q-item> -->
              <q-separator />
              <q-item clickable @click="authStore.logout()">
                <div class="row items-center q-gutter-sm">
                  <q-icon size="24px" name="mdi-logout" />
                  <div>{{ t('account.logout') }}</div>
                </div>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="shadow bg-white">
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
          <side-menu-button
            to="/"
            :exact="true"
            :label="t('global.home')"
            icon="mdi-home"
          />
          <side-menu-button
            to="/devices"
            :label="t('device.title', 2)"
            icon="mdi-cellphone-link"
          />
          <side-menu-button
            to="/collections"
            :label="t('collection.title', 2)"
            icon="mdi-hub-outline"
          />
          <!-- <side-menu-button
            to="/company"
            label="Team"
            icon="mdi-account-group"
          /> -->
          <!-- <side-menu-button
            to="/notifications"
            label="Notifications"
            icon="mdi-bell"
          /> -->
          <side-menu-button
            to="/jobs"
            :label="t('job.title', 2)"
            icon="mdi-list-status"
          />
          <side-menu-button
            to="/recipes"
            :label="t('global.recipes')"
            icon="mdi-book-multiple-outline"
          />
          <side-menu-button
            to="/commands"
            :label="t('global.commands')"
            icon="mdi-code-tags"
          />
          <side-menu-button
            v-if="authStore.isAdmin"
            to="/user-management"
            :label="t('global.user_management')"
            icon="mdi-account-group"
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
import SideMenuButton from '@/components/core/SideMenuButton.vue';
import LanguageSelect from '@/components/core/LanguageSelect.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const authStore = useAuthStore();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
