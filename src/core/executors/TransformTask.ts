import { TaskDefinition } from '../../types/workflow';
import { DataTransformer } from '../transformers/DataTransformer';

export class TransformTask {
  private transformer: DataTransformer;

  constructor() {
    this.transformer = new DataTransformer();
  }

  async execute(task: TaskDefinition, data: Record<string, any>): Promise<Record<string, any>> {
    const { transformations } = task.config;

    let currentData = { ...data };

    for (const transformation of transformations) {
      currentData = await this.transformer.transform(currentData, transformation);
    }

    return currentData;
  }
}
