<template>
  <div class="auth-bg fullscreen">
    <div class="auth-container shadow">
      <h1>Login</h1>
      <div>
        <q-form>
          <q-input
            v-model="userLogin.name"
            ref="nameRef"
            label="Username"
            type="text"
            lazy-rules
            :rules="nameRules"
          />
          <q-input
            v-model="userLogin.password"
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
            label="Login"
            type="submit"
            size="1rem"
            no-caps
            unelevated
            @click.prevent="login"
            :loading="isSubmitting"
          />
        </q-form>
        <div class="column items-center q-my-lg links">
          <div class="q-mb-md">
            <span>Don't have an account?</span>
            <router-link to="/register" class="q-ml-sm">Sign Up</router-link>
          </div>
          <router-link to="/password/reset">Forgot password?</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import authService from '../services/AuthService';
import { UserLogin } from '../models/User';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { QInput } from 'quasar';

const router = useRouter();

const userLogin = ref<UserLogin>({
  name: '',
  password: '',
});
const isPwd = ref(true);
const isSubmitting = ref(false);

//Form validation
const nameRef = ref<QInput>();
const passwordRef = ref<QInput>();

const nameRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your username',
];

const passwordRules = [
  (val: string) => (val && val.length > 0) || 'Please enter your password',
];

function isFormInvalid(): boolean {
  const inputRefs = [nameRef, passwordRef];
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

async function login() {
  if (isFormInvalid()) {
    return;
  }

  try {
    isSubmitting.value = true;
    await authService.login(userLogin.value);
    toast.success('Login successful!');
    router.push('/');
  } catch (error) {
    console.log(error);
    toast.error('Login failed!');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import url(../css/auth.scss);
</style>
