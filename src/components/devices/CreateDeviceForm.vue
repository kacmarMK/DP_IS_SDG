<template>
  <q-card style="min-width: 350px" class="q-pa-sm q-pa-md-lg shadow">
    <q-stepper ref="stepper" v-model="createStep" animated vertical header-nav>
      <q-step :name="1" :title="t('device.device_info')" icon="mdi-pencil">
        <div class="q-pa-sm row q-col-gutter-lg">
          <q-input
            v-model="deviceInput.name"
            class="col-12 col-md-6"
            :label="t('global.name')"
          />
          <q-input
            v-model="deviceInput.mac"
            class="col-12 col-md-6"
            :label="t('device.mac_address')"
          />
          <q-select
            v-model="deviceInput.type"
            class="col-12 col-md-6"
            :label="t('device.type')"
            :options="Object.values(DeviceTypeEnum)"
          >
          </q-select>
          <q-input
            v-model="deviceInput.initApiKey"
            class="col-12 col-md-6"
            :label="t('device.api_key')"
          />
          <q-input
            v-model="deviceInput.firmware"
            class="col-12 col-md-6"
            :label="t('device.firmware')"
          />
          <q-input
            v-model="deviceInput.version"
            class="col-12 col-md-6"
            :label="t('device.version')"
          />
        </div>
        <q-card-actions align="left" class="text-primary q-mt-sm">
          <q-btn
            unelevated
            color="primary"
            :label="t('global.next')"
            padding="7px 40px"
            no-caps
            @click="if (createStep == 1) createStep = 2;"
          />
        </q-card-actions>
      </q-step>
      <q-step :name="2" :title="t('device.add_sensors')" icon="mdi-thermostat">
        <div v-for="(dataPointTag, index) in remoteDataPointTags" :key="index">
          <div class="data-point-container q-my-md">
            <div class="row items-center justify-end">
              <q-btn
                flat
                round
                color="grey-color"
                icon="mdi-trash-can-outline"
                dense
                @click="deleteRemoteDataPointTag(dataPointTag.uid)"
              />
            </div>
            <div class="row q-col-gutter-lg">
              <q-input
                v-model="dataPointTag.name"
                class="col-12 col-md-6"
                :label="t('global.name')"
              />
              <q-input
                v-model="dataPointTag.tag"
                class="col-12 col-md-6"
                label="Tag"
              />
              <q-input
                v-model="dataPointTag.unit"
                class="col-12 col-md-6"
                :label="t('device.unit')"
              />
              <q-input
                v-model="dataPointTag.decimal"
                class="col-12 col-md-6"
                :label="t('device.decimal')"
              />
            </div>
          </div>
        </div>
        <div v-for="(dataPointTag, index) in localDataPointTags" :key="index">
          <div class="data-point-container q-my-md">
            <div class="row items-center justify-end">
              <q-btn
                flat
                round
                color="grey-color"
                icon="mdi-trash-can-outline"
                dense
                @click="deleteLocalDataPointTag(index)"
              />
            </div>
            <div class="row q-col-gutter-lg">
              <q-input
                v-model="dataPointTag.name"
                class="col-12 col-md-6"
                :label="t('global.name')"
              />
              <q-input
                v-model="dataPointTag.tag"
                class="col-12 col-md-6"
                label="Tag"
              />
              <q-input
                v-model="dataPointTag.unit"
                class="col-12 col-md-6"
                :label="t('device.unit')"
              />
              <q-input
                v-model="dataPointTag.decimal"
                class="col-12 col-md-6"
                :label="t('device.decimal')"
              />
            </div>
          </div>
        </div>
        <div class="text-primary">
          <q-btn
            class="full-width q-mb-md q-mt-sm"
            outline
            icon="mdi-plus-circle"
            color="primary"
            no-caps
            padding="12px 30px"
            :label="t('device.add_sensor')"
            @click="addLocalDataPointTag"
          />
          <q-btn
            unelevated
            color="primary"
            :label="t('global.save')"
            padding="7px 35px"
            :loading="submittingForm"
            no-caps
            @click="submitForm"
          />
        </div>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script setup lang="ts">
import DeviceTypeEnum from '@/models/DeviceType';
import { DataPointTagInput, DataPointTag } from '@/models/DataPointTag';
import { ref } from 'vue';
import { Device, DeviceInput } from '@/models/Device';
import { toast } from 'vue3-toastify';
import deviceService from '@/services/DeviceService';
import dataPointTagService from '@/services/DataPointTagService';
import { useRouter } from 'vue-router';
import { handleError } from '@/utils/error-handler';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
  editingDeviceId: {
    type: String,
    default: null,
  },
});

const router = useRouter();
const createStep = ref(1);
const deviceInput = ref<DeviceInput>({
  name: '',
  mac: '',
  type: undefined,
  version: '',
  firmware: '',
  initApiKey: '',
  deactivated: false,
});

