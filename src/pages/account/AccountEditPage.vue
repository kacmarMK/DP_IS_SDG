<template>
  <div>
    <div class="column">
      <div class="row q-mb-xl">
        <div class="col-12 col-md-5 q-mb-md">
          <div class="text-h6 text-secondary">Update Email</div>
          <div class="text-grey-14">Update your account's email address.</div>
        </div>
        <UpdateEmailCard class="col-12 col-md-7" />
      </div>
      <div class="row justify-between q-mb-xl">
        <div class="col-12 col-md-5 q-mb-md">
          <div class="text-h6 text-secondary">Update Password</div>
          <div class="text-grey-14">
            Ensure your account is using a long, random password to stay secure.
          </div>
        </div>
        <UpdatePasswordCard class="col-12 col-md-7" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UpdateEmailCard from '@/components/account/UpdateEmailCard.vue';
import UpdatePasswordCard from '@/components/account/UpdatePasswordCard.vue';
</script>
