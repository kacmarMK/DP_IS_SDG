import { defineStore } from 'pinia';
import { Command } from 'src/models/Command';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import commandService from 'src/services/CommandService';

export const useCommandsStore = defineStore('commands', () => {
  return {};
});
