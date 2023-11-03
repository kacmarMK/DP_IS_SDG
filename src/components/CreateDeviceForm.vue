<template>
  <q-card style="min-width: 350px" class="q-pa-sm q-pa-md-lg shadow">
    <q-stepper v-model="createStep" ref="stepper" animated vertical header-nav>
      <q-step :name="1" title="Device info" icon="mdi-pencil">
        <div class="q-pa-sm row q-col-gutter-lg">
          <q-input
            class="col-12 col-md-6"
            label="Name"
            v-model="deviceCreate.name"
          />
          <q-input
            class="col-12 col-md-6"
            label="Mac"
            v-model="deviceCreate.mac"
          />
          <q-select
            class="col-12 col-md-6"
            label="Type"
            v-model="deviceCreate.type"
            :options="Object.values(DeviceTypeEnum)"
          >
          </q-select>
          <q-input
            class="col-12 col-md-6"
            label="Init API Key"
            v-model="deviceCreate.initApiKey"
          />
          <q-input
            class="col-12 col-md-6"
            label="Firmware"
            v-model="deviceCreate.firmware"
          />
          <q-input
            class="col-12 col-md-6"
            label="Version"
            v-model="deviceCreate.version"
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
import DeviceTypeEnum from 'src/models/DeviceType';
import { DataPointTagCreate, DataPointTag } from 'src/models/DataPointTag';
import { ref } from 'vue';
import { Device, DeviceCreate } from 'src/models/Device';
import { toast } from 'vue3-toastify';
import deviceService from 'src/services/DeviceService';
import dataPointTagService from 'src/services/DataPointTagService';
import { useRouter } from 'vue-router';

const router = useRouter();

const createStep = ref(1);
const deviceCreate = ref<DeviceCreate>({
  name: '',
  mac: '',
  type: undefined,
  version: '',
  firmware: '',
  initApiKey: '',
  deactivated: false,
});
const isCreatingDevice = ref(false);

const localDataPointTags = ref<DataPointTagCreate[]>([]);
function addLocalDataPointTag() {
  localDataPointTags.value.push(<DataPointTagCreate>{
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
      const createdDataPointTag = await dataPointTagService.createDataPointTag(
        dataPointTag
      );
      dataPointTags.push(createdDataPointTag);
    } catch (error) {
      console.log(error);
      toast.error('Creating data point tag failed!');
    }
  }
  return dataPointTags;
}

async function createDevice(): Promise<Device | undefined> {
  let createdDevice!: Device;
  try {
    isCreatingDevice.value = true;
    createdDevice = await deviceService.createDevice(deviceCreate.value);
    createStep.value = 1;
  } catch (error) {
    console.log(error);
    toast.error('Creating device failed!');
  }
  return createdDevice;
}

const submittingForm = ref(false);
async function submitForm() {
  submittingForm.value = true;
  const createdDevice = await createDevice();
  if (!createdDevice) {
    submittingForm.value = false;
    return;
  }

  const dataPointTags: DataPointTag[] = await createDataPointTags();
  for (const dataPointTag of dataPointTags) {
    try {
      await dataPointTagService.addDataPointTagToDevice(
        createdDevice.uid,
        dataPointTag.uid
      );
    } catch (error) {
      console.log(error);
      toast.error('Adding data point tag to device failed!');
      submittingForm.value = false;
      return;
    }
  }
  submittingForm.value = false;
  toast.success('Device created!');
  router.push('/devices/');
}
</script>
<style lang="scss" scoped>
.data-point-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem 2.5rem 4rem 2.5rem;
}
</style>
