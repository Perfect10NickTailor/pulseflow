export interface Position {
  x: number;
  y: number;
}

export interface FlowNode {
  id: string;
  type: string;
  position: Position;
  data: {
    name: string;
    icon: string;
    color: string;
    [key: string]: any;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
}
