import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import { StoredResolvedScenario } from '@/models/StoredResolvedScenario';
import ScenarioService from '@/services/ScenarioService';
import StoredResolvedScenarioService from '@/services/StoredResolvedScenarioService';

export const useScenarioStore = defineStore('scenarios', () => {
  const { t } = useI18n();
  const scenarios = ref<Scenario[]>([]);
  const resolvedScenarios = ref<StoredResolvedScenario[]>([]);
  const isLoadingScenarios = ref(false);

  const mode = 'create';

  async function getScenarios() {
    try {
      isLoadingScenarios.value = true;
      scenarios.value = await ScenarioService.getScenarios();
    } catch (error) {
      console.log(error);
      toast.error(t('scenario.toasts.load_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }

  async function getActiveScenarios() {
    try {
      isLoadingScenarios.value = true;
      scenarios.value = await ScenarioService.getActiveScenarios();
    } catch (error) {
      console.log(error);
      toast.error(t('scenario.toasts.load_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }

  async function getScenariosWithMessage() {
    try {
      isLoadingScenarios.value = true;
      scenarios.value = await ScenarioService.getScenariosWithMessage();
    } catch (error) {
      console.log(error);
      toast.error(t('notification.toasts.load_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }

  async function getResolvedScenariosWithMessage() {
    try {
      isLoadingScenarios.value = true;
      resolvedScenarios.value = await StoredResolvedScenarioService.getStoredResolvedScenarioDataByMessageAction();
    } catch (error) {
      console.log(error);
      toast.error(t('notification.toasts.load_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }

  const scenarioPseudocode = ref('');
  const scenarioFrame = ref<ScenarioFrame>({
    rules: ' ',
    name: '',
    devices: [],
    deactivated: false,
    alreadyTriggered: false,
    mutedUntil: 0,
    activeAtDay: [],
    activeAtHour: [],
  });
  const isCreatingScenario = ref(false);
  async function createScenario() {
    try {
      isCreatingScenario.value = true;
      scenarioFrame.value.name.trim;
      // TODO remove
      scenarioFrame.value.activeAtHour = [];
      await ScenarioService.createScenario(scenarioFrame.value);
      toast.success(t('scenario.toasts.create_success'));
    } catch (error) {
      console.log(error);
      toast.error(t('scenario.toasts.create_failed'));
    } finally {
      isCreatingScenario.value = false;
    }
  }
  async function editScenario(editedScenario: Scenario) {
    try {
      isCreatingScenario.value = true;
      scenarioFrame.value.name.trim;
      await ScenarioService.editScenario(editedScenario);
      toast.success(t('scenario.toasts.update_success'));
    } catch (error) {
      console.log(error);
      toast.error(t('scenario.toasts.update_failed'));
    } finally {
      isCreatingScenario.value = false;
    }
  }

  async function muteScenario(scenarioID: string, minutes: number) {
    try {
      await ScenarioService.muteScenario(scenarioID, minutes);
      toast.success(t('scenario.toasts.update_success'));
    } catch (error) {
      console.log(error);
      toast.error(t('scenario.toasts.update_failed'));
    } finally {
    }
  }

  async function resolveScenario(scenarioId: string, scenarioLevelEnum: string) {
    try {
      isLoadingScenarios.value = true;
      await ScenarioService.resolveScenario(scenarioId, scenarioLevelEnum);
      toast.success(t('notification.toasts.processing_successful'));
    } catch (error) {
      console.log(error);
      toast.error(t('notification.toasts.proccessing_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }

  return {
    scenarios,
    resolveScenario,
    resolvedScenarios,
    isLoadingScenarios,
    scenarioFrame,
    getScenarios,
    createScenario,
    getActiveScenarios,
    mode,
    editScenario,
    scenarioPseudocode,
    muteScenario,
    getScenariosWithMessage,
    getResolvedScenariosWithMessage,
  };
});
