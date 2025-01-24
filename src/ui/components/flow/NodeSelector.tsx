import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { AppDefinition, getAllApps, categories, getAppsByCategory } from '../apps/appDefinitions';

interface NodeSelectorProps {
  onSelect: (appId: string) => void;
  onClose: () => void;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredApps = getAllApps().filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="relative z-50 flex items-center space-x-4">
        {/* Categories */}
        <div className="bg-white rounded-lg shadow-xl p-4 w-48">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Categories</h3>
          <div className="space-y-1">
            {Object.entries(categories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === value ? null : value)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  value === selectedCategory
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-[#7B68EE] flex items-center justify-center shadow-xl">
            <Plus size={48} className="text-white" />
          </div>
        </div>

        {/* Apps List */}
        <div className="bg-white rounded-lg shadow-xl w-96">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-600">ALL APPS</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search apps or modules"
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelect(app.id)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className={`w-8 h-8 ${app.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {app.logoUrl ? (
                    <img 
                      src={app.logoUrl} 
                      alt={app.name}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    app.icon
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{app.displayName}</div>
                  <div className="text-xs text-gray-500">{app.description}</div>
                </div>
                <div className="ml-auto">
                  <Plus size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
