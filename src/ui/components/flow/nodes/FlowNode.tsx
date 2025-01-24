import React from 'react';
import Draggable from 'react-draggable';
import { FlowNode as FlowNodeType } from '../types';

interface FlowNodeProps {
  node: FlowNodeType;
  onConnect?: (nodeId: string, type: 'input' | 'output') => void;
  onNodeDrag?: (nodeId: string, position: { x: number; y: number }) => void;
}

export const FlowNode: React.FC<FlowNodeProps> = ({ node, onConnect, onNodeDrag }) => {
  const handleDrag = (e: any, data: { x: number; y: number }) => {
    onNodeDrag?.(node.id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={{ x: node.position.x, y: node.position.y }}
      onDrag={handleDrag}
      bounds="parent"
      grid={[20, 20]}
    >
      <div className="absolute cursor-move bg-white rounded-lg shadow-lg w-48 p-2 select-none">
        {/* Input connection point */}
        <div className="absolute -left-2 top-1/2 transform -translate-x-full -translate-y-1/2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onConnect?.(node.id, 'input');
            }}
            className="w-4 h-4 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer"
          />
        </div>

        {/* Node content */}
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${node.data.color} rounded-lg flex items-center justify-center text-white`}>
            {node.data.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{node.data.name}</div>
            <div className="text-xs text-gray-500">{node.type}</div>
          </div>
        </div>

        {/* Output connection point */}
        <div className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onConnect?.(node.id, 'output');
            }}
            className="w-4 h-4 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer"
          />
        </div>
      </div>
    </Draggable>
  );
};
