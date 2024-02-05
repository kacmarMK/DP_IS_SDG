<template>
  <PageLayout :title="t('recipe.label', 2)">
    <template #actions>
      <q-btn
        class="shadow"
        color="primary"
        :icon="mdiPlus"
        :label="t('recipe.create_recipe')"
        unelevated
        no-caps
        size="15px"
      />
    </template>
    <template #default>
      <q-table
        :rows="store.recipes"
        :columns="columns"
        :loading="store.isLoadingRecipes"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        :no-data-label="t('table.no_data_label')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
      >
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon :name="mdiCodeTags" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn :icon="mdiPencil" color="grey-color" flat round
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.edit') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              :icon="mdiTrashCanOutline"
              color="grey-color"
              flat
              round
              @click.stop="
                deleteDialogOpen = true;
                recipeToDelete = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.delete') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>
  </PageLayout>
  <DeleteRecipeDialog
    v-if="recipeToDelete"
    v-model="deleteDialogOpen"
    :recipe="recipeToDelete"
    @on-delete="store.getRecipes()"
  />
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiCodeTags, mdiPencil, mdiTrashCanOutline } from '@quasar/extras/mdi-v6';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import { useRecipeStore } from '@/stores/recipe-store';
import { Recipe } from '@/models/Recipe';
import DeleteRecipeDialog from '@/components/recipes/DeleteRecipeDialog.vue';
import PageLayout from '@/layouts/PageLayout.vue';

const { t } = useI18n();
const store = useRecipeStore();
store.getRecipes();

const deleteDialogOpen = ref(false);
const recipeToDelete = ref<Recipe>();

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'subrecipe',
    label: t('recipe.subrecipe'),
    field: 'subRecipe',
    sortable: true,
    align: 'left',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
]);
</script>
