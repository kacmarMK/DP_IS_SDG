<template>
  <q-card class="q-pa-sm q-pa-md-lg shadow">
    <q-stepper ref="stepper" v-model="createStep" animated vertical header-nav keep-alive>
      <q-step :name="1" :title="t('device.device_info')" :icon="mdiPencil">
        <q-form>
          <div class="q-pa-sm row q-col-gutter-lg">
            <q-input
              ref="nameRef"
              v-model="deviceInput.name"
              :rules="nameRules"
              class="col-12 col-md-6"
              :label="t('global.name')"
            />
            <q-input
              ref="macRef"
              v-model="deviceInput.mac"
              :rules="macRules"
              class="col-12 col-md-6"
              :label="t('device.mac_address')"
            />
            <q-select
              ref="typeRef"
              v-model="deviceInput.type"
              :rules="typeRules"
              class="col-12 col-md-6"
              :label="t('device.type')"
              :options="Object.values(DeviceTypeEnum)"
            >
            </q-select>
            <q-input
              ref="initApiKeyRef"
              v-model="deviceInput.initApiKey"
              class="col-12 col-md-6"
              :label="t('device.api_key')"
            />
            <q-input
              ref="firmwareRef"
              v-model="deviceInput.firmware"
              class="col-12 col-md-6"
              :label="t('device.firmware')"
            />
            <q-input v-model="deviceInput.version" class="col-12 col-md-6" :label="t('device.version')" />
          </div>
          <q-card-actions align="left" class="text-primary q-mt-sm">
            <q-btn
              unelevated
              color="primary"
              :label="t('global.next')"
              padding="7px 40px"
              no-caps
              type="submit"
              @click.prevent="goToStep(2)"
            />
          </q-card-actions>
        </q-form>
      </q-step>
      <q-step :name="2" :title="t('device.add_sensors')" :icon="matSensors">
        <q-form>
          <div v-for="(dataPointTag, index) in remoteDataPointTags" :key="index">
            <data-point-tag-form
              ref="remoteDataPointTagFormRef"
              v-model="remoteDataPointTags[index]"
              @remove="deleteRemoteDataPointTag(dataPointTag.uid)"
            />
          </div>
          <div v-for="(dataPointTag, index) in localDataPointTags" :key="index">
            <data-point-tag-form
              ref="remoteDataPointTagFormRef"
              v-model="localDataPointTags[index]"
              @remove="deleteLocalDataPointTag(index)"
            />
          </div>
          <div class="text-primary">
            <q-btn
              class="full-width q-mb-md q-mt-sm"
              outline
              :icon="mdiPlusCircle"
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
              type="submit"
              @click.prevent="submitForm"
            />
          </div>
        </q-form>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script setup lang="ts">
import DeviceTypeEnum from '@/models/DeviceType';
import { DataPointTagInput, DataPointTag } from '@/models/DataPointTag';
import { ref } from 'vue';
import { Device, DeviceInput, deviceToInput } from '@/models/Device';
import { toast } from 'vue3-toastify';
import deviceService from '@/services/DeviceService';
import dataPointTagService from '@/services/DataPointTagService';
import { useRouter } from 'vue-router';
import { handleError } from '@/utils/error-handler';
import { useI18n } from 'vue-i18n';
import { QField, QInput } from 'quasar';
import { isFormValid } from '@/utils/form-validation';
import DataPointTagForm from './DataPointTagForm.vue';
import { mdiPencil, mdiPlusCircle } from '@quasar/extras/mdi-v6';
import { matSensors } from '@quasar/extras/material-icons';
import { useDeviceStore } from '@/stores/device-store';

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

const { t } = useI18n();
const router = useRouter();
const deviceStore = useDeviceStore();

const deviceInput = ref<DeviceInput>(
  deviceStore.getDeviceById(props.editingDeviceId) ?? {
    name: '',
    mac: '',
    type: undefined,
    version: '',
    firmware: '',
    initApiKey: '',
    deactivated: false,
  },
);

const createStep = ref(1);

