import { JobStatus, JobType, ProductionJob } from '../../types';

export class JobService {
  static createJob(
    projectId: string,
    type: JobType,
    input: Record<string, any>,
    initialStatus: JobStatus = 'Queued'
  ): ProductionJob {
    return {
      id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId,
      type,
      status: initialStatus,
      input,
      progress: initialStatus === 'Processing' ? 10 : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static updateJobStatus(
    job: ProductionJob,
    status: JobStatus,
    output?: Record<string, any>,
    error?: string,
    progress?: number
  ): ProductionJob {
    return {
      ...job,
      status,
      output: output ?? job.output,
      error: error ?? job.error,
      progress: progress ?? (status === 'Ready' ? 100 : job.progress),
      updatedAt: new Date().toISOString(),
    };
  }
}
