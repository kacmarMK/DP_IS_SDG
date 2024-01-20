<template>
  <div>
    <div>
      <div class="q-mb-md row">
        <p class="modules-text">Modules</p>
        <q-space></q-space>
        <q-btn
          v-if="authStore.isAdmin"
          class="shadow bg-white"
          color="primary"
          unelevated
          outline
          no-caps
          size="15px"
          label="Create Module"
          icon="mdi-plus"
          @click="createModuleDialog = true"
        />
      </div>
      <q-table
        :rows="collection.modules || []"
        :columns="columns"
        flat
        class="outline shadow"
        hide-pagination
        no-data-label="No modules Yet"
        loading-label="Loading modules..."
        row-key="uid"
      >
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="mdi-hub-outline" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>

        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width />
          </q-tr>
        </template>
        <template #body="props">
          <q-tr :props="props" no-hover>
            <q-td auto-width>
              <q-btn
                color="secondary"
                round
                dense
                unelevated
                flat
                :icon="props.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="props.expand = !props.expand"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'name'">
                <router-link
                  :to="`/modules/${props.row.uid}`"
                  class="text-black text-weight-regular"
                >
                  {{ col.value }}
                </router-link>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
            <q-td auto-width>
              <q-btn
                icon="mdi-open-in-new"
                color="grey-color"
                flat
                round
                :to="`/modules/${props.row.uid}`"
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Open
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="authStore.isAdmin"
                icon="mdi-pencil"
                color="grey-color"
                flat
                round
                @click="
                  moduleToUpdate = props.row;
                  editModuleDialog = true;
                "
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Edit
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="authStore.isAdmin"
                icon="mdi-trash-can-outline"
                color="grey-color"
                flat
                round
                @click="
                  moduleToUpdate = props.row;
                  deleteModuleDialog = true;
                "
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Delete
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>

          <q-tr class="bg-grey-1 no-height" :props="props">
            <q-td colspan="100%" class="no-height" no-hover>
              <q-slide-transition :duration="250">
                <div v-show="props.expand">
                  <DevicesInModuleTable
                    v-model="props.row.devices"
                    :module="props.row"
                    class="q-pa-md"
                    @on-change="getCollection"
                  />
                </div>
              </q-slide-transition>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <CreateModuleDialog
      v-model="createModuleDialog"
      :collection="collection"
      @on-create="getCollection"
    />
    <DeleteConfirmationDialog
      v-if="moduleToUpdate"
      v-model="deleteModuleDialog"
      :item-uid="moduleToUpdate.uid"
      :delete-function="ModuleService.deleteModule"
      title="Delete Module"
      description="Are you sure you want to delete this module?"
      success-message="Module deleted successfully!"
      failed-message="Deleting module failed!"
      @on-deleted="onModuleDeleted"
    />
    <EditModuleDialog
      v-if="moduleToUpdate"
      v-model="editModuleDialog"
      :module="moduleToUpdate"
      @on-update="getCollection"
    />
  </div>
</template>

<script setup lang="ts">
import { Collection } from '@/models/Collection';
import { QTableProps } from 'quasar';
import { PropType, computed, ref } from 'vue';
import CreateModuleDialog from './CreateModuleDialog.vue';
import DeleteConfirmationDialog from '@/components/core/DeleteConfirmationDialog.vue';
import EditModuleDialog from './EditModuleDialog.vue';
import CollectionService from '@/services/CollectionService';
import DevicesInModuleTable from '@/components/modules/DevicesInModuleTable.vue';
import { handleError } from '@/utils/error-handler';
import { Module } from '@/models/Module';
import ModuleService from '@/services/ModuleService';
import { useAuthStore } from '@/stores/auth-store';

const props = defineProps({
  modelValue: {
    type: Object as PropType<Collection>,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();

const collection = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const createModuleDialog = ref(false);
const deleteModuleDialog = ref(false);
const editModuleDialog = ref(false);
const moduleToUpdate = ref<Module>();
async function onModuleDeleted() {
  await getCollection();
}

async function getCollection() {
  try {
    const updatedCollection = await CollectionService.getCollection(
      collection.value.uid,
    );
    collection.value = updatedCollection;
  } catch (error) {
    handleError(error, 'Getting collection failed!');
  }
}

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'devices',
    label: 'Devices',
    field: (row) => row.devices.length || 0,
    sortable: true,
    align: 'right',
  },
]);
</script>

<style lang="scss" scoped>
.modules-text {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  padding: 0;
  color: $secondary;
}

.no-height {
  height: 0px;
  padding: 0px;
}
</style>
