<template>
  <div>
    <div class="q-gutter-y-md">
      <q-input v-model="command.name" autofocus :label="t('global.name')" />
      <q-select
        v-model="command.deviceType"
        :label="t('device.device_type')"
        :options="Object.values(DeviceTypeEnum)"
        map-options
      />
      <div class="text-parameters">{{ t('command.parameters') }}</div>
      <div v-if="localParams.length > 0">
        <VueDraggable v-model="localParams" :animation="200" filter="not-draggable" handle=".handle">
          <div v-for="(parameter, index) in localParams" :key="parameter.id">
            <div class="command-container bg-white sortable-drag">
              <q-icon class="handle drag-icon q-mr-md q-ml-sm" :name="mdiDrag" size="28px" />
              <q-input v-model="parameter.value" :placeholder="t('global.value')" borderless class="col-grow" />
              <q-btn
                class="q-mr-md q-ml-md"
                rounded
                dense
                unelevated
                :icon="mdiClose"
                @click="removeParameter(index)"
              />
            </div>
          </div>
        </VueDraggable>
      </div>
      <div>
        <q-btn
          class="full-width q-mb-md"
          outline
          :icon="mdiPlusCircle"
          color="primary"
          no-caps
          padding="8px"
          :label="t('command.add_parameter')"
          @click="addParameter"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CommandInput } from '@/models/Command';
import { useI18n } from 'vue-i18n';
import DeviceTypeEnum from '@/models/DeviceType';
import { mdiPlusCircle, mdiDrag, mdiClose } from '@quasar/extras/mdi-v6';
import { VueDraggable } from 'vue-draggable-plus';

const command = defineModel<CommandInput>({ required: true });

const { t } = useI18n();

const localParams = ref(command.value.params?.map((p, index) => ({ id: index, value: p })) ?? []);

const addParameter = () => {
  const uniqueId = Date.now() + Math.random();
  localParams.value.push({ id: uniqueId, value: '' });
};

const removeParameter = (index: number) => {
  localParams.value.splice(index, 1);
};

watch(
  localParams,
  (newParams) => {
    command.value.params = newParams.filter((p) => p.value).map((p) => p.value);
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.text-parameters {
  font-size: 1rem;
  font-weight: 500;
}

.command-container {
  border-radius: 4px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  margin-bottom: 5px;
}

.drag-icon {
  cursor: move;
}
</style>
