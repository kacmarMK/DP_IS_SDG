<template>
  <div>
    <q-table
      :rows="devices"
      :columns="columns"
      :loading="props.loading"
      flat
      :rows-per-page-options="[10, 20, 50]"
      :no-data-label="t('no_data_label')"
      :loading-label="t('loading_label')"
      :rows-per-page-label="t('rows_per_page_label')"
    >
      <template #no-data="{ message }">
        <div class="full-width column flex-center q-pa-lg nothing-found-text">
          <q-icon name="devices" class="q-mb-md" size="50px"></q-icon>
          {{ message }}
        </div>
      </template>

      <template #body-cell-name="props">
        <q-td :props="props">
          <router-link
            :to="`/devices/${props.row.uid}`"
            class="text-black text-weight-regular"
          >
            {{ props.row.name }}
          </router-link>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td auto-width :props="props">
          <q-btn
            icon="mdi-open-in-new"
            color="grey-color"
            flat
            round
            :to="`/devices/${props.row.uid}`"
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              {{ t('open') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="authStore.isAdmin"
            icon="mdi-pencil"
            color="grey-color"
            flat
            round
            :to="`/devices/${props.row.uid}/edit`"
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              {{ t('edit') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="authStore.isAdmin"
            icon="mdi-trash-can-outline"
            color="grey-color"
            flat
            round
            @click.stop="
              deleteDialog = true;
              deviceToDelete = props.row;
            "
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              {{ t('delete') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="authStore.isAdmin"
            icon="mdi-dots-vertical"
            color="grey-color"
            flat
            round
          >
            <q-menu anchor="bottom right" self="top right">
              <q-list>
                <q-item
                  v-close-popup
                  clickable
                  @click="initExpireTimeWindow(props.row.uid)"
                >
                  <div class="row items-center q-gutter-sm">
                    <q-icon color="grey-9" size="24px" name="mdi-timer" />
                    <div>{{ t('init_window') }}</div>
                  </div>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="
                    shareDialog = true;
                    deviceToShare = props.row;
                  "
                >
                  <div class="row items-center q-gutter-sm">
                    <q-icon color="grey-9" size="24px" name="mdi-share" />
                    <div>{{ t('share_device') }}</div>
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <DeleteConfirmationDialog
      v-if="deviceToDelete"
      v-model="deleteDialog"
      :item-uid="deviceToDelete.uid"
      :delete-function="DeviceService.deleteDevice"
      title="Delete Device"
      description="Are you sure you want to delete this device?"
      success-message="Device deleted successfully!"
      failed-message="Deleting device failed!"
      @on-deleted="deviceDeleted"
    />
    <ShareDeviceDialog
      v-if="deviceToShare"
      v-model="shareDialog"
      :device="deviceToShare"
    />
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import DeleteConfirmationDialog from '../core/DeleteConfirmationDialog.vue';
import ShareDeviceDialog from './ShareDeviceDialog.vue';
import { PropType, computed, ref } from 'vue';
import { Device } from '@/models/Device';
import DeviceService from '@/services/DeviceService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';

const { t } = useI18n({ useScope: 'local' });

const authStore = useAuthStore();

const props = defineProps({
  modelValue: {
    type: Array as PropType<Device[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'onChange']);

const devices = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const deleteDialog = ref(false);
const deviceToDelete = ref<Device>();
function deviceDeleted() {
  devices.value = devices.value.filter(
    (device) => device.uid !== deviceToDelete.value?.uid,
  );
  emit('onChange', devices.value);
}

const shareDialog = ref(false);
const deviceToShare = ref<Device>();

async function initExpireTimeWindow(deviceUid: string) {
  try {
    await DeviceService.initExpireTime(deviceUid);
    toast.success('1min window initialized successfully!');
  } catch (error) {
    handleError(error, 'Initializing expire time window failed!');
  }
}

const getPermissions = (device: Device) => {
  if (DeviceService.isOwner(device)) {
    return t('owner');
  }
  return t('shared');
};

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: t('name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'type',
    label: t('type'),
    field: 'type',
    sortable: true,
    align: 'left',
  },
  {
    name: 'version',
    label: t('version'),
    field: 'version',
    sortable: true,
    align: 'left',
  },
  {
    name: 'firmware',
    label: t('firmware'),
    field: 'firmware',
    sortable: true,
    align: 'left',
  },
  {
    name: 'permissions',
    label: t('permissions'),
    field(row) {
      return getPermissions(row);
    },
    sortable: true,
    align: 'left',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
];
</script>

<style lang="scss" scoped></style>

<i18n lang="json">
{
  "en": {
    "permissions": "Permissions",
    "no_data_label": "No Devices Yet",
    "loading_label": "Loading Devices...",
    "rows_per_page_label": "Devices per page",
    "init_window": "Initialize 1min window",
    "share_device": "Share device",
    "owner": "Owner",
    "shared": "Shared"
  },
  "sk": {
    "permissions": "Oprávnenia",
    "no_data_label": "Zatiaľ žiadne zariadenia",
    "loading_label": "Načítavam zariadenia...",
    "rows_per_page_label": "Zariadení na stránke",
    "init_window": "Inicializovať 1min okno",
    "share_device": "Zdieľať zariadenie",
    "owner": "Vlastník",
    "shared": "Zdieľané"
  }
}
</i18n>
