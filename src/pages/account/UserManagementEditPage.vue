<template>
  <q-page class="main-padding">
    <div>
      <div class="top-row row items-center">
        <router-link to="/user-management">
          <p class="main-text text-accent">
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            {{ t('global.user_management') }} >&nbsp;
          </p>
        </router-link>
        <p v-if="user" class="main-text">{{ user.mail }}</p>
      </div>
      <div v-if="user" class="column q-mt-lg">
        <div class="row q-mb-xl">
          <div class="col-12 col-md-5 q-mb-md">
            <div class="text-h6 text-secondary">
              {{ t('account.change_role') }}
            </div>
            <div class="text-grey-14">
              {{ t('account.change_role_desc') }}
            </div>
          </div>
          <UpdateRoleCard :user="user" class="col-12 col-md-7" @update="getUser()" />
        </div>
        <div class="row q-mb-xl">
          <div class="col-12 col-md-5 q-mb-md">
            <div class="text-h6 text-secondary">
              {{ t('account.update_email') }}
            </div>
            <div class="text-grey-14">
              {{ t('account.update_email_other_desc') }}
            </div>
          </div>
          <UpdateEmailCard :user="user" class="col-12 col-md-7" @update="getUser()" />
        </div>
        <div class="row q-mb-xl">
          <div class="col-12 col-md-5 q-mb-md">
            <div class="text-h6 text-secondary">
              {{ t('account.update_password') }}
            </div>
            <div class="text-grey-14">
              {{ t('account.update_password_other_desc') }}
            </div>
          </div>
          <UpdatePasswordCard :user="user" :require-old-password="false" class="col-12 col-md-7" @update="getUser()" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import UpdateEmailCard from '@/components/account/UpdateEmailCard.vue';
import UpdatePasswordCard from '@/components/account/UpdatePasswordCard.vue';
import UpdateRoleCard from '@/components/account/UpdateRoleCard.vue';
import { User } from '@/models/User';
import AuthService from '@/services/AuthService';
import { handleError } from '@/utils/error-handler';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const user = ref<User>();

async function getUser() {
  try {
    user.value = await AuthService.getUserById(route.params.id.toString());
  } catch (err) {
    handleError(err, t('account.toasts.get_user_failed'));
  }
}
getUser();
</script>

<style lang="scss" scoped></style>
