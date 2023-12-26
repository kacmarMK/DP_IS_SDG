<template>
  <div>
    <div>
      <div class="q-mb-md row">
        <p class="modules-text">Modules</p>
        <q-space></q-space>
        <q-btn
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
        class="outline"
        :rows-per-page-options="[10, 20, 50]"
        no-data-label="No modules Yet"
        loading-label="Loading modules..."
        rows-per-page-label="Modules per page"
        row-key="uid"
      >
        <template v-slot:no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="mdi-hub-outline" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width />
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                color="secondary"
                round
                dense
                unelevated
                flat
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn icon="mdi-pencil" color="grey-color" flat round
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Edit
                </q-tooltip>
              </q-btn>
              <q-btn icon="mdi-trash-can-outline" color="grey-color" flat round
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Delete
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <!-- TODO: add devices -->
            <q-td colspan="100%">Module info {{ props.row.name }} </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <CreateModuleDialog
      v-model="createModuleDialog"
      :collection="collection"
      @onCreate="onCreateModule"
    />
  </div>
</template>

<script setup lang="ts">
import { Collection } from '@/models/Collection';
import { QTableProps } from 'quasar';
import { PropType, computed, defineProps, ref } from 'vue';
import CreateModuleDialog from './CreateModuleDialog.vue';
import CollectionService from '@/services/CollectionService';

const props = defineProps({
  modelValue: {
    type: Object as PropType<Collection>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const collection = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const createModuleDialog = ref(false);

async function onCreateModule() {
  try {
    const updatedCollection = await CollectionService.getCollection(
      collection.value.uid,
    );
    collection.value = updatedCollection;
  } catch (error) {
    console.log(error);
  }
}

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
];
</script>

<style lang="scss" scoped>
.outline {
  border: 1px solid #e0e0e0;
}

.modules-text {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  padding: 0;
  color: $secondary;
}
</style>
