import React from 'react';
import { Home, Users, Share2, FileText, Globe, MoreHorizontal, BookOpen, HelpCircle, Bell } from 'lucide-react';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#7B68EE] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 space-y-6">
          {/* Organization Section */}
          <div>
            <div className="text-xs font-semibold text-white/70 uppercase mb-2">MY ORGANIZATION</div>
            <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded">
              <Home size={20} />
              <span>Organization</span>
            </button>
          </div>

          {/* Team Section */}
          <div>
            <div className="text-xs font-semibold text-white/70 uppercase mb-2">MY TEAM</div>
            <div className="space-y-1">
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
        </div>

        {/* Bottom Links */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="bg-white h-full rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#7B68EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-500">Click to create a new scenario</p>
            </div>
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="h-16 border-t border-gray-200 px-6 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">Ready to start</span>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Run Once
          </button>
        </div>
      </div>
    </div>
  );
};
