import React, { useState } from 'react';
import { apps, AppDefinition } from './appDefinitions';
import { Search } from 'lucide-react';

interface AppListProps {
  onSelectApp: (app: AppDefinition) => void;
}

export const AppList: React.FC<AppListProps> = ({ onSelectApp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">ALL APPS</h2>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search apps or modules"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredApps.map((app) => (
          <div 
            key={app.id}
            onClick={() => onSelectApp(app)}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className={`w-8 h-8 ${app.color} rounded-lg flex items-center justify-center text-white font-medium text-sm`}>
              {app.icon}
            </div>
            <div>
              <span className="text-sm text-gray-700 font-medium">{app.name}</span>
              <p className="text-xs text-gray-500">{app.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
