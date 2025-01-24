export interface TransformerConfig {
  input: string;
  output: string;
  operation: string;
  options?: Record<string, any>;
}

export interface TransformerInterface {
  transform(data: Record<string, any>, config: TransformerConfig): Promise<Record<string, any>>;
}
