<template>
  <q-card class="shadow q-pa-lg">
    <q-form autocomplete="off">
      <q-input
        ref="currentPwRef"
        v-model="oldPassword"
        autocomplete="off"
        label="Current Password"
        :type="hidePwCurrent ? 'password' : 'text'"
        lazy-rules
        :rules="currentPasswordRules"
      >
        <template #append>
          <q-icon
            :name="hidePwCurrent ? 'mdi-eye-off' : 'mdi-eye'"
            class="cursor-pointer"
            @click="hidePwCurrent = !hidePwCurrent"
          />
        </template>
      </q-input>
      <q-input
        ref="newPwRef"
        v-model="newPassword"
        autocomplete="off"
        label="New Password"
        :type="hidePwNew ? 'password' : 'text'"
        :rules="newPasswordRules"
      >
        <template #append>
          <q-icon
            :name="hidePwNew ? 'mdi-eye-off' : 'mdi-eye'"
            class="cursor-pointer"
            @click="hidePwNew = !hidePwNew"
          />
        </template>
      </q-input>
      <q-btn
        class="float-right q-mt-lg"
        style="min-width: 95px"
        color="primary"
        unelevated
        type="submit"
        label="Save"
        :loading="changingPassword"
        no-caps
        @click.prevent="updatePassword"
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

const currentPwRef = ref<QInput>();
const newPwRef = ref<QInput>();

const hidePwCurrent = ref(true);
const hidePwNew = ref(true);

const oldPassword = ref('');
const newPassword = ref('');

const changingPassword = ref(false);

const currentPasswordRules = [
  (val: string) =>
    (val && val.length > 0) || 'Please enter your current password',
  (val: string) =>
    val === authStore.user?.password || 'Please enter your current password',
];

const newPasswordRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your new password',
];

async function updatePassword() {
  if (!authStore.userId) {
    return;
  }

  if (!isFormValid([currentPwRef.value, newPwRef.value])) {
    return;
  }

  const updateUser: UserUpdate = {
    password: newPassword.value,
  };

  try {
    changingPassword.value = true;
    await AuthService.updateUser(updateUser, authStore.userId);
    toast.success('Password changed!');
    authStore.refreshUser();
  } catch (err) {
    handleError(err, 'Changing password failed');
  } finally {
    changingPassword.value = false;
  }
}
</script>
