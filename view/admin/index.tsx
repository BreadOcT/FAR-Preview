
import React, { useState } from 'react';
import { Menu, Search, Bell, Shield, LogOut, BarChart2, Users, AlertTriangle, Truck, TrendingUp, Settings, Megaphone, Layout, Crown } from 'lucide-react';
import { Overview } from './components/Overview';
import { Community } from './components/Community';
import { Moderation } from './components/Moderation';
import { Distribution } from './components/Distribution';
import { Impact } from './components/Impact';
import { Communication } from './components/Communication';
import { ContentCMS } from './components/ContentCMS';
import { SystemConfig } from './components/SystemConfig';
import { AdminList } from './components/AdminList';

interface AdminIndexProps {
  role: 'super_admin' | 'admin_manager';
  onLogout: () => void;
}

export const AdminIndex: React.FC<AdminIndexProps> = ({ role, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
      <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === id ? 'bg-orange-500/10 text-orange-500' : 'text-stone-400 hover:bg-stone-800'}`}>
          <Icon className="w-5 h-5" />
          {isSidebarOpen && <span className="text-sm font-bold">{label}</span>}
      </button>
  );

  return (
    <div className="flex h-screen bg-[#FDFBF7] dark:bg-stone-950 overflow-hidden font-sans">
      <aside className={`fixed top-0 left-0 h-full bg-[#1c1917] z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r border-stone-800`}>
          <div className="h-20 flex items-center justify-center border-b border-stone-800 bg-[#151312]">
              {isSidebarOpen ? <h1 className="text-white font-bold text-lg">ADMIN <span className="text-orange-500">PANEL</span></h1> : <Shield className="w-8 h-8 text-orange-500" />}
          </div>
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
              <SidebarItem icon={BarChart2} label="Dashboard" id="overview" />
              <SidebarItem icon={Users} label="Komunitas" id="community" />
              <SidebarItem icon={AlertTriangle} label="Moderasi" id="moderation" />
              <SidebarItem icon={Truck} label="Distribusi" id="distribution" />
              <SidebarItem icon={TrendingUp} label="Dampak" id="impact" />
              <SidebarItem icon={Megaphone} label="Komunikasi" id="communication" />
              <SidebarItem icon={Layout} label="Konten CMS" id="content" />
              {role === 'super_admin' && (
                <>
                  <div className="my-2 border-t border-stone-800 mx-2"></div>
                  <SidebarItem icon={Crown} label="Admin List" id="admins" />
                  <SidebarItem icon={Settings} label="System" id="system" />
                </>
              )}
          </nav>
          <div className="p-4 border-t border-stone-800"><button onClick={onLogout} className="flex items-center gap-3 text-stone-500 hover:text-red-500 w-full"><LogOut className="w-5 h-5" /> {isSidebarOpen && "Keluar"}</button></div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col h-full`}>
          <header className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sticky top-0 z-40">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-stone-100 rounded-lg"><Menu className="w-5 h-5" /></button>
              <div className="flex items-center gap-4">
                  <div className="relative hidden md:block"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm w-64" /></div>
                  <button className="p-2 rounded-full hover:bg-stone-100"><Bell className="w-5 h-5" /></button>
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">A</div>
              </div>
          </header>
          <div className="flex-1 overflow-y-auto p-8">
              {activeTab === 'overview' && <Overview />}
              {activeTab === 'community' && <Community />}
              {activeTab === 'moderation' && <Moderation />}
              {activeTab === 'distribution' && <Distribution />}
              {activeTab === 'impact' && <Impact />}
              {activeTab === 'communication' && <Communication />}
              {activeTab === 'content' && <ContentCMS />}
              {activeTab === 'admins' && (role === 'super_admin' ? <AdminList /> : <div className="text-center py-20 text-stone-500">Access Denied</div>)}
              {activeTab === 'system' && (role === 'super_admin' ? <SystemConfig /> : <div className="text-center py-20 text-stone-500">Access Denied</div>)}
          </div>
      </main>
    </div>
  );
};
