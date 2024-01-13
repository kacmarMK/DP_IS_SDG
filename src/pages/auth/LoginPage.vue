<template>
  <q-layout>
    <q-page-container class="bg-img">
      <q-page class="flex flex-center">
        <div class="auth-bg fullscreen">
          <div class="auth-container shadow">
            <h1 class="text-center q-my-md">Login</h1>
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
                <!-- <q-checkbox
                  v-model="rememberMe"
                  class="q-mb-md"
                  dense
                  label="Remember me"
                /> -->
                <q-btn
                  class="q-my-md full-width"
                  color="primary"
                  label="Login"
                  type="submit"
                  size="1rem"
                  no-caps
                  unelevated
                  :loading="isSubmitting"
                  @click.prevent="login"
                />
              </q-form>
              <div class="column items-center q-my-lg links">
                <div class="q-mb-md">
                  <span>Don't have an account?</span>
                  <router-link to="/register" class="q-ml-sm"
                    >Sign Up</router-link
                  >
                </div>
                <router-link to="/password/reset">Forgot password?</router-link>
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
import { UserLogin } from '@/models/User';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { QInput } from 'quasar';
import { useAuthStore } from '@/stores/auth-store';
import { handleError } from '@/utils/error-handler';
import { isFormValid } from '@/utils/form-validation';

const router = useRouter();
const authStore = useAuthStore();

const userLogin = ref<UserLogin>({
  name: '',
  password: '',
});
// const rememberMe = ref(false);
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

async function login() {
  if (!isFormValid([nameRef.value, passwordRef.value])) {
    return;
  }

  try {
    isSubmitting.value = true;
    await authStore.login(userLogin.value);
    toast.success('Login successful!');
    router.push('/');
  } catch (error) {
    handleError(error, 'Login failed!');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/auth.scss';
</style>
