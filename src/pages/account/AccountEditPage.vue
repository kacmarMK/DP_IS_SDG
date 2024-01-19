<template>
  <div>
    <div v-if="authStore.user" class="column">
      <div class="row q-mb-xl">
        <div class="col-12 col-md-5 q-mb-md">
          <div class="text-h6 text-secondary">Update Email</div>
          <div class="text-grey-14">Update your account's email address.</div>
        </div>
        <UpdateEmailCard
          :user="authStore.user"
          class="col-12 col-md-7"
          @update="authStore.refreshUser()"
        />
      </div>
      <div class="row justify-between q-mb-xl">
        <div class="col-12 col-md-5 q-mb-md">
          <div class="text-h6 text-secondary">Update Password</div>
          <div class="text-grey-14">
            Ensure your account is using a long, random password to stay secure.
          </div>
        </div>
        <UpdatePasswordCard
          :user="authStore.user"
          class="col-12 col-md-7"
          @update="authStore.refreshUser()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UpdateEmailCard from '@/components/account/UpdateEmailCard.vue';
import UpdatePasswordCard from '@/components/account/UpdatePasswordCard.vue';
import { useAuthStore } from '@/stores/auth-store';

const authStore = useAuthStore();
</script>
