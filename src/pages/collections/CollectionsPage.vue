<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Collections</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="primary"
          unelevated
          no-caps
          size="15px"
          label="Create Collection"
          icon="mdi-plus"
          @click="createCollectionDialog = true"
        />
      </div>
      <q-table
        :rows="collections"
        :columns="columns"
        :loading="isLoadingCollections"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        no-data-label="No Collections Yet"
        loading-label="Loading Collections..."
        rows-per-page-label="Collections per page"
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
              <q-btn
                @click="
                  collectionOperation = props.row;
                  editCollectionDialog = true;
                "
                icon="mdi-pencil"
                color="grey-color"
                flat
                round
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Edit
                </q-tooltip>
              </q-btn>
              <q-btn
                @click="
                  collectionOperation = props.row;
                  deleteCollectionDialog = true;
                "
                icon="mdi-trash-can-outline"
                color="grey-color"
                flat
                round
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  Delete
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" class="bg-grey-1" no-hover>
              <ModulesTable class="q-pa-md" v-model="props.row" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <CreateCollectionDialog
      v-model="createCollectionDialog"
      @onCreate="getCollections"
    />
    <DeleteCollectionDialog
      v-if="collectionOperation"
      v-model="deleteCollectionDialog"
      :collection="collectionOperation"
      @onDeleted="getCollections"
    />
    <EditCollectionDialog
      v-if="collectionOperation"
      v-model="editCollectionDialog"
      :collection="collectionOperation"
      @onUpdate="getCollections"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Collection } from '@/models/Collection';
import { ref } from 'vue';
import { handleError } from '@/utils/error-handler';
import CollectionService from '@/services/CollectionService';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog.vue';
import DeleteCollectionDialog from '@/components/collections/DeleteCollectionDialog.vue';
import EditCollectionDialog from '@/components/collections/EditCollectionDialog.vue';
import ModulesTable from '@/components/modules/ModulesTable.vue';

const collections = ref<Collection[]>([]);
const isLoadingCollections = ref(false);
async function getCollections() {
  try {
    isLoadingCollections.value = true;
    collections.value = await CollectionService.getCollections();
  } catch (error) {
    handleError(error, 'Loading collections failed!');
  } finally {
    isLoadingCollections.value = false;
  }
}
getCollections();

const createCollectionDialog = ref(false);
const deleteCollectionDialog = ref(false);
const editCollectionDialog = ref(false);
const collectionOperation = ref<Collection>();

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

<style lang="scss" scoped></style>