async function getEditingDevice() {
  if (!props.isEditing || !props.editingDeviceId) return;
  try {
    const editingDevice = await deviceService.getDevice(props.editingDeviceId);
    deviceInput.value = {
      name: editingDevice.name,
      mac: editingDevice.mac,
      type: editingDevice.type,
      version: editingDevice.version,
      firmware: editingDevice.firmware,
      initApiKey: editingDevice.initApiKey,
      deactivated: editingDevice.deactivated,
    };
    remoteDataPointTags.value = editingDevice.dataPointTags;
    originalRemoteDataPointTags.value = cloneDataPointTags(
      editingDevice.dataPointTags,
    );
  } catch (error) {
    handleError(error, t('device.toasts.device.loading_failed'));
  }
}
getEditingDevice();

const remoteDataPointTags = ref<DataPointTag[]>([]);
const originalRemoteDataPointTags = ref<DataPointTag[]>([]);
async function deleteRemoteDataPointTag(id: string) {
  try {
    await dataPointTagService.deleteDataPointTag(id);
    remoteDataPointTags.value = remoteDataPointTags.value.filter(
      (dataPointTag) => dataPointTag.uid !== id,
    );
  } catch (error) {
    handleError(error, t('device.toasts.tag.delete_failed'));
  }
}

function cloneDataPointTags(tags: DataPointTag[]) {
  return tags.map((tag) => ({ ...tag }));
}

const localDataPointTags = ref<DataPointTagInput[]>([]);
function addLocalDataPointTag() {
  localDataPointTags.value.push({
    tag: '',
    name: '',
    unit: '',
    decimal: 0,
  });
}
function deleteLocalDataPointTag(index: number) {
  localDataPointTags.value.splice(index, 1);
}
async function createDataPointTags(): Promise<DataPointTag[]> {
  const dataPointTags: DataPointTag[] = [];

  for (const dataPointTag of localDataPointTags.value) {
    try {
      const createdDataPointTag =
        await dataPointTagService.createDataPointTag(dataPointTag);
      dataPointTags.push(createdDataPointTag);
    } catch (error) {
      handleError(error, t('device.toasts.tag.create_failed'));
    }
  }
  return dataPointTags;
}

async function createDevice(): Promise<Device | undefined> {
  let createdDevice!: Device;
  try {
    createdDevice = await deviceService.createDevice(deviceInput.value);
    createStep.value = 1;
  } catch (error) {
    handleError(error, t('device.toasts.device.create_failed'));
  }
  return createdDevice;
}

async function updateDevice(): Promise<Device | undefined> {
  let editedDevice!: Device;
  if (!props.isEditing || !props.editingDeviceId) return;

  try {
    editedDevice = await deviceService.updateDevice(
      deviceInput.value,
      props.editingDeviceId,
    );
    createStep.value = 1;
  } catch (error) {
    handleError(error, t('device.toasts.device.update_failed'));
  }
  return editedDevice;
}

const submittingForm = ref(false);
async function submitForm() {
  submittingForm.value = true;

  let device: Device | undefined;
  if (props.isEditing) {
    device = await updateDevice();
  } else {
    device = await createDevice();
  }

  if (!device) {
    submittingForm.value = false;
    return;
  }

  //Create data point tags from localDataPointTags and add them to device
  const dataPointTags: DataPointTag[] = await createDataPointTags();
  for (const dataPointTag of dataPointTags) {
    try {
      await dataPointTagService.addDataPointTagToDevice(
        device.uid,
        dataPointTag.uid,
      );
    } catch (error) {
      handleError(error, t('device.toasts.tag.add_tag_to_device_failed'));
    }
  }

  //Update remoteDataPointTags
  for (const dataPointTag of remoteDataPointTags.value) {
    const originalTag = originalRemoteDataPointTags.value.find(
      (tag) => tag.uid === dataPointTag.uid,
    );

    //Update only if tag has changed
    if (JSON.stringify(originalTag) !== JSON.stringify(dataPointTag)) {
      try {
        const updatedDataPointTag: DataPointTagInput = {
          tag: dataPointTag.tag,
          name: dataPointTag.name,
          unit: dataPointTag.unit,
          decimal: dataPointTag.decimal,
        };
        await dataPointTagService.updateDataPointTag(
          updatedDataPointTag,
          dataPointTag.uid,
        );
      } catch (error) {
        handleError(error, t('device.toasts.tag.update_failed'));
      }
    }
  }

  submittingForm.value = false;

  if (props.isEditing) {
    toast.success(t('device.toasts.device.update_success'));
  } else {
    toast.success(t('device.toasts.device.create_success'));
  }

  router.push(`/devices/${device.uid}`);
}
</script>

<style lang="scss" scoped>
.data-point-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem 2.5rem 4rem 2.5rem;
}
</style>
