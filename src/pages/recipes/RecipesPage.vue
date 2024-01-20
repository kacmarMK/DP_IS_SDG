<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Recipes</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="secondary"
          label="Create new recipe"
          unelevated
          no-caps
          size="15px"
          @click="store.createDialog = true"
        />
      </div>
      <q-table
        :rows="store.recipes"
        :columns="columns"
        :loading="store.isLoadingRecipes"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        no-data-label="No Recipes Found"
        loading-label="Loading Recipes..."
        rows-per-page-label="Recipes per page"
      >
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="data_object" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              icon="mdi-pencil"
              color="grey-color"
              flat
              round
              @click.stop="
                store.editDialog = true;
                //store.editingCommand = props.row;
                store.editRecipeId = props.row.value?.id;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="mdi-trash-can-outline"
              color="grey-color"
              flat
              round
              @click.stop="
                store.deleteDialog = true;
                store.deletingRecipe = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <create-recipe-dialog />
    <edit-recipe-dialog />
    <delete-recipe-dialog />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useRecipesStore } from '@/stores/recipes-store';
import CreateRecipeDialog from '@/components/recipes/CreateRecipeDialog.vue';
import EditRecipeDialog from '@/components/recipes/EditRecipeDialog.vue';
import DeleteRecipeDialog from '@/components/recipes/DeleteRecipeDialog.vue';
import { computed } from 'vue';

const store = useRecipesStore();
store.getRecipes();

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'cmds',
    label: 'Commands',
    field: 'cmds',
    sortable: false,
    align: 'left',
  },
  {
    name: 'subRecipes',
    label: 'Subrecipes',
    field: 'subRecipes',
    sortable: false,
    align: 'left',
  },
  {
    name: 'deviceType',
    label: 'Device Type',
    field: 'deviceType',
    sortable: true,
    align: 'left',
  },
  {
    name: 'hasSubRecipes',
    label: 'Has Subrecipes?',
    field: 'hasSubRecipes',
    sortable: false,
    align: 'left',
  },
  {
    name: 'deactivated',
    label: 'Command Deactivated?',
    field: 'deactivated',
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
<style lang="scss" scoped></style>
