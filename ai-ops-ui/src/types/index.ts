// Domain Types for AI Operations Platform

export type RunStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'PAUSED' | 'RETRYING' | 'TIMED_OUT' | 'SKIPPED';

export type ValidationStatus = 'PASS' | 'WARN' | 'FAIL';

export type ModelStage = 'dev' | 'staging' | 'production' | 'archived';

export type TriggerType = 'manual' | 'cron' | 'event';

export type ConnectionType = 's3' | 'minio' | 'postgres' | 'mysql' | 'kafka' | 'api' | 'file';

export type DomainType = 'cv' | 'llm' | 'audio' | 'multimodal' | 'timeseries' | 'common';

export interface Pipeline {
  id: string;
  name: string;
  owner: string;
  lastRun?: Date;
  successRate: number;
  nextSchedule?: Date;
  updatedAt: Date;
  tags: string[];
  isScheduleEnabled: boolean;
  domain: DomainType;
}

export interface Run {
  id: string;
  pipelineId: string;
  pipelineName: string;
  trigger: TriggerType;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  status: RunStatus;
  cost?: number;
  initiator: string;
  tags: string[];
}

export interface Task {
  id: string;
  runId: string;
  nodeName: string;
  status: RunStatus;
  startedAt?: Date;
  endedAt?: Date;
  retryCount: number;
  resourceProfile: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  owner: string;
  domain: DomainType;
  tags: string[];
  latestVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatasetVersion {
  id: string;
  datasetId: string;
  version: string;
  createdAt: Date;
  size: string;
  rowCount: number;
  hash: string;
  sourceConnection: string;
}

export interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  endpoint: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastTestedAt?: Date;
}

export interface Experiment {
  id: string;
  name: string;
  owner: string;
  runsCount: number;
  bestMetric: number;
  metricName: string;
  lastUpdated: Date;
}

export interface Model {
  id: string;
  name: string;
  latestVersion: string;
  stage: ModelStage;
  owner: string;
  lastEvalScore: number;
  createdAt: Date;
  updatedAt: Date;
  domain: DomainType;
}

export interface ModelVersion {
  id: string;
  modelId: string;
  version: string;
  sourceRunId: string;
  stage: ModelStage;
  createdAt: Date;
  artifacts: string[];
  evalScore?: number;
}

export interface Deployment {
  id: string;
  name: string;
  modelVersion: string;
  endpoint: string;
  status: 'running' | 'stopped' | 'deploying' | 'failed';
  replicas: number;
  latency: number;
  throughput: number;
  createdAt: Date;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'resolved';
  source: string;
  createdAt: Date;
  message: string;
}

export interface ResourceProfile {
  id: string;
  name: string;
  cpu: string;
  memory: string;
  gpu?: string;
  storage: string;
  isSpot: boolean;
}

export interface ValidationReport {
  id: string;
  datasetVersionId: string;
  status: ValidationStatus;
  createdAt: Date;
  checks: ValidationCheck[];
}

export interface ValidationCheck {
  name: string;
  status: ValidationStatus;
  message: string;
  value?: number;
  threshold?: number;
}
