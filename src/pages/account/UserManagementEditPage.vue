<template>
  <PageLayout
    v-if="user && user.mail"
    :title="user.mail"
    :previous-title="t('global.user_management')"
    previous-route="/user-management"
  >
    <div class="column q-mt-lg">
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
  </PageLayout>
</template>

<script setup lang="ts">
import UpdateEmailCard from '@/components/account/UpdateEmailCard.vue';
import UpdatePasswordCard from '@/components/account/UpdatePasswordCard.vue';
import UpdateRoleCard from '@/components/account/UpdateRoleCard.vue';
import PageLayout from '@/layouts/PageLayout.vue';
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
