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
      toast.error('Device creation failed.');
    } finally {
      isCreatingCommand.value = false;
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
  };
});
