export interface TaskNode {
  id: string;
  dependencies: string[];
  executed: boolean;
  running: boolean;
  error?: Error;
}

export interface ExecutionGraph {
  nodes: Map<string, TaskNode>;
  ready: string[];
  completed: string[];
  failed: string[];
}

export interface SchedulerConfig {
  maxConcurrent?: number;
  timeout?: number;
}
