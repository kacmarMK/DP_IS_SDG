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

  return {
    commands,
    isLoadingCommands,
    getCommands,
  };
});
