import { WorkflowManager } from './core/WorkflowManager';
import { WorkflowDefinition } from './core/types/workflow';

// Create a sample workflow with triggers
const sampleWorkflow: WorkflowDefinition = {
  id: 'workflow1',
  name: 'Sample Workflow with Triggers',
  description: 'A sample workflow with schedule and webhook triggers',
  triggers: [
    {
      id: 'schedule1',
      type: 'schedule',
      config: {
        schedule: '*/5 * * * *'  // Every 5 minutes
      }
    },
    {
      id: 'webhook1',
      type: 'webhook',
      config: {
        path: '/trigger/workflow1',
        method: 'POST'
      }
    }
  ],
  tasks: [
    {
      id: 'task1',
      name: 'First Task',
      type: 'process',
      config: {
        operation: 'start'
      }
    },
    {
      id: 'task2A',
      name: 'Parallel Task A',
      type: 'process',
      config: {
        operation: 'process'
      },
      dependencies: ['task1']
    },
    {
      id: 'task2B',
      name: 'Parallel Task B',
      type: 'process',
      config: {
        operation: 'process'
      },
      dependencies: ['task1']
    },
    {
      id: 'task3',
      name: 'Final Task',
      type: 'process',
      config: {
        operation: 'end'
      },
      dependencies: ['task2A', 'task2B']
    }
  ]
};

async function testWorkflow() {
  console.log('Creating workflow manager...');
  const manager = new WorkflowManager();

  console.log('Registering workflow...');
  await manager.registerWorkflow(sampleWorkflow);

  // Test schedule trigger
  console.log('Testing schedule trigger...');
  await manager.handleTrigger({
    workflowId: 'workflow1',
    triggerType: 'schedule',
    timestamp: Date.now(),
    payload: { schedule: '*/5 * * * *' }
  });

  // Test webhook trigger
  console.log('\nTesting webhook trigger...');
  await manager.handleTrigger({
    workflowId: 'workflow1',
    triggerType: 'webhook',
    timestamp: Date.now(),
    payload: { data: 'test webhook data' }
  });
}

testWorkflow().catch(console.error);
