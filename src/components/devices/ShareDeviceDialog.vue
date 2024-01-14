<template>
  <q-dialog v-model="isDialogVisible">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Share device</div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="emailToShare" autofocus label="E-mail" />
        <q-btn
          unelevated
          color="primary"
          label="Share Device"
          no-caps
          :loading="shareInProgress"
          @click="shareDevice"
        />
        <div>
          <div class="text-shared q-my-md">Shared with</div>
          <q-list bordered separator>
            <q-item>
              <q-item-section>{{ device.user.mail }} (Owner)</q-item-section>
            </q-item>
            <q-item v-for="user in sharedWithUsers" :key="user.uid">
              <q-item-section>{{ user.mail }}</q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  flat
                  dense
                  icon="mdi-close"
                  @click="removeSharedUser(user)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat label="Cancel" no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { handleError } from '@/utils/error-handler';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import { Device } from '@/models/Device';
import DeviceService from '@/services/DeviceService';
import { User } from '@/models/User';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);

const isDialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const emailToShare = ref('');
const sharedWithUsers = ref<User[]>([]);
const shareInProgress = ref(false);
async function shareDevice() {
  if (isAlreadySharedWithUser.value) {
    toast.error('Device is already shared with this user');
    return;
  }
  try {
    shareInProgress.value = true;
    await DeviceService.shareDevice(props.device.uid, emailToShare.value);
    getSharedUsers();
    emailToShare.value = '';
    toast.success('Device shared successfully');
  } catch (error) {
    handleError(error, 'Sharing device failed!');
  } finally {
    shareInProgress.value = false;
  }
}

async function removeSharedUser(user: User) {
  try {
    await DeviceService.removeSharedUser(props.device.uid, user.uid);
    sharedWithUsers.value = sharedWithUsers.value.filter(
      (u) => u.uid !== user.uid,
    );
    getSharedUsers();
    toast.success('User removed successfully');
  } catch (error) {
    handleError(error, 'Removing user failed!');
  }
}

async function getSharedUsers() {
  try {
    sharedWithUsers.value = await DeviceService.getSharedUsers(
      props.device.uid,
    );
  } catch (error) {
    handleError(error, 'Getting shared with users failed!');
  }
}
getSharedUsers();

const isAlreadySharedWithUser = computed(() => {
  if (!emailToShare.value) return false;
  if (props.device.user.mail === emailToShare.value) return true;
  return sharedWithUsers.value.some((u) => u.mail === emailToShare.value);
});
</script>

<style lang="scss" scoped>
.text-shared {
  font-size: 1rem;
  font-weight: 500;
}
</style>
