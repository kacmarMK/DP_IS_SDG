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
        <template v-slot:no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="data_object" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
      </q-table>
    </div>
    <create-recipe-dialog />
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useRecipesStore } from '../stores/recipes-store';
import CreateRecipeDialog from '../components/CreateRecipeDialog.vue';

const store = useRecipesStore();
store.getRecipes();

const columns: QTableProps['columns'] = [
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
];
</script>
<style lang="scss" scoped></style>
