<template>
  <div>
    <q-table
      v-model:pagination="pagination"
      :rows="filteredDevices"
      :columns="columns"
      :loading="props.loading"
      flat
      :rows-per-page-options="[10, 20, 50]"
      :no-data-label="t('table.no_data_label')"
      :loading-label="t('table.loading_label')"
      :rows-per-page-label="t('table.rows_per_page_label')"
      binary-state-sort
      @request="emit('onRequest', $event)"
    >
      <template #no-data="{ message }">
        <div class="full-width column flex-center q-pa-lg nothing-found-text">
          <q-icon :name="mdiCellphoneLink" class="q-mb-md" size="50px"></q-icon>
          {{ message }}
        </div>
      </template>

      <template #body-cell-name="propsCell">
        <q-td :props="propsCell">
          <router-link :to="`/devices/${propsCell.row.uid}`" class="text-black">
            {{ propsCell.row.name }}
          </router-link>
        </q-td>
      </template>

      <template #body-cell-lastResponse="propsContact">
        <q-td auto-width :props="propsContact">
          {{ formatTimeToDistance(propsContact.row.lastResponse) }}
          <q-tooltip v-if="propsContact.row.lastResponse" content-style="font-size: 11px" :offset="[0, 4]">
            {{ formatToLocalTime(propsContact.row.lastResponse) }}
          </q-tooltip>
        </q-td>
      </template>

      <template #body-cell-status="propsStatus">
        <q-td auto-width :props="propsStatus">
          <StatusDot :status="getDeviceStatus(propsStatus.row)" />
        </q-td>
      </template>

      <template #body-cell-jobstatus="jobProps">
        <q-td auto-width :props="jobProps">
          <!-- <JobStatusBadge :status="getLastJobStatus(jobProps.row)" /> -->
          <JobStatusIcon :status="getLastJobStatus(jobProps.row)" />
        </q-td>
      </template>

      <template #body-cell-actions="propsActions">
        <q-td auto-width :props="propsActions">
          <q-btn :icon="mdiOpenInNew" color="grey-color" flat round :to="`/devices/${propsActions.row.uid}`"
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              {{ t('global.open') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="authStore.isAdmin"
            :icon="mdiPencil"
            color="grey-color"
            flat
            round
            :to="`/devices/${propsActions.row.uid}/edit`"
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              {{ t('global.edit') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="authStore.isAdmin"
            :icon="mdiTrashCanOutline"
            color="grey-color"
            flat
            round
            @click.stop="
              deleteDialog = true;
              deviceToDelete = propsActions.row;
            "
            ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
              {{ t('global.delete') }}
            </q-tooltip>
          </q-btn>
          <q-btn v-if="authStore.isAdmin" :icon="mdiDotsVertical" color="grey-color" flat round>
            <q-menu anchor="bottom right" self="top right">
              <q-list>
                <q-item v-close-popup clickable @click="initExpireTimeWindow(propsActions.row.uid)">
                  <div class="row items-center q-gutter-sm">
                    <q-icon color="grey-9" size="24px" :name="mdiTimer" />
                    <div>{{ t('device.init_window') }}</div>
                  </div>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="
                    shareDialog = true;
                    deviceToShare = propsActions.row;
                  "
                >
                  <div class="row items-center q-gutter-sm">
                    <q-icon color="grey-9" size="24px" :name="mdiShare" />
                    <div>{{ t('device.share_device') }}</div>
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <DeleteDeviceDialog
      v-if="deviceToDelete"
      v-model="deleteDialog"
      :device="deviceToDelete"
      @on-deleted="emit('onChange')"
    />
    <ShareDeviceDialog v-if="deviceToShare" v-model="shareDialog" :device="deviceToShare" />
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import ShareDeviceDialog from './ShareDeviceDialog.vue';
import { PropType, computed, ref } from 'vue';
import { Device, getDeviceStatus, getLastJobStatus } from '@/models/Device';
import DeviceService from '@/services/DeviceService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import {
  mdiCellphoneLink,
  mdiDotsVertical,
  mdiOpenInNew,
  mdiPencil,
  mdiShare,
  mdiTimer,
  mdiTrashCanOutline,
} from '@quasar/extras/mdi-v6';
import DeleteDeviceDialog from './DeleteDeviceDialog.vue';
import { formatTimeToDistance, formatToLocalTime } from '@/utils/date-utils';
import StatusDot from './StatusDot.vue';
import JobStatusIcon from '../jobs/JobStatusIcon.vue';
import { Pagination } from '@/models/Pagination';

const props = defineProps({
  devices: {
    type: Array as PropType<Device[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  filter: {
    type: String,
    required: false,
    default: '',
  },
});
const pagination = defineModel<Pagination>('pagination', {
  default: { sortBy: 'name', descending: false, page: 1, rowsPerPage: 10 },
});

const emit = defineEmits(['onChange', 'onRequest']);

const { t } = useI18n();
const authStore = useAuthStore();

const deleteDialog = ref(false);
const deviceToDelete = ref<Device>();

const shareDialog = ref(false);
const deviceToShare = ref<Device>();

const filteredDevices = computed(() => {
  if (props.filter) {
    return props.devices.filter((device) => device.name.toLowerCase().includes(props.filter.toLowerCase()));
  }
  return props.devices;
});

async function initExpireTimeWindow(deviceUid: string) {
  try {
    await DeviceService.initExpireTime(deviceUid);
    toast.success(t('device.toasts.window.init_success'));
  } catch (error) {
    handleError(error, t('device.toasts.window.init_failed'));
  }
}

const getPermissions = (device: Device) => {
  if (DeviceService.isOwner(device)) {
    return t('global.owner');
  }
  return t('global.shared');
};

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'permissions',
    label: t('global.permissions'),
    field(row) {
      return getPermissions(row);
    },
    sortable: false,
    align: 'left',
  },
  {
    name: 'lastResponse',
    label: t('device.last_activity'),
    field: 'lastResponse',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: t('device.status'),
    field(row) {
      return getDeviceStatus(row);
    },
    align: 'center',
    sortable: false,
  },
  {
    name: 'jobstatus',
    label: t('job.job_status'),
    field(row) {
      return getLastJobStatus(row);
    },
    align: 'center',
    sortable: false,
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
]);
</script>

<style lang="scss" scoped></style>
