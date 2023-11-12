import { api } from 'src/boot/ofetch';
import { Job, JobToRun } from 'src/models/Job';

class JobService {
  async getJobsOnDevice(deviceId: string): Promise<Job[]> {
    return await api<Job[]>(
      `/jobs/job/getAllJobsOnDevice/${deviceId}/NONE/NONE`
    );
  }

  async runJobFromRecipe(jobToRun: JobToRun): Promise<Job[]> {
    return await api<Job[]>(
      `jobs/job/runJobFromRecipe/${jobToRun.recipeId}/${jobToRun.deviceId}/${jobToRun.repetitions}/${jobToRun.scheduledDays}/${jobToRun.scheduledHour}/${jobToRun.scheduledMinute}`,
      {
        method: 'POST',
      }
    );
  }
}

export default new JobService();
