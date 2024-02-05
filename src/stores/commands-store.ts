import { defineStore } from 'pinia';
import { Command } from 'src/models/Command';
import { ref } from 'vue';
import commandService from 'src/services/CommandService';
import { useI18n } from 'vue-i18n';
import { handleError } from '@/utils/error-handler';

export const useCommandsStore = defineStore('commands', () => {
  const commands = ref<Command[]>([]);
  const isLoadingCommands = ref(false);
  const { t } = useI18n();
  async function getCommands() {
    try {
      isLoadingCommands.value = true;
      commands.value = await commandService.getCommands('none', 'none');
    } catch (error) {
      handleError(error, t('command.toasts.load_failed'));
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
