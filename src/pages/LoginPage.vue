<template>
  <div class="auth-bg fullscreen">
    <div class="auth-container shadow">
      <h1>Login</h1>
      <div>
        <q-form>
          <q-input
            v-model="userLogin.name"
            label="Username"
            type="text"
            lazy-rules
            :rules="[(val) => !!val || 'Please enter your username']"
          />
          <q-input
            v-model="userLogin.password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
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

const router = useRouter();

const userLogin = ref<UserLogin>({
  name: '',
  password: '',
});
const isPwd = ref(true);
const isSubmitting = ref(false);

async function login() {
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
.auth-bg {
  body.screen--xs & {
    background-color: white;
  }

  .auth-container {
    max-width: 26rem;
    border-radius: 0.3rem;
    background-color: #ffffff;
    padding: 1rem 3rem;
    margin: 10rem auto;

    h1 {
      font-size: 1.6rem;
      font-weight: normal;
      margin: 1rem auto 0 auto;
      width: 100%;
      text-align: center;
      line-height: 1em;
    }

    .q-input {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    body.screen--xs & {
      box-shadow: none;
      border: none;
    }
  }
}
</style>
