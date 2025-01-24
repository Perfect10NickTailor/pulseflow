import React from 'react';
import { Home, Users, Share2, FileText, Globe, MoreHorizontal, BookOpen, Bell, HelpCircle } from 'lucide-react';
import { FlowBuilder } from '../components/flow/FlowBuilder';
import { AppList } from '../components/apps/AppList';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#7B68EE] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>

        <div className="flex-1 px-3">
          <div className="mb-8">
            <div className="text-xs font-semibold text-white/70 uppercase mb-2">My Organization</div>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <Home size={20} />
              <span>Organization</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-white/70 uppercase mb-2">My Team</div>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <Users size={20} />
              <span>Team</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-2 bg-white/20 rounded">
              <Share2 size={20} />
              <span>Scenarios</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <FileText size={20} />
              <span>Templates</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <Globe size={20} />
              <span>Connections</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <Share2 size={20} />
              <span>Webhooks</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <MoreHorizontal size={20} />
              <span>More</span>
            </button>
          </div>
        </div>

        <div className="p-3 space-y-1">
          <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
            <BookOpen size={20} />
            <span>Resource Hub</span>
          </button>
          <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
            <Bell size={20} />
            <span>Notifications</span>
          </button>
          <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
            <HelpCircle size={20} />
            <span>Help</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <FlowBuilder />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200">
          <AppList />
        </div>
      </div>
    </div>
  );
};
