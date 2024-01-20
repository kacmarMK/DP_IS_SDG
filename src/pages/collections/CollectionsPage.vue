<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">{{ t('collection.title', 2) }}</p>
        <q-space></q-space>
        <q-btn
          v-if="authStore.isAdmin"
          class="shadow"
          color="primary"
          unelevated
          no-caps
          size="15px"
          :label="t('collection.create_collection')"
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
        :no-data-label="t('table.no_data_label')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
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
                  :to="`/collections/${props.row.uid}`"
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
                :to="`/collections/${props.row.uid}`"
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  {{ t('global.open') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="authStore.isAdmin"
                icon="mdi-pencil"
                color="grey-color"
                flat
                round
                @click="
                  collectionToUpdate = props.row;
                  editCollectionDialog = true;
                "
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  {{ t('global.edit') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="authStore.isAdmin"
                icon="mdi-trash-can-outline"
                color="grey-color"
                flat
                round
                @click="
                  collectionToUpdate = props.row;
                  deleteCollectionDialog = true;
                "
                ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                  {{ t('global.delete') }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
          <q-tr class="bg-grey-1 no-height" :props="props">
            <q-td colspan="100%" class="no-height" no-hover>
              <q-slide-transition :duration="250">
                <div v-show="props.expand">
                  <ModulesTable
                    v-model="props.row"
                    class="q-pa-md"
                    @update:model-value="updateCollection"
                  />
                </div>
              </q-slide-transition>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <CreateCollectionDialog
      v-model="createCollectionDialog"
      @on-create="getCollections"
    />
    <DeleteConfirmationDialog
      v-if="collectionToUpdate"
      v-model="deleteCollectionDialog"
      :item-uid="collectionToUpdate.uid"
      :delete-function="CollectionService.deleteCollection"
      :title="t('collection.delete_collection')"
      :description="t('collection.delete_collection_desc')"
      :success-message="t('collection.toasts.delete_success')"
      :failed-message="t('collection.toasts.delete_failed')"
      @on-deleted="getCollections"
    />
    <EditCollectionDialog
      v-if="collectionToUpdate"
      v-model="editCollectionDialog"
      :collection="collectionToUpdate"
      @on-update="getCollections"
    />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Collection } from '@/models/Collection';
import { computed, ref } from 'vue';
import { handleError } from '@/utils/error-handler';
import CollectionService from '@/services/CollectionService';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog.vue';
import EditCollectionDialog from '@/components/collections/EditCollectionDialog.vue';
import ModulesTable from '@/components/modules/ModulesTable.vue';
import DeleteConfirmationDialog from '@/components/core/DeleteConfirmationDialog.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const authStore = useAuthStore();

const collections = ref<Collection[]>([]);
const isLoadingCollections = ref(false);

async function getCollections() {
  try {
    isLoadingCollections.value = true;
    collections.value = await CollectionService.getCollections();
  } catch (error) {
    handleError(error, t('collection.toasts.load_failed'));
  } finally {
    isLoadingCollections.value = false;
  }
}
getCollections();

function updateCollection(collection: Collection) {
  const index = collections.value.findIndex((c) => c.uid === collection.uid);
  if (index === -1) return;
  collections.value[index] = collection;
}

const createCollectionDialog = ref(false);
const deleteCollectionDialog = ref(false);
const editCollectionDialog = ref(false);
const collectionToUpdate = ref<Collection>();

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'modules',
    label: t('module.title', 2),
    field: (row) => row.modules.length || 0,
    sortable: true,
    align: 'right',
  },
]);
</script>

<style lang="scss" scoped>
.no-height {
  height: 0px;
  padding: 0px;
}
</style>
