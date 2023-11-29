import { defineStore } from 'pinia';
import { Command, CommandFrame } from 'src/models/Command';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import commandService from 'src/services/CommandService';

export const useCommandsStore = defineStore('commands', () => {
  const commands = ref<Command[]>([]);
  const isLoadingCommands = ref(false);
  async function getCommands() {
    try {
      isLoadingCommands.value = true;
      commands.value = await commandService.getCommands('none', 'none');
    } catch (error) {
      console.log(error);
      toast.error('Loading of commands failed.');
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
      toast.success('Command created.');
      getCommands();
      createDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Command creation failed.');
    } finally {
      isCreatingCommand.value = false;
    }
  }

  const editDialog = ref(false);
  const isEditingCommand = ref(false);
  const editingCommand = ref<CommandFrame>({
    name: '',
    params: [], // TODO
    deviceType: undefined,
    createdAt: 0,
    deactivated: false,
  });
  const editCommandId = ref<string>();
  async function editCommand() {
    const editingCommandId = editCommandId.value;
    if (!editingCommandId) {
      return;
    }
    try {
      isEditingCommand.value = true;
      await commandService.updateCommand(
        editingCommand.value,
        editingCommandId
      );
      toast.success('Command updated!');
      getCommands();
      editDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Command update failed!');
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
      toast.success('Command deleted!');
      getCommands();
      deleteDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Command deletion failed!');
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
    editingCommand,
    editCommandId,
    editCommand,
    deleteDialog,
    isDeletingCommand,
    deletingCommand,
    deleteCommand,
  };
});
