<template>
  <q-card style="min-width: 350px" class="q-pa-sm q-pa-md-lg shadow">
    <q-stepper v-model="createStep" ref="stepper" animated vertical header-nav>
      <q-step :name="1" title="Device info" icon="mdi-pencil">
        <div class="q-pa-sm row q-col-gutter-lg">
          <q-input
            class="col-12 col-md-6"
            label="Name"
            v-model="deviceInput.name"
          />
          <q-input
            class="col-12 col-md-6"
            label="Mac"
            v-model="deviceInput.mac"
          />
          <q-select
            class="col-12 col-md-6"
            label="Type"
            v-model="deviceInput.type"
            :options="Object.values(DeviceTypeEnum)"
          >
          </q-select>
          <q-input
            class="col-12 col-md-6"
            label="Init API Key"
            v-model="deviceInput.initApiKey"
          />
          <q-input
            class="col-12 col-md-6"
            label="Firmware"
            v-model="deviceInput.firmware"
          />
          <q-input
            class="col-12 col-md-6"
            label="Version"
            v-model="deviceInput.version"
          />
        </div>
        <q-card-actions align="left" class="text-primary q-mt-sm">
          <q-btn
            unelevated
            color="primary"
            label="Next"
            padding="7px 40px"
            no-caps
            @click="if (createStep == 1) createStep = 2;"
          />
        </q-card-actions>
      </q-step>
      <q-step :name="2" title="Add sensors" icon="mdi-thermostat">
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
                class="col-12 col-md-6"
                label="Name"
                v-model="dataPointTag.name"
              />
              <q-input
                class="col-12 col-md-6"
                label="Tag"
                v-model="dataPointTag.tag"
              />
              <q-input
                class="col-12 col-md-6"
                label="Unit"
                v-model="dataPointTag.unit"
              />
              <q-input
                class="col-12 col-md-6"
                label="Decimal"
                v-model="dataPointTag.decimal"
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
                class="col-12 col-md-6"
                label="Name"
                v-model="dataPointTag.name"
              />
              <q-input
                class="col-12 col-md-6"
                label="Tag"
                v-model="dataPointTag.tag"
              />
              <q-input
                class="col-12 col-md-6"
                label="Unit"
                v-model="dataPointTag.unit"
              />
              <q-input
                class="col-12 col-md-6"
                label="Decimal"
                v-model="dataPointTag.decimal"
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
            label="Add sensor"
            @click="addLocalDataPointTag"
          />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            padding="7px 35px"
            @click="submitForm"
            :loading="submittingForm"
            no-caps
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

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
  editingDeviceId: String,
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
    handleError(error, 'Getting device failed!');
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
    handleError(error, 'Deleting data point tag failed!');
  }
}

function cloneDataPointTags(tags: DataPointTag[]) {
  return tags.map((tag) => ({ ...tag }));
}

const localDataPointTags = ref<DataPointTagInput[]>([]);
function addLocalDataPointTag() {
  localDataPointTags.value.push(<DataPointTagInput>{
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
      handleError(error, 'Creating data point tag failed!');
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
    handleError(error, 'Creating device failed!');
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
    handleError(error, 'Updating device failed!');
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
      handleError(error, 'Adding data point tag to device failed!');
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
        handleError(error, 'Updating data point tag failed!');
      }
    }
  }

  submittingForm.value = false;

  if (props.isEditing) {
    toast.success('Device updated!');
  } else {
    toast.success('Device created!');
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
