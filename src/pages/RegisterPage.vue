<template>
  <q-layout>
    <q-page-container class="bg-img">
      <q-page class="flex flex-center">
        <div class="auth-bg fullscreen">
          <div class="auth-container shadow">
            <h1 class="text-center q-my-md">Register</h1>
            <div>
              <q-form>
                <q-input
                  v-model="userRegister.name"
                  ref="nicknameRef"
                  label="Username"
                  type="text"
                  lazy-rules
                  :rules="nameRules"
                />
                <q-input
                  v-model="userRegister.mail"
                  ref="mailRef"
                  label="Email"
                  type="email"
                  lazy-rules
                  :rules="mailRules"
                />
                <q-input
                  v-model="userRegister.password"
                  ref="passwordRef"
                  label="Password"
                  :type="isPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="passwordRules"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <q-btn
                  class="q-my-md full-width"
                  color="primary"
                  label="Register"
                  type="submit"
                  size="1rem"
                  no-caps
                  unelevated
                  @click.prevent="register"
                  :loading="isSubmitting"
                />
              </q-form>
              <div class="column items-center q-my-lg links">
                <div class="q-mb-md">
                  <span>Already have an account?</span>
                  <router-link to="/login" class="q-ml-sm">Log in</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import authService from '../services/AuthService';
import { UserRegister } from '../models/User';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { QInput } from 'quasar';

const router = useRouter();

const userRegister = ref<UserRegister>({
  name: '',
  mail: '',
  password: '',
});
const isPwd = ref(true);
const isSubmitting = ref(false);

//Form validation
const nicknameRef = ref<QInput>();
const mailRef = ref<QInput>();
const passwordRef = ref<QInput>();

const nameRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your name',
];
const mailRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your email',
  (val: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val) || 'Please enter a valid email address';
  },
];
const passwordRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your password',
];

function isFormInvalid(): boolean {
  const inputRefs = [nicknameRef, passwordRef, mailRef];
  let hasError = false;

  for (const ref of inputRefs) {
    const input = ref.value;
    if (input) {
      input.validate();
      if (input.hasError) {
        hasError = true;
      }
    }
  }
  return hasError;
}

async function register() {
  if (isFormInvalid()) {
    return;
  }

  try {
    isSubmitting.value = true;
    await authService.register(userRegister.value);
    toast.success('Registration successful!');
    router.push('/');
  } catch (error) {
    console.log(error);
    toast.error('Registration failed!');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '../css/auth.scss';
</style>
