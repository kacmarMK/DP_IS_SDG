import { defineStore } from 'pinia';
import { Command, CommandFrame } from 'src/models/Command';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import commandService from 'src/services/CommandService';
import { useI18n } from 'vue-i18n';

export const useCommandsStore = defineStore('commands', () => {
  const commands = ref<Command[]>([]);
  const isLoadingCommands = ref(false);
  const { t } = useI18n();
  async function getCommands() {
    try {
      isLoadingCommands.value = true;
      commands.value = await commandService.getCommands('none', 'none');
    } catch (error) {
      console.log(error);
      toast.error(t('command.toasts.load_failed'));
    } finally {
      isLoadingCommands.value = false;
    }
  }

  const createDialog = ref(false);
  const commandCreate = ref<CommandFrame>({
    name: '',
    params: [], // TODO
    deviceType: undefined,
    createdAt: 0,
    deactivated: false,
  });
  const isCreatingCommand = ref(false);
  async function createCommand() {
    try {
      isCreatingCommand.value = true;
      await commandService.createCommand(commandCreate.value);
      toast.success(t('command.toasts.create_success'));
      getCommands();
      createDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error(t('command.toasts.create_failed'));
    } finally {
      isCreatingCommand.value = false;
    }
  }

  const editDialog = ref(false);
  const isEditingCommand = ref(false);
  const editedCommand = ref<Command>({
    id: '',
    name: '',
    params: [], // TODO
    deviceType: undefined,
    createdAt: 0,
    deactivated: false,
  });
  const editCommandId = ref<string>();
  async function editCommand() {
    try {
      isEditingCommand.value = true;
      await commandService.updateCommand(
        editedCommand.value,
        editedCommand.value.id,
      );
      toast.success(t('command.toasts.update_success'));
      getCommands();
      editDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error(t('command.toasts.update_failed'));
    } finally {
      isEditingCommand.value = false;
    }
  }

  const deleteDialog = ref(false);
  const isDeletingCommand = ref(false);
  const deletingCommand = ref<Command>();
  async function deleteCommand() {
    const deletingCommandId = deletingCommand.value?.id;
    if (!deletingCommandId) {
      return;
    }
    try {
      isDeletingCommand.value = true;
      await commandService.deleteCommand(deletingCommandId);
      toast.success(t('command.toasts.delete_success'));
      getCommands();
      deleteDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error(t('command.toasts.delete_failed'));
    } finally {
      isDeletingCommand.value = false;
    }
  }

  return {
    commands,
    isLoadingCommands,
    getCommands,
    createDialog,
    commandCreate,
    isCreatingCommand,
    createCommand,
    editDialog,
    isEditingCommand,
    editedCommand,
    editCommandId,
    editCommand,
    deleteDialog,
    isDeletingCommand,
    deletingCommand,
    deleteCommand,
  };
});
