import React from 'react';
import { Connection, FlowNode } from './types';

interface ConnectionsProps {
  connections: Connection[];
  nodes: FlowNode[];
}

export const Connections: React.FC<ConnectionsProps> = ({ connections, nodes }) => {
  const getNodeCenter = (nodeId: string): { x: number; y: number } => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.position.x + 192, // Node width
      y: node.position.y,
    };
  };

  return (
    <svg className="absolute inset-0 pointer-events-none">
      {connections.map((connection) => {
        const source = getNodeCenter(connection.source);
        const target = getNodeCenter(connection.target);
        
        // Calculate control points for the curve
        const dx = target.x - source.x;
        const controlPoint1 = {
          x: source.x + dx * 0.5,
          y: source.y,
        };
        const controlPoint2 = {
          x: target.x - dx * 0.5,
          y: target.y,
        };

        return (
          <path
            key={connection.id}
            d={`M ${source.x},${source.y} C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${target.x},${target.y}`}
            stroke="#7B68EE"
            strokeWidth="2"
            fill="none"
          />
        );
      })}
    </svg>
  );
};
