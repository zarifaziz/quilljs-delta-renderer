export interface QuillDelta {
  ops: Array<{
    insert?: string | object;
    delete?: number;
    retain?: number;
    attributes?: Record<string, any>;
  }>;
}

export interface AppState {
  deltaInput: string;
  isValidJson: boolean;
  currentDelta: QuillDelta | null;
  errorMessage: string | null;
}

export interface DeltaOp {
  insert?: string | object;
  delete?: number;
  retain?: number;
  attributes?: Record<string, any>;
} 