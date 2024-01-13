<template>
  <q-card class="shadow q-pa-lg">
    <q-input
      v-if="authStore.user"
      v-model="authStore.user.mail"
      label="Current Email"
      readonly
      disable
    ></q-input>
    <q-form autocomplete="off">
      <q-input
        v-model="newEmail"
        autocomplete="off"
        label="New Email"
        type="email"
        ref="mailRef"
        :rules="mailRules"
      ></q-input>
      <q-btn
        class="float-right q-mt-lg"
        style="min-width: 95px"
        color="primary"
        unelevated
        type="submit"
        label="Save"
        :loading="changingEmail"
        @click.prevent="updateEmail"
        no-caps
      ></q-btn>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import { handleError } from '@/utils/error-handler';
import AuthService from '@/services/AuthService';
import { UserUpdate } from '@/models/User';
import { toast } from 'vue3-toastify';
import { QInput } from 'quasar';
import { isFormValid } from '@/utils/form-validation';

const authStore = useAuthStore();

const mailRef = ref<QInput>();
const newEmail = ref('');

const changingEmail = ref(false);

const mailRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your email',
  (val: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val) || 'Please enter a valid email address';
  },
];

async function updateEmail() {
  if (!authStore.userId) {
    return;
  }

  if (!isFormValid([mailRef.value])) {
    return;
  }

  const updateUser: UserUpdate = {
    mail: newEmail.value,
  };

  try {
    changingEmail.value = true;
    await AuthService.updateUser(updateUser, authStore.userId);
    toast.success('Email updated');
    authStore.refreshUser();
  } catch (err) {
    handleError(err, 'Failed to update email');
  } finally {
    changingEmail.value = false;
  }
}
</script>
