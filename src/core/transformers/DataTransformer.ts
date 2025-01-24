import { TransformerInterface, TransformerConfig } from './TransformerInterface';

export class DataTransformer implements TransformerInterface {
  private transformers: Map<string, (value: any, options?: any) => any>;

  constructor() {
    this.transformers = new Map();
    this.registerDefaultTransformers();
  }

  private registerDefaultTransformers() {
    // String transformations
    this.transformers.set('toString', (value) => String(value));
    this.transformers.set('toUpperCase', (value) => String(value).toUpperCase());
    this.transformers.set('toLowerCase', (value) => String(value).toLowerCase());
    
    // Number transformations
    this.transformers.set('toNumber', (value) => Number(value));
    this.transformers.set('round', (value) => Math.round(Number(value)));
    this.transformers.set('floor', (value) => Math.floor(Number(value)));
    this.transformers.set('ceil', (value) => Math.ceil(Number(value)));
    
    // Array transformations
    this.transformers.set('toArray', (value) => Array.isArray(value) ? value : [value]);
    this.transformers.set('join', (value, options) => Array.isArray(value) ? value.join(options?.separator || ',') : value);
    
    // Object transformations
    this.transformers.set('pick', (value, options) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const result: Record<string, any> = {};
        options.fields.forEach((field: string) => {
          if (field in value) {
            result[field] = value[field];
          }
        });
        return result;
      }
      return value;
    });
  }

  registerTransformer(name: string, transformer: (value: any, options?: any) => any): void {
    this.transformers.set(name, transformer);
  }

  async transform(data: Record<string, any>, config: TransformerConfig): Promise<Record<string, any>> {
    const { input, output, operation, options } = config;
    const transformer = this.transformers.get(operation);

    if (!transformer) {
      throw new Error(`Transformer not found: ${operation}`);
    }

    try {
      const inputValue = input.split('.').reduce((obj, key) => obj?.[key], data);
      const transformedValue = transformer(inputValue, options);

      // Handle nested output paths
      const outputPath = output.split('.');
      const result = { ...data };
      let current = result;
      
      for (let i = 0; i < outputPath.length - 1; i++) {
        current[outputPath[i]] = current[outputPath[i]] || {};
        current = current[outputPath[i]];
      }
      
      current[outputPath[outputPath.length - 1]] = transformedValue;
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Unknown error during transformation';
      throw new Error(`Transformation failed: ${errorMessage}`);
    }
  }
}
