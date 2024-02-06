<template>
  <PageLayout :title="t('collection.label', 2)">
    <template #actions>
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('collection.create_collection')"
        :icon="mdiPlus"
        @click="createCollectionDialog = true"
      />
    </template>
    <template #default>
      <q-table
        :rows="collections.data"
        :columns="columns"
        :loading="collections.isLoading"
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
            <q-icon :name="mdiHubspot" class="q-mb-md" size="50px"></q-icon>
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
                :icon="props.expand ? mdiChevronUp : mdiChevronDown"
                @click="props.expand = !props.expand"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'name'">
                <router-link :to="`/collections/${props.row.uid}`" class="text-black text-weight-regular">
                  {{ col.value }}
                </router-link>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
            <q-td auto-width>
              <q-btn :icon="mdiOpenInNew" color="grey-color" flat round :to="`/collections/${props.row.uid}`"
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
                :icon="mdiTrashCanOutline"
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
                    class="q-pa-lg"
                    @update:model-value="updateCollection"
                    @on-update="collections.refresh"
                  />
                </div>
              </q-slide-transition>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </template>
  </PageLayout>
  <CreateCollectionDialog v-model="createCollectionDialog" @on-create="collections.refresh" />
  <EditCollectionDialog
    v-if="collectionToUpdate"
    v-model="editCollectionDialog"
    :collection="collectionToUpdate"
    @on-update="collections.refresh"
  />
  <DeleteCollectionDialog
    v-if="collectionToUpdate"
    v-model="deleteCollectionDialog"
    :collection="collectionToUpdate"
    @on-deleted="collections.refresh"
  />
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Collection } from '@/models/Collection';
import { computed, reactive, ref } from 'vue';
import CollectionService from '@/services/CollectionService';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog.vue';
import EditCollectionDialog from '@/components/collections/EditCollectionDialog.vue';
import ModulesTable from '@/components/modules/ModulesTable.vue';
import DeleteCollectionDialog from '@/components/collections/DeleteCollectionDialog.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiHubspot,
  mdiOpenInNew,
  mdiPencil,
  mdiPlus,
  mdiTrashCanOutline,
} from '@quasar/extras/mdi-v6';
import PageLayout from '@/layouts/PageLayout.vue';
import { useAsyncData } from '@/composables/useAsyncData';

const { t } = useI18n();

const authStore = useAuthStore();
const collections = reactive(
  useAsyncData(() => CollectionService.getCollections(), t('collection.toasts.load_failed')),
);

function updateCollection(collection: Collection) {
  if (!collections.data) return;
  const index = collections.data.findIndex((c) => c.uid === collection.uid);
  if (index === -1) return;
  collections.data[index] = collection;
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
    label: t('module.label', 2),
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
