import React, { useState } from 'react';
import { Plus, Clock, Monitor, Wrench, RotateCw, Play } from 'lucide-react';
import { FlowNode } from './nodes/FlowNode';
import { Connections } from './Connections';
import { NodeSelector } from './NodeSelector';
import type { FlowNode as FlowNodeType, Position, Connection } from './types';
import { apps } from '../apps/appDefinitions';

export const FlowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<FlowNodeType[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingConnection, setPendingConnection] = useState<{ nodeId: string; type: 'input' | 'output' } | null>(null);
  const [showNodeSelector, setShowNodeSelector] = useState(false);

  const handleAddNode = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    const newNode: FlowNodeType = {
      id: `node-${nodes.length + 1}`,
      type: app.id,
      position: { x: 400, y: 300 },
      data: {
        name: app.name,
        icon: app.icon,
        color: app.color,
        description: app.description
      }
    };

    setNodes([...nodes, newNode]);
    setShowNodeSelector(false);
  };

  // ... rest of the component remains the same ...

  return (
    <div className="relative flex flex-col h-full">
      {/* Canvas */}
      <div className="flex-1 bg-gray-50 relative overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Connections */}
        <Connections connections={connections} nodes={nodes} />

        {/* Nodes */}
        {nodes.map((node) => (
          <FlowNode 
            key={node.id} 
            node={node} 
            onConnect={handleConnect}
            onNodeDrag={handleNodeDrag}
          />
        ))}

        {/* Add node button (centered) */}
        {nodes.length === 0 && (
          <button 
            onClick={() => setShowNodeSelector(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#7B68EE] hover:bg-[#6c5ce7] text-white flex items-center justify-center transition-colors shadow-lg"
          >
            <Plus size={40} />
          </button>
        )}

        {/* Node Selector */}
        {showNodeSelector && (
          <NodeSelector
            onSelect={handleAddNode}
            onClose={() => setShowNodeSelector(false)}
          />
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="h-16 border-t border-gray-200 bg-white px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5">
            <Clock size={16} className="text-gray-600 mr-2" />
            <span className="text-sm text-gray-600">Every 15 minutes</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Monitor size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Wrench size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <RotateCw size={20} className="text-gray-600" />
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <Play size={16} className="mr-2" />
            <span>Run Once</span>
          </button>
        </div>
      </div>
    </div>
  );
};
