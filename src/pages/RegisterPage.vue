<template>
  <div class="auth-bg fullscreen">
    <div class="auth-container shadow">
      <h1>Register</h1>
      <div>
        <q-form>
          <q-input
            v-model="userRegister.name"
            label="Username"
            type="text"
            lazy-rules
            :rules="[(val) => !!val || 'Please enter your username']"
          />
          <q-input
            v-model="userRegister.mail"
            label="Email"
            type="email"
            lazy-rules
            :rules="[(val) => !!val || 'Please enter your email']"
          />
          <q-input
            v-model="userRegister.password"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import authService from '../services/AuthService';
import { UserRegister } from '../models/User';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();

const userRegister = ref<UserRegister>({
  name: '',
  mail: '',
  password: '',
});
const isPwd = ref(true);
const isSubmitting = ref(false);

async function register() {
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
@import url(../css/auth.scss);
</style>