async function getEditingDevice() {
  if (!props.isEditing || !props.editingDeviceId) return;
  try {
    const editingDevice = await deviceService.getDevice(props.editingDeviceId);
    deviceInput.value = deviceToInput(editingDevice);
    remoteDataPointTags.value = editingDevice.dataPointTags;
    originalRemoteDataPointTags.value = cloneDataPointTags(editingDevice.dataPointTags);
  } catch (error) {
    handleError(error, t('device.toasts.loading_failed'));
  }
}
getEditingDevice();

const remoteDataPointTags = ref<DataPointTag[]>([]);
const originalRemoteDataPointTags = ref<DataPointTag[]>([]);
async function deleteRemoteDataPointTag(id: string) {
  try {
    await dataPointTagService.deleteDataPointTag(id);
    remoteDataPointTags.value = remoteDataPointTags.value.filter((dataPointTag) => dataPointTag.uid !== id);
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
      const createdDataPointTag = await dataPointTagService.createDataPointTag(dataPointTag);
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
  } catch (error) {
    handleError(error, t('device.toasts.create_failed'));
  }
  return createdDevice;
}

async function updateDevice(): Promise<Device | undefined> {
  let editedDevice!: Device;
  if (!props.isEditing || !props.editingDeviceId) return;

  try {
    editedDevice = await deviceService.updateDevice(deviceInput.value, props.editingDeviceId);
  } catch (error) {
    handleError(error, t('device.toasts.update_failed'));
  }
  return editedDevice;
}

const submittingForm = ref(false);
async function submitForm() {
  const firstStepForm = [nameRef.value, macRef.value, typeRef.value];
  if (!isFormValid(firstStepForm)) {
    createStep.value = 1;
    return;
  }

  if (!isFormValid(allDataPointTagRefs())) {
    createStep.value = 2;
    return;
  }

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
      await dataPointTagService.addDataPointTagToDevice(device.uid, dataPointTag.uid);
    } catch (error) {
      handleError(error, t('device.toasts.tag.add_tag_to_device_failed'));
    }
  }

  //Update remoteDataPointTags
  for (const dataPointTag of remoteDataPointTags.value) {
    const originalTag = originalRemoteDataPointTags.value.find((tag) => tag.uid === dataPointTag.uid);

    //Update only if tag has changed
    if (JSON.stringify(originalTag) !== JSON.stringify(dataPointTag)) {
      try {
        const updatedDataPointTag: DataPointTagInput = {
          tag: dataPointTag.tag,
          name: dataPointTag.name,
          unit: dataPointTag.unit,
          decimal: dataPointTag.decimal,
        };
        await dataPointTagService.updateDataPointTag(updatedDataPointTag, dataPointTag.uid);
      } catch (error) {
        handleError(error, t('device.toasts.tag.update_failed'));
      }
    }
  }

  submittingForm.value = false;

  if (props.isEditing) {
    toast.success(t('device.toasts.update_success'));
  } else {
    toast.success(t('device.toasts.create_success'));
  }

  router.push(`/devices/${device.uid}`);
}

function goToStep(step: number) {
  if (createStep.value == 1) {
    const firstStepForm = [nameRef.value, macRef.value, typeRef.value];
    if (!isFormValid(firstStepForm)) return;
  }
  createStep.value = step;
}

// Input validation
const nameRef = ref<QInput>();
const macRef = ref<QInput>();
const typeRef = ref<QField>();

const localDataPointTagFormRef = ref<(typeof DataPointTagForm)[]>([]);
const remoteDataPointTagFormRef = ref<(typeof DataPointTagForm)[]>([]);

const nameRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const macRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const typeRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];

function allDataPointTagRefs() {
  const allRefs: QInput[] = [];
  for (const dataPointTagForm of localDataPointTagFormRef.value) {
    allRefs.push(...dataPointTagForm.getAllRefs());
  }
  for (const dataPointTagForm of remoteDataPointTagFormRef.value) {
    allRefs.push(...dataPointTagForm.getAllRefs());
  }
  return allRefs;
}
</script>

<style lang="scss" scoped>
.data-point-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem 2.5rem 4rem 2.5rem;
}
</style>
