
import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, FileText, CheckCircle, Clock, Shield, Users, 
  BarChart2, Settings, MessageSquare, LogOut, Search, MapPin, Menu, X,
  TrendingUp, Award, Leaf, Droplets, Globe, Crown, Lock, Truck, Ban, Save, Database, Activity,
  Megaphone, Layout, FilePlus, Edit, Trash2, ToggleLeft, ToggleRight, Radio, Crosshair, PieChart, Download, UploadCloud, Map, UserPlus, Eye, Send, Gift, Inbox, ChevronRight, ChevronDown, PlusCircle, Smartphone, Tablet, Monitor, CheckSquare, Square, Utensils, Smile, ArrowRight
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface AdminDashboardProps {
  role: 'super_admin' | 'admin_manager';
  onLogout: () => void;
}

// --- Data Types ---
interface AdminStat {
  label: string;
  value: string;
  subValue: string;
  icon: any;
  color: string;
}

interface UserData {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  points: number;
  joinDate: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_manager';
  permissions: string[];
  status: 'active' | 'suspended';
  lastLogin: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

interface ReportData {
  id: string;
  type: 'quality' | 'behavior';
  reporter: string;
  target: string;
  description: string;
  evidence?: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface DistributionTask {
    id: string;
    volunteer: string;
    from: string;
    to: string;
    status: 'picking_up' | 'delivering' | 'completed' | 'cancelled' | 'pending';
    startTime: string;
    priority?: 'normal' | 'urgent';
    distance: string;
}

interface Banner {
    id: string;
    title: string;
    status: 'active' | 'inactive';
    impressions: number;
    imageUrl?: string;
    description?: string;
}

interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  target: string;
  status: 'sent' | 'draft';
  sentAt: string;
  readCount: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  awardedTo: number;
}

interface NotificationItem {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    time: string;
}

// Helper Chart Component
const AdminBarChart = ({ data, labels, colorClass }: { data: number[], labels: string[], colorClass: string }) => {
    const max = Math.max(...data, 10);
    return (
      <div className="flex items-end gap-3 h-48 mt-6 w-full">
        {data.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
            <div className="relative w-full flex-1 flex items-end">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 ${colorClass} opacity-80 hover:opacity-100`} 
                  style={{ height: `${(val / max) * 100}%`, minHeight: '4px' }}
                ></div>
            </div>
            <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 mt-2 truncate">{labels[idx]}</p>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {val}
            </div>
          </div>
        ))}
      </div>
    );
};

// Helper Sidebar Item Component
const SidebarItem = ({ 
    icon: Icon, 
    label, 
    active, 
    onClick, 
    collapsed, 
    badge, 
    isLock 
  }: { 
    icon: any, 
    label: string, 
    active: boolean, 
    onClick: () => void, 
    collapsed: boolean, 
    badge?: number, 
    isLock?: boolean 
  }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative group ${active ? 'bg-orange-500/10 text-orange-500' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-300'} ${collapsed ? 'justify-center' : ''}`}
    >
      <div className="relative">
        <Icon className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-stone-400 group-hover:text-stone-300'}`} />
        {isLock && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-stone-600 bg-stone-900 rounded-full p-0.5" />}
      </div>
      
      {!collapsed && (
        <span className={`text-sm font-bold flex-1 text-left ${active ? 'text-orange-500' : ''}`}>
          {label}
        </span>
      )}
      
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
  
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-stone-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          {label}
        </div>
      )}
    </button>
  );

// Available Icons for Badge
const AVAILABLE_ICONS = [
    "⭐", "🌟", "✨", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️",
    "🌍", "🌎", "🌏", "🌱", "🌿", "🍀", "🍃", "🌳", "♻️",
    "🍎", "🍌", "🍇", "🥕", "🥦", "🌽", "🌶️", "🍄", "🍞",
    "🍔", "🍕", "🍱", "🍛", "🍜", "🍝", "🍲", "🥘", "🥗",
    "🚀", "🔥", "💧", "⚡", "❤️", "🧡", "💛", "💚", "💜",
    "🤝", "🤲", "🙌", "👋", "👍", "👏", "💪", "🙏", "🕊️",
    "📦", "🚚", "🏘️", "🏙️", "📢", "🔔", "🛡️", "👑", "💎"
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ role, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'community' | 'moderation' | 'distribution' | 'impact' | 'config' | 'admins' | 'communication' | 'content'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Modal States ---
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAssignVolunteerModal, setShowAssignVolunteerModal] = useState<string | null>(null); // Task ID
  
  // Badge Modal
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeForm, setBadgeForm] = useState<Badge>({ id: '', name: '', icon: '', description: '', awardedTo: 0 });
  const [isEditingBadge, setIsEditingBadge] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // --- Form States & UI States ---
  const [newAdminForm, setNewAdminForm] = useState({ id: '', name: '', email: '', role: 'admin_manager', permissions: [] as string[] });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  
  const [broadcastTab, setBroadcastTab] = useState<'compose' | 'history' | 'inbox'>('compose');
  
  // Content CMS States
  const [contentTab, setContentTab] = useState<'banners' | 'faq'>('banners');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '', category: 'Umum' });
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [selectedBannerId, setSelectedBannerId] = useState<string>('1');

  // Moderation States
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [moderationFilter, setModerationFilter] = useState<'all' | 'new' | 'investigating' | 'resolved'>('all');

  // Config States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [disableNewSignups, setDisableNewSignups] = useState(false);
  const [aiThreshold, setAiThreshold] = useState(85);

  // --- Mock Data ---
  const stats: AdminStat[] = [
    { label: "Total Penyelamatan", value: "12,450 kg", subValue: "+120kg hari ini", icon: Leaf, color: "bg-green-500" },
    { label: "Komunitas Aktif", value: "845", subValue: "45 relawan baru", icon: Users, color: "bg-blue-500" },
    { label: "Jejak Karbon (C02)", value: "-24.5 Ton", subValue: "Setara 400 pohon", icon: Globe, color: "bg-teal-500" },
    { label: "Laporan Masuk", value: "12", subValue: "3 Butuh tindakan", icon: AlertTriangle, color: "bg-red-500" }
  ];

  const [notificationsData, setNotificationsData] = useState<NotificationItem[]>([
      { id: '1', message: 'Laporan baru dari User A', type: 'warning', time: '5m' },
      { id: '2', message: 'System backup selesai', type: 'success', time: '1h' },
      { id: '3', message: 'User baru "Resto Padang" mendaftar', type: 'info', time: '2h' },
      { id: '4', message: 'Storage server mencapai 80%', type: 'warning', time: '5h' },
  ]);

  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'Restoran Berkah', role: 'Provider', email: 'resto@berkah.com', status: 'active', points: 1250, joinDate: 'Jan 2025' },
    { id: '2', name: 'Budi Santoso', role: 'Volunteer', email: 'budi@gmail.com', status: 'active', points: 3850, joinDate: 'Feb 2025' },
    { id: '3', name: 'Warung Tegal', role: 'Provider', email: 'warteg@bahari.com', status: 'pending', points: 0, joinDate: 'Baru Saja' },
    { id: '4', name: 'User Nakal', role: 'Receiver', email: 'nakal@fake.com', status: 'suspended', points: -50, joinDate: 'Dec 2024' },
  ]);

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'Super Admin', email: 'root@foodai.com', role: 'super_admin', permissions: ['all'], status: 'active', lastLogin: 'Baru Saja' },
    { id: '2', name: 'Ops Manager', email: 'ops@foodai.com', role: 'admin_manager', permissions: ['moderation', 'distribution'], status: 'active', lastLogin: '2 jam lalu' },
  ]);

  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: '2025-02-24 10:00', actor: 'System', action: 'Auto Backup', details: 'Database backup completed (2.4GB)', severity: 'info' },
    { id: '2', timestamp: '2025-02-24 09:45', actor: 'Budi (Vol)', action: 'Failed Login', details: '3 failed attempts from IP 192.168.1.1', severity: 'warning' },
    { id: '3', timestamp: '2025-02-24 08:30', actor: 'Super Admin', action: 'Config Change', details: 'Updated AI Threshold to 85%', severity: 'critical' },
  ]);

  const [reports, setReports] = useState<ReportData[]>([
    { id: '101', type: 'quality', reporter: 'Penerima A', target: 'Warung B', description: 'Makanan diterima dalam kondisi basi dan berbau tidak sedap.', status: 'new', date: '10:30 AM', priority: 'high' },
    { id: '102', type: 'behavior', reporter: 'Relawan X', target: 'Penerima Y', description: 'Penerima tidak muncul di lokasi penjemputan selama 30 menit.', status: 'investigating', date: 'Kemarin', priority: 'medium' },
    { id: '103', type: 'quality', reporter: 'Penerima Z', target: 'Bakery C', description: 'Roti kemasan rusak.', status: 'resolved', date: '15 Feb', priority: 'low' },
  ]);

  const [distributions, setDistributions] = useState<DistributionTask[]>([
      { id: 'TX-001', volunteer: 'Budi Santoso', from: 'Restoran Berkah', to: 'Panti Asuhan A', status: 'delivering', startTime: '10:00', priority: 'normal', distance: '1.2 km' },
      { id: 'TX-002', volunteer: 'Siti Aminah', from: 'Bakery Lezat', to: 'Posyandu Melati', status: 'picking_up', startTime: '10:15', priority: 'urgent', distance: '0.8 km' },
      { id: 'TX-003', volunteer: 'Belum Ditugaskan', from: 'Hotel Grand', to: 'Komunitas C', status: 'pending', startTime: '-', priority: 'normal', distance: '5.5 km' },
  ]);

  const [banners, setBanners] = useState<Banner[]>([
      { id: '1', title: 'Kampanye Ramadhan Berbagi', status: 'active', impressions: 12500, imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000', description: 'Mari berbagi kebahagiaan di bulan suci.' },
      { id: '2', title: 'Promo Poin Double Weekend', status: 'inactive', impressions: 4500, imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000', description: 'Dapatkan poin ganda setiap akhir pekan.' }
  ]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: '1', question: 'Bagaimana cara menjadi donatur?', answer: 'Daftar akun dan pilih role Provider...', category: 'Umum' },
    { id: '2', question: 'Apakah ada biaya?', answer: 'Tidak ada biaya sama sekali.', category: 'Umum' }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Climate Hero', icon: '🌍', description: 'Menyelamatkan 100kg+ CO2', awardedTo: 15 },
    { id: '2', name: 'Super Volunteer', icon: '🚀', description: 'Menyelesaikan 50 misi', awardedTo: 8 },
  ]);

  const [messages, setMessages] = useState<BroadcastMessage[]>([
    { id: '1', title: 'Update Sistem v2.0', content: 'Kami telah memperbarui sistem poin...', target: 'all', status: 'sent', sentAt: '20 Feb 2025', readCount: 850 },
  ]);

  // --- Handlers ---
  const handleUserAction = (action: 'suspend' | 'activate' | 'save_points') => {
      if (!selectedUser) return;
      let updatedUsers = users.map(u => {
          if (u.id === selectedUser.id) {
              if (action === 'suspend') return { ...u, status: 'suspended' as const };
              if (action === 'activate') return { ...u, status: 'active' as const };
              if (action === 'save_points') return { ...u, points: selectedUser.points };
          }
          return u;
      });
      setUsers(updatedUsers);
      setSelectedUser(null);
  };

  // Moderation Handlers
  const handleReportAction = (action: 'dismiss' | 'resolve' | 'ban_target') => {
      if (!selectedReport) return;
      setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r));
      if (action === 'ban_target') {
          alert(`User ${selectedReport.target} telah di-ban.`);
          // Optionally update User list too
          setUsers(users.map(u => u.name === selectedReport.target ? { ...u, status: 'suspended' } : u));
      }
      setSelectedReport(null);
  };

  const toggleReportSelection = (id: string) => {
      if (selectedReportIds.includes(id)) {
          setSelectedReportIds(selectedReportIds.filter(i => i !== id));
      } else {
          setSelectedReportIds([...selectedReportIds, id]);
      }
  };

  const handleBulkAction = () => {
      if (selectedReportIds.length === 0) return alert("Pilih laporan terlebih dahulu.");
      if (confirm(`Tandai ${selectedReportIds.length} laporan sebagai Resolved?`)) {
          setReports(reports.map(r => selectedReportIds.includes(r.id) ? { ...r, status: 'resolved' } : r));
          setSelectedReportIds([]);
          alert("Aksi massal berhasil dijalankan.");
      }
  };

  // Admin Handlers
  const handleAddAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditingAdmin && newAdminForm.id) {
          setAdmins(admins.map(a => a.id === newAdminForm.id ? { ...a, name: newAdminForm.name, email: newAdminForm.email, role: newAdminForm.role as any, permissions: newAdminForm.permissions } : a));
          alert("Data admin diperbarui!");
      } else {
          const newAdmin: AdminUser = {
              id: Date.now().toString(),
              name: newAdminForm.name,
              email: newAdminForm.email,
              role: newAdminForm.role as any,
              permissions: newAdminForm.permissions,
              status: 'active',
              lastLogin: '-'
          };
          setAdmins([...admins, newAdmin]);
          alert("Admin baru berhasil ditambahkan!");
      }
      setShowAddAdminModal(false);
      setNewAdminForm({ id: '', name: '', email: '', role: 'admin_manager', permissions: [] });
      setIsEditingAdmin(false);
  };

  const handleDeleteAdmin = (id: string) => {
      if (confirm('Apakah anda yakin ingin menghapus admin ini?')) {
          setAdmins(admins.filter(a => a.id !== id));
          alert("Admin dihapus.");
      }
  };

  const handleEditAdmin = (admin: AdminUser) => {
      setNewAdminForm({ id: admin.id, name: admin.name, email: admin.email, role: admin.role, permissions: admin.permissions });
      setIsEditingAdmin(true);
      setShowAddAdminModal(true);
  };

  // Badge Handlers
  const handleSaveBadge = () => {
      if (!badgeForm.name || !badgeForm.icon) return alert("Nama dan Ikon wajib diisi");
      if (isEditingBadge) {
          setBadges(badges.map(b => b.id === badgeForm.id ? badgeForm : b));
          alert("Badge diperbarui!");
      } else {
          setBadges([...badges, { ...badgeForm, id: Date.now().toString(), awardedTo: 0 }]);
          alert("Badge baru dibuat!");
      }
      setShowBadgeModal(false);
      setBadgeForm({ id: '', name: '', icon: '', description: '', awardedTo: 0 });
  };

  const handleEditBadge = (badge: Badge) => {
      setBadgeForm(badge);
      setIsEditingBadge(true);
      setShowBadgeModal(true);
  };

  const handleAssignVolunteer = (volunteerName: string) => {
      if (showAssignVolunteerModal) {
          setDistributions(distributions.map(d => d.id === showAssignVolunteerModal ? { ...d, volunteer: volunteerName, status: 'picking_up', startTime: 'Sekarang' } : d));
          setShowAssignVolunteerModal(null);
          alert(`Tugas berhasil diberikan kepada ${volunteerName}`);
      }
  };

  const togglePermission = (perm: string) => {
    if (newAdminForm.permissions.includes(perm)) {
        setNewAdminForm({ ...newAdminForm, permissions: newAdminForm.permissions.filter(p => p !== perm) });
    } else {
        setNewAdminForm({ ...newAdminForm, permissions: [...newAdminForm.permissions, perm] });
    }
  };

  // Dashboard Actions
  const handleViewReports = () => setActiveTab('moderation');
  const handleExportDaily = () => alert('Mengunduh Laporan Harian (CSV)...');
  
  // Community Actions
  const handleExportUsers = () => alert('Mengunduh Data User (CSV)...');
  const handleAddBadge = () => {
      setIsEditingBadge(false);
      setBadgeForm({ id: '', name: '', icon: '', description: '', awardedTo: 0 });
      setShowBadgeModal(true);
  };

  // Moderation Actions
  const handleFilterReports = () => {
      if (moderationFilter === 'all') setModerationFilter('new');
      else if (moderationFilter === 'new') setModerationFilter('investigating');
      else setModerationFilter('all');
  };

  // Impact Actions
  const handleExportImpactCSV = () => alert('Mengunduh Impact Data (CSV)...');
  const handleExportImpactPDF = () => alert('Mengunduh Impact Data (PDF)...');
  const handleGenerateReport = () => alert('Membuat Laporan CSR & ESG (PDF)...');

  // Broadcast Actions
  const handleSendBroadcast = () => {
      const newMsg: BroadcastMessage = {
          id: Date.now().toString(),
          title: 'Broadcast Baru',
          content: 'Konten pesan...',
          target: 'all',
          status: 'sent',
          sentAt: 'Baru saja',
          readCount: 0
      };
      setMessages([newMsg, ...messages]);
      setBroadcastTab('history');
      alert('Pesan broadcast telah dikirim!');
  };

  // Content Actions
  const handleUploadBanner = () => {
      // Simulate file picker
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  const newId = Date.now().toString();
                  setBanners([...banners, { id: newId, title: 'New Banner', status: 'active', impressions: 0, imageUrl: reader.result as string, description: 'Banner baru' }]);
                  setSelectedBannerId(newId);
                  alert('Banner berhasil diupload!');
              };
              reader.readAsDataURL(file);
          }
      };
      input.click();
  };

  const handleDeleteBanner = (id: string) => {
      if (confirm('Hapus banner ini?')) {
          setBanners(banners.filter(b => b.id !== id));
          if (selectedBannerId === id && banners.length > 1) {
              setSelectedBannerId(banners.find(b => b.id !== id)?.id || '');
          }
      }
  };

  const handleSaveFaq = () => {
      if (!faqForm.question || !faqForm.answer) return alert('Mohon isi pertanyaan dan jawaban');
      if (isEditingFaq) {
          setFaqs(faqs.map(f => f.id === faqForm.id ? faqForm : f));
          alert('FAQ diperbarui!');
      } else {
          setFaqs([...faqs, { id: Date.now().toString(), ...faqForm }]);
          alert('FAQ tersimpan!');
      }
      setFaqForm({ id: '', question: '', answer: '', category: 'Umum' });
      setIsEditingFaq(false);
  };

  const handleEditFaq = (faq: FAQ) => {
      setFaqForm(faq);
      setIsEditingFaq(true);
  };

  const handleDeleteFaq = (id: string) => {
      if (confirm('Hapus FAQ ini?')) {
          setFaqs(faqs.filter(f => f.id !== id));
      }
  };

  // Logs Actions
  const handleFilterLogs = () => {
      const filtered = logs.filter(l => l.severity === 'critical' || l.severity === 'warning');
      alert(`Filter diterapkan. Ditemukan ${filtered.length} logs critical/warning.`);
  };
  
  const handleExportLogs = () => {
      const csvContent = "data:text/csv;charset=utf-8," + logs.map(e => Object.values(e).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "system_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Logs diexport ke CSV");
  };

  // Config Action
  const handleSaveConfig = () => alert('Konfigurasi sistem berhasil disimpan!');
  const handleRotateKey = () => alert('API Key berhasil dirotasi. Service mungkin restart.');
  const handleForceBackup = () => alert('Backup database dimulai...');

  const renderSidebar = () => (
    <aside className={`fixed top-0 left-0 h-full bg-[#1c1917] text-stone-400 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r border-stone-800`}>
      <div className="h-20 flex items-center justify-center border-b border-stone-800 bg-[#151312]">
        {isSidebarOpen ? (
           <div className="flex items-center gap-2 animate-in fade-in">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-orange-900/50 shadow-lg">
                <Shield className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-white font-bold text-lg leading-none tracking-tight">ADMIN</h1>
                <span className="text-[9px] font-bold text-orange-500 tracking-[0.2em] uppercase">Panel Sosial</span>
             </div>
           </div>
        ) : (
          <Shield className="w-8 h-8 text-orange-500" />
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
        <SidebarItem icon={BarChart2} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} collapsed={!isSidebarOpen} />
        <SidebarItem icon={Users} label="Komunitas" active={activeTab === 'community'} onClick={() => setActiveTab('community')} collapsed={!isSidebarOpen} />
        <SidebarItem icon={AlertTriangle} label="Moderasi" active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} collapsed={!isSidebarOpen} badge={reports.filter(r => r.status === 'new').length} />
        <SidebarItem icon={Truck} label="Distribusi" active={activeTab === 'distribution'} onClick={() => setActiveTab('distribution')} collapsed={!isSidebarOpen} badge={distributions.filter(d => d.status === 'pending').length} />
        <SidebarItem icon={TrendingUp} label="Dampak Sosial" active={activeTab === 'impact'} onClick={() => setActiveTab('impact')} collapsed={!isSidebarOpen} />
        
        <div className={`my-4 border-t border-stone-800 ${!isSidebarOpen ? 'mx-2' : 'mx-4'}`}>
            {isSidebarOpen && <p className="text-[10px] font-bold text-stone-600 uppercase mt-4 mb-2">Manajemen</p>}
        </div>
        
        <SidebarItem icon={Megaphone} label="Komunikasi" active={activeTab === 'communication'} onClick={() => setActiveTab('communication')} collapsed={!isSidebarOpen} />
        <SidebarItem icon={Layout} label="Konten & CMS" active={activeTab === 'content'} onClick={() => setActiveTab('content')} collapsed={!isSidebarOpen} />
        
        {role === 'super_admin' && (
           <>
             <div className={`my-4 border-t border-stone-800 ${!isSidebarOpen ? 'mx-2' : 'mx-4'}`}>
                {isSidebarOpen && <p className="text-[10px] font-bold text-stone-600 uppercase mt-4 mb-2">System</p>}
             </div>
             <SidebarItem icon={Crown} label="Admin & Logs" active={activeTab === 'admins'} onClick={() => setActiveTab('admins')} collapsed={!isSidebarOpen} isLock />
             <SidebarItem icon={Settings} label="Konfigurasi" active={activeTab === 'config'} onClick={() => setActiveTab('config')} collapsed={!isSidebarOpen} isLock />
           </>
        )}
      </nav>

      <div className="p-4 border-t border-stone-800 bg-[#151312]">
        <button onClick={onLogout} className={`flex items-center gap-3 text-stone-500 hover:text-red-500 transition-colors w-full rounded-xl p-2 hover:bg-stone-800 ${!isSidebarOpen && 'justify-center'}`}>
           <LogOut className="w-5 h-5" />
           {isSidebarOpen && <span className="font-bold text-sm">Keluar Sistem</span>}
        </button>
      </div>
    </aside>
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-gradient-to-r from-orange-700 via-amber-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/10 relative overflow-hidden group">
          <div className="relative z-10">
             <h2 className="text-3xl font-black mb-2 tracking-tight">Halo, {role === 'super_admin' ? 'Super Admin' : 'Admin Pengelola'}!</h2>
             <p className="text-orange-100 max-w-xl font-medium">Sistem berjalan optimal. Hari ini ada <strong className="text-white bg-white/20 px-2 py-0.5 rounded">124kg</strong> makanan yang perlu diselamatkan.</p>
             <div className="flex gap-3 mt-6">
                <Button onClick={handleViewReports} className="w-auto bg-white text-orange-600 hover:bg-stone-100 border-0 h-10 text-sm">Lihat Laporan</Button>
                <Button onClick={handleExportDaily} variant="outline" className="w-auto border-white text-white hover:bg-white/20 h-10 text-sm">Export Data Harian</Button>
             </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-700">
             <Leaf className="w-64 h-64" />
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
             <div key={idx} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl text-white shadow-md ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                </div>
                <div>
                   <h3 className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                   <p className="text-2xl font-black text-stone-900 dark:text-white mb-1">{stat.value}</p>
                   <p className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg inline-block border border-green-100 dark:border-green-900/30">{stat.subValue}</p>
                </div>
             </div>
          ))}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                   <Activity className="w-5 h-5 text-orange-500" /> Log Aktivitas Terkini
                </h3>
                <button onClick={() => setActiveTab('admins')} className="text-xs text-orange-500 font-bold hover:underline">Lihat Semua Log</button>
             </div>
             <div className="space-y-4">
                {logs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors border-b border-stone-50 dark:border-stone-800 last:border-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${log.severity === 'critical' ? 'bg-red-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                            {log.severity === 'critical' ? '!' : log.severity === 'warning' ? 'W' : 'i'}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-stone-900 dark:text-white">
                                {log.action} <span className="font-normal text-stone-500 dark:text-stone-400">oleh {log.actor}</span>
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{log.details}</p>
                        </div>
                        <span className="text-xs font-medium text-stone-400 whitespace-nowrap">{log.timestamp.split(' ')[1]}</span>
                    </div>
                ))}
             </div>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
             <h3 className="font-bold text-stone-900 dark:text-white mb-4">Kesehatan Operasional</h3>
             <div className="space-y-6">
                 <div>
                     <div className="flex justify-between text-xs mb-1 text-stone-500 dark:text-stone-400">
                         <span>Response Time</span>
                         <span className="font-bold text-green-500">98ms</span>
                     </div>
                     <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                         <div className="bg-green-500 h-full w-[95%]"></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-xs mb-1 text-stone-500 dark:text-stone-400">
                         <span>Pending Reports</span>
                         <span className="font-bold text-orange-500">12</span>
                     </div>
                     <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                         <div className="bg-orange-500 h-full w-[30%]"></div>
                     </div>
                 </div>
                 <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                     <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-stone-600 dark:text-stone-300">Maintenance Mode</span>
                         <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             {maintenanceMode ? 'Active' : 'Inactive'}
                         </div>
                     </div>
                     <p className="text-xs text-stone-400">Terakhir update: 2 menit yang lalu</p>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="animate-in fade-in space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-500" /> Manajemen User & Reward
          </h2>
          <div className="flex gap-2">
             <Button onClick={handleExportUsers} variant="outline" className="text-xs h-9">Export CSV</Button>
             <Button className="text-xs h-9" onClick={() => setSelectedUser({id:'new', name:'', email:'', role:'volunteer', status:'active', points:0, joinDate:''})}><UserPlus className="w-4 h-4 mr-2" /> Tambah Manual</Button>
          </div>
       </div>
       
       <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white mb-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold flex items-center gap-2"><Gift className="w-5 h-5" /> Badge & Gamification</h3>
             <Button 
                onClick={() => setShowBadgeModal(true)}
                className="w-auto px-4 h-8 bg-white/20 hover:bg-white/30 border-0 text-xs"
             >
                Manage Badges
             </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
             {badges.map(badge => (
                 <div 
                    key={badge.id} 
                    className="bg-white/10 p-3 rounded-xl min-w-[200px] border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => handleEditBadge(badge)}
                 >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <p className="font-bold text-sm">{badge.name}</p>
                    <p className="text-xs text-purple-200">{badge.description}</p>
                    <p className="text-xs mt-2 font-mono bg-black/20 inline-block px-1 rounded">Awarded: {badge.awardedTo}</p>
                 </div>
             ))}
             <button onClick={handleAddBadge} className="min-w-[100px] flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 transition-colors">
                 <PlusCircle className="w-6 h-6 text-white/50 mb-1" />
                 <span className="text-xs text-white/50">Add New</span>
             </button>
          </div>
       </div>

       <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-300 text-xs uppercase font-bold tracking-wider">
                    <tr>
                       <th className="p-4 border-b border-stone-200 dark:border-stone-800">User Profile</th>
                       <th className="p-4 border-b border-stone-200 dark:border-stone-800">Role</th>
                       <th className="p-4 border-b border-stone-200 dark:border-stone-800">Points</th>
                       <th className="p-4 border-b border-stone-200 dark:border-stone-800">Status</th>
                       <th className="p-4 border-b border-stone-200 dark:border-stone-800 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                    {users.map(user => (
                       <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group">
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center font-bold text-stone-500 dark:text-stone-300">
                                      {user.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm text-stone-900 dark:text-white">{user.name}</p>
                                      <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                                  </div>
                              </div>
                          </td>
                          <td className="p-4 text-sm font-medium">
                              {user.role}
                          </td>
                          <td className="p-4">
                              <span className="font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">{user.points}</span>
                          </td>
                          <td className="p-4">
                             <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                 user.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                 user.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'
                             }`}>
                                {user.status}
                             </span>
                          </td>
                          <td className="p-4 text-right">
                             <Button 
                                variant="outline" 
                                className="h-8 text-xs px-3 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                                onClick={() => setSelectedUser(user)}
                             >
                                Edit
                             </Button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
          </div>
       </div>

       {/* Edit User Modal */}
       {selectedUser && (
           <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
                   <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
                       <h3 className="font-bold text-lg text-stone-900 dark:text-white">{selectedUser.id === 'new' ? 'Tambah User Manual' : 'Edit User'}</h3>
                       <button onClick={() => setSelectedUser(null)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                   </div>
                   <div className="p-6 space-y-6">
                       {selectedUser.id !== 'new' && (
                           <div className="flex items-center gap-4">
                               <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-2xl font-bold text-stone-500">
                                   {selectedUser.name.charAt(0)}
                               </div>
                               <div>
                                   <h4 className="font-bold text-xl text-stone-900 dark:text-white">{selectedUser.name}</h4>
                                   <p className="text-stone-500 text-sm">{selectedUser.email}</p>
                                   <p className="text-xs font-bold text-orange-500 uppercase mt-1">{selectedUser.role}</p>
                               </div>
                           </div>
                       )}

                       <div className="space-y-4">
                           {selectedUser.id === 'new' && (
                               <>
                                   <Input label="Nama Lengkap" />
                                   <Input label="Email" />
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-500 uppercase">Role</label>
                                        <select className="w-full p-2 border rounded-xl bg-transparent dark:border-stone-700 dark:text-white"><option>Volunteer</option><option>Provider</option></select>
                                   </div>
                               </>
                           )}

                           <div className="space-y-2">
                               <label className="text-xs font-bold text-stone-500 uppercase">Status Akun</label>
                               <div className="flex gap-2">
                                   <button 
                                      onClick={() => handleUserAction('activate')}
                                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${selectedUser.status === 'active' ? 'bg-green-100 border-green-500 text-green-700' : 'border-stone-200 dark:border-stone-700 text-stone-500'}`}
                                   >
                                       Aktif
                                   </button>
                                   <button 
                                      onClick={() => handleUserAction('suspend')}
                                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${selectedUser.status === 'suspended' ? 'bg-red-100 border-red-500 text-red-700' : 'border-stone-200 dark:border-stone-700 text-stone-500'}`}
                                   >
                                       Suspend
                                   </button>
                               </div>
                           </div>

                           <div className="space-y-2">
                               <label className="text-xs font-bold text-stone-500 uppercase">Poin Sosial (Manual Adjustment)</label>
                               <div className="flex items-center gap-2">
                                   <button onClick={() => setSelectedUser({...selectedUser, points: Math.max(0, selectedUser.points - 100)})} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg font-bold hover:bg-stone-200 dark:hover:bg-stone-700">-100</button>
                                   <input 
                                      type="number" 
                                      value={selectedUser.points} 
                                      onChange={(e) => setSelectedUser({...selectedUser, points: parseInt(e.target.value) || 0})}
                                      className="flex-1 text-center py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg font-bold text-stone-900 dark:text-white"
                                   />
                                   <button onClick={() => setSelectedUser({...selectedUser, points: selectedUser.points + 100})} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg font-bold hover:bg-stone-200 dark:hover:bg-stone-700">+100</button>
                               </div>
                           </div>
                       </div>
                   </div>
                   <div className="p-4 bg-stone-50 dark:bg-stone-950 flex justify-end gap-3">
                       <Button variant="ghost" onClick={() => setSelectedUser(null)}>Batal</Button>
                       <Button onClick={() => handleUserAction('save_points')}>Simpan Perubahan</Button>
                   </div>
               </div>
           </div>
       )}

       {/* Edit Badge Modal */}
       {showBadgeModal && (
           <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
                   <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                       <h3 className="font-bold text-lg text-stone-900 dark:text-white">{isEditingBadge ? 'Edit Badge' : 'Tambah Badge Baru'}</h3>
                   </div>
                   <div className="p-6 space-y-4">
                       <Input label="Nama Badge" value={badgeForm.name} onChange={(e) => setBadgeForm({...badgeForm, name: e.target.value})} placeholder="Contoh: Super Hero" />
                       
                       <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-600 dark:text-stone-400">Ikon Badge</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="w-12 h-12 flex items-center justify-center text-2xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                >
                                    {badgeForm.icon || <Smile className="w-5 h-5 text-stone-400" />}
                                </button>

                                {showIconPicker && (
                                    <div className="absolute top-14 left-0 z-50 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl p-3 w-64 animate-in zoom-in-95">
                                        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                            {AVAILABLE_ICONS.map((icon) => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => {
                                                        setBadgeForm({ ...badgeForm, icon });
                                                        setShowIconPicker(false);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                       </div>

                       <Input label="Deskripsi" value={badgeForm.description} onChange={(e) => setBadgeForm({...badgeForm, description: e.target.value})} placeholder="Deskripsi singkat" />
                   </div>
                   <div className="p-4 bg-stone-50 dark:bg-stone-950 flex justify-end gap-3">
                       <Button variant="ghost" onClick={() => setShowBadgeModal(false)}>Batal</Button>
                       <Button onClick={handleSaveBadge}>Simpan</Button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-500" /> Moderasi Laporan
          </h2>
          <div className="flex gap-2">
              <Button variant="outline" className="text-xs h-9" onClick={handleBulkAction}>Aksi Massal</Button>
          </div>
       </div>

       <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
           {['all', 'new', 'investigating', 'resolved'].map(filter => (
               <button
                  key={filter}
                  onClick={() => setModerationFilter(filter as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${moderationFilter === filter ? 'bg-orange-500 text-white' : 'bg-white dark:bg-stone-900 text-stone-500 border border-stone-200 dark:border-stone-800'}`}
               >
                   {filter}
               </button>
           ))}
       </div>

       <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
           <table className="w-full text-left">
               <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 text-xs uppercase font-bold">
                   <tr>
                       <th className="p-4 w-10"><input type="checkbox" onChange={handleBulkAction} /></th>
                       <th className="p-4">Prioritas</th>
                       <th className="p-4">Tipe</th>
                       <th className="p-4">Pelapor & Target</th>
                       <th className="p-4">Deskripsi</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-right">Aksi</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                   {reports.filter(r => moderationFilter === 'all' || r.status === moderationFilter).map(report => (
                       <tr key={report.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                           <td className="p-4"><input type="checkbox" checked={selectedReportIds.includes(report.id)} onChange={() => toggleReportSelection(report.id)} /></td>
                           <td className="p-4">
                               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${report.priority === 'high' ? 'bg-red-100 text-red-600' : report.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                   {report.priority}
                               </span>
                           </td>
                           <td className="p-4 text-sm font-medium capitalize">{report.type}</td>
                           <td className="p-4 text-sm">
                               <p className="font-bold text-stone-900 dark:text-white">{report.reporter}</p>
                               <p className="text-stone-500 text-xs">Target: {report.target}</p>
                           </td>
                           <td className="p-4 text-sm text-stone-600 dark:text-stone-300 max-w-xs truncate">{report.description}</td>
                           <td className="p-4">
                               <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${report.status === 'new' ? 'bg-red-500 text-white' : report.status === 'resolved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                   {report.status}
                               </span>
                           </td>
                           <td className="p-4 text-right">
                               <Button variant="outline" className="h-8 text-xs px-3" onClick={() => setSelectedReport(report)}>Detail</Button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </div>
  );

  const renderDistribution = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-500" /> Distribusi & Logistik
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Total Pengiriman</h4>
                <p className="text-2xl font-bold text-stone-900 dark:text-white">1,240</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Sedang Berjalan</h4>
                <p className="text-2xl font-bold text-orange-500">24</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Butuh Relawan</h4>
                <p className="text-2xl font-bold text-red-500">{distributions.filter(d => d.status === 'pending').length}</p>
            </div>
        </div>

        <div className="space-y-4">
            {distributions.map(task => (
                <div key={task.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500">{task.id}</span>
                            {task.priority === 'urgent' && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">URGENT</span>}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div>
                                <p className="text-xs text-stone-500">Dari</p>
                                <p className="font-bold text-sm">{task.from}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-400" />
                            <div>
                                <p className="text-xs text-stone-500">Ke</p>
                                <p className="font-bold text-sm">{task.to}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium mb-2">{task.volunteer !== 'Belum Ditugaskan' ? task.volunteer : <span className="text-red-500 italic">Belum ada relawan</span>}</p>
                        {task.status === 'pending' ? (
                            <Button className="h-9 text-xs" onClick={() => setShowAssignVolunteerModal(task.id)}>Tugaskan</Button>
                        ) : (
                            <Button variant="outline" className="h-9 text-xs">Lacak</Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  
  const renderImpact = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" /> Laporan Dampak Sosial
              </h2>
              <div className="flex gap-2">
                  <Button variant="outline" className="text-xs h-9" onClick={handleExportImpactCSV}>Export Data</Button>
                  <Button className="text-xs h-9" onClick={handleGenerateReport}>Buat Laporan PDF</Button>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm w-full overflow-hidden">
                  <h3 className="font-bold mb-4">Pengurangan Limbah Pangan (Kg)</h3>
                  <AdminBarChart data={[300, 450, 320, 500, 480, 600, 550]} labels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']} colorClass="bg-green-500" />
              </div>
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm w-full overflow-hidden">
                  <h3 className="font-bold mb-4">Penerima Manfaat Terbantu</h3>
                  <AdminBarChart data={[50, 65, 45, 80, 70, 90, 85]} labels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']} colorClass="bg-blue-500" />
              </div>
          </div>

          <div className="bg-gradient-to-br from-teal-900 to-emerald-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-2">Target Zero Waste 2030</h3>
                   <p className="text-emerald-100 max-w-lg">Kita telah mencapai 24% dari target pengurangan limbah tahunan hanya dalam 3 bulan pertama. Teruskan momentum ini!</p>
               </div>
               <div className="w-32 h-32 relative flex-shrink-0 z-10">
                   {/* FIXED VISUAL BUG: Added viewBox to properly scale the SVG */}
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-800" />
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset="267.4" className="text-emerald-400" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">24%</div>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10">
                   <Leaf className="w-64 h-64" />
               </div>
          </div>
      </div>
  );

  const renderCommunication = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-orange-500" /> Komunikasi Broadcast
              </h2>
          </div>

          <div className="flex gap-2 mb-4 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl w-fit">
              <button onClick={() => setBroadcastTab('compose')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${broadcastTab === 'compose' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Tulis Pesan</button>
              <button onClick={() => setBroadcastTab('history')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${broadcastTab === 'history' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Riwayat</button>
          </div>

          {broadcastTab === 'compose' && (
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-2xl">
                  <div className="space-y-4">
                      <Input label="Judul Broadcast" placeholder="Contoh: Info Pemeliharaan Sistem" />
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Target Penerima</label>
                          <select className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl">
                              <option value="all">Semua User</option>
                              <option value="provider">Hanya Provider</option>
                              <option value="volunteer">Hanya Relawan</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Isi Pesan</label>
                          <textarea className="w-full h-32 p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:border-orange-500" placeholder="Tulis pesan anda disini..."></textarea>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button className="w-auto" onClick={handleSendBroadcast}><Send className="w-4 h-4 mr-2" /> Kirim Broadcast</Button>
                      </div>
                  </div>
              </div>
          )}

          {broadcastTab === 'history' && (
              <div className="space-y-4">
                  {messages.map(msg => (
                      <div key={msg.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-lg">{msg.title}</h4>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">{msg.status}</span>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 mb-3">{msg.content}</p>
                          <div className="flex justify-between text-xs text-stone-500">
                              <span>Target: {msg.target}</span>
                              <span>Dibaca: {msg.readCount} users</span>
                              <span>{msg.sentAt}</span>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );

  const renderContent = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Layout className="w-6 h-6 text-orange-500" /> CMS & Konten
              </h2>
          </div>

          <div className="flex gap-2 mb-4 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl w-fit">
              <button onClick={() => setContentTab('banners')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${contentTab === 'banners' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Banner Promo</button>
              <button onClick={() => setContentTab('faq')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${contentTab === 'faq' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>FAQ</button>
          </div>

          {contentTab === 'banners' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map(banner => (
                      <div key={banner.id} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm group relative">
                          <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" />
                          <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-stone-900 dark:text-white line-clamp-1">{banner.title}</h4>
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${banner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{banner.status}</span>
                              </div>
                              <p className="text-xs text-stone-500 mb-4">{banner.impressions} Views</p>
                              <div className="flex gap-2">
                                  <Button variant="outline" className="h-8 text-xs flex-1">Edit</Button>
                                  <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                              </div>
                          </div>
                      </div>
                  ))}
                  <button onClick={handleUploadBanner} className="bg-stone-50 dark:bg-stone-900 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center h-full min-h-[250px] hover:border-orange-500 transition-colors text-stone-400 hover:text-orange-500">
                      <PlusCircle className="w-8 h-8 mb-2" />
                      <span className="font-bold">Tambah Banner</span>
                  </button>
              </div>
          )}
          
          {contentTab === 'faq' && (
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                  <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                      <h4 className="font-bold">Daftar Pertanyaan (FAQ)</h4>
                      <Button className="h-8 w-auto text-xs" onClick={() => { setIsEditingFaq(false); setFaqForm({id:'', question:'', answer:'', category:'Umum'}) }}>+ Tambah FAQ</Button>
                  </div>
                  <div className="divide-y divide-stone-100 dark:divide-stone-800">
                      {isEditingFaq || faqForm.question ? (
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 space-y-3">
                              <Input label="Pertanyaan" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} />
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-stone-500">Jawaban</label>
                                  <textarea className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900" rows={3} value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})}></textarea>
                              </div>
                              <div className="flex gap-2 justify-end">
                                  <Button variant="ghost" className="w-auto h-8" onClick={() => { setIsEditingFaq(false); setFaqForm({id:'', question:'', answer:'', category:'Umum'}) }}>Batal</Button>
                                  <Button className="w-auto h-8" onClick={handleSaveFaq}>Simpan</Button>
                              </div>
                          </div>
                      ) : null}
                      
                      {faqs.map(faq => (
                          <div key={faq.id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group">
                              <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-bold text-sm text-stone-900 dark:text-white">{faq.question}</h5>
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => handleEditFaq(faq)} className="text-blue-500"><Edit className="w-3 h-3" /></button>
                                      <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-500"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                              </div>
                              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{faq.answer}</p>
                              <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500 mt-2 inline-block">{faq.category}</span>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );

  const renderAdmins = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                 <Crown className="w-6 h-6 text-orange-500" /> Admin Management
             </h2>
             <div className="flex gap-2">
                 <Button variant="outline" className="text-xs h-9" onClick={handleExportLogs}>Download Logs</Button>
                 <Button className="text-xs h-9" onClick={() => setShowAddAdminModal(true)}><UserPlus className="w-4 h-4 mr-2" /> Add Admin</Button>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                    <div className="p-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 font-bold text-sm">
                        Admin List
                    </div>
                    <div className="p-4 space-y-4">
                        {admins.map(admin => (
                            <div key={admin.id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-500">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{admin.name} {admin.id === '1' && <span className="text-orange-500 text-xs">(You)</span>}</p>
                                        <p className="text-xs text-stone-500">{admin.email} • {admin.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{admin.status}</span>
                                    {admin.role !== 'super_admin' && (
                                        <div className="flex gap-1 ml-2">
                                            <button onClick={() => handleEditAdmin(admin)} className="p-1.5 hover:bg-stone-200 rounded text-stone-500"><Edit className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDeleteAdmin(admin.id)} className="p-1.5 hover:bg-red-100 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm h-fit">
                <div className="p-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 font-bold text-sm flex justify-between items-center">
                    <span>Audit Logs</span>
                    <button onClick={handleFilterLogs} className="text-xs text-orange-500 hover:underline">Filter Critical</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-2">
                    {logs.map(log => (
                        <div key={log.id} className="p-3 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${log.severity === 'critical' ? 'bg-red-100 text-red-600' : log.severity === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{log.severity}</span>
                                <span className="text-[10px] text-stone-400 font-mono">{log.timestamp}</span>
                            </div>
                            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">{log.action}</p>
                            <p className="text-[10px] text-stone-500">{log.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Add Admin Modal */}
        {showAddAdminModal && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl p-6">
                    <h3 className="font-bold text-lg mb-4">{isEditingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                        <Input label="Name" value={newAdminForm.name} onChange={e => setNewAdminForm({...newAdminForm, name: e.target.value})} required />
                        <Input label="Email" type="email" value={newAdminForm.email} onChange={e => setNewAdminForm({...newAdminForm, email: e.target.value})} required />
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Role</label>
                            <select className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl" value={newAdminForm.role} onChange={e => setNewAdminForm({...newAdminForm, role: e.target.value})}>
                                <option value="admin_manager">Manager</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Permissions</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'moderation', 'distribution', 'users'].map(perm => (
                                    <button 
                                      type="button" 
                                      key={perm}
                                      onClick={() => togglePermission(perm)}
                                      className={`px-3 py-1 rounded-full text-xs font-bold border ${newAdminForm.permissions.includes(perm) ? 'bg-orange-500 text-white border-orange-500' : 'bg-stone-100 text-stone-500 border-stone-200'}`}
                                    >
                                        {perm}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setShowAddAdminModal(false)}>Cancel</Button>
                            <Button type="submit">Save Admin</Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );

  const renderConfig = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-orange-500" /> System Configuration
              </h2>
              <Button onClick={handleSaveConfig} className="w-auto h-9 text-xs">Save Changes</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-red-500" /> Emergency Controls</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                          <div>
                              <p className="font-bold text-red-700 dark:text-red-400">Maintenance Mode</p>
                              <p className="text-xs text-red-500">Shutdown all user access immediately.</p>
                          </div>
                          <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-6 rounded-full p-1 transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-stone-300'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${maintenanceMode ? 'translate-x-6' : ''}`}></div>
                          </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                          <div>
                              <p className="font-bold text-stone-700 dark:text-stone-300">Disable New Signups</p>
                              <p className="text-xs text-stone-500">Prevent new users from registering.</p>
                          </div>
                          <button onClick={() => setDisableNewSignups(!disableNewSignups)} className={`w-12 h-6 rounded-full p-1 transition-colors ${disableNewSignups ? 'bg-orange-500' : 'bg-stone-300'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${disableNewSignups ? 'translate-x-6' : ''}`}></div>
                          </button>
                      </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" /> AI Parameters</h3>
                   <div className="space-y-4">
                       <div>
                           <div className="flex justify-between mb-2">
                               <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Edible Threshold</label>
                               <span className="text-sm font-bold text-orange-500">{aiThreshold}%</span>
                           </div>
                           <input type="range" min="50" max="99" value={aiThreshold} onChange={(e) => setAiThreshold(parseInt(e.target.value))} className="w-full accent-orange-500" />
                           <p className="text-xs text-stone-400 mt-1">Minimum confidence score for auto-approval.</p>
                       </div>
                   </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm md:col-span-2">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-purple-500" /> Database & API</h3>
                  <div className="flex gap-4">
                      <Button variant="outline" onClick={handleRotateKey} className="border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">Rotate API Keys</Button>
                      <Button variant="outline" onClick={handleForceBackup}>Force Backup Now</Button>
                      <Button variant="outline">Clear Cache</Button>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFBF7] dark:bg-stone-950 overflow-hidden font-sans transition-colors duration-300">
      {renderSidebar()}
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col h-full`}>
         {/* Top Header */}
         <header className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
                  <Menu className="w-5 h-5 text-stone-600 dark:text-stone-300" />
               </button>
               <h2 className="text-lg font-bold text-stone-900 dark:text-white capitalize tracking-tight">
                  {activeTab === 'overview' ? 'Dashboard Utama' : activeTab.replace('_', ' ')}
               </h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative hidden md:block">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="text" placeholder="Cari user, ID laporan..." className="pl-10 pr-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 border-none text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none w-64 transition-all text-stone-900 dark:text-white placeholder-stone-500" />
               </div>
               <div className="relative">
                   <button 
                     onClick={() => setShowNotifications(!showNotifications)}
                     className="relative p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                   >
                      <Bell className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-stone-900"></span>
                   </button>
                   {showNotifications && (
                       <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl z-50 overflow-hidden">
                           <div className="p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                               <h4 className="font-bold text-stone-900 dark:text-white text-sm">Notifikasi</h4>
                           </div>
                           <div className="max-h-64 overflow-y-auto">
                               {notificationsData.map(notif => (
                                   <div key={notif.id} className="p-3 border-b border-stone-50 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex gap-3">
                                       <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.type === 'warning' ? 'bg-red-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                       <div>
                                           <p className="text-xs font-medium text-stone-800 dark:text-stone-200">{notif.message}</p>
                                           <p className="text-[10px] text-stone-400 mt-1">{notif.time}</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
               <div className="flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
                  <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-stone-900 dark:text-white">Admin Utama</p>
                      <p className="text-[10px] text-stone-500 uppercase">{role.replace('_', ' ')}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-stone-900">
                     {role === 'super_admin' ? 'SA' : 'AP'}
                  </div>
               </div>
            </div>
         </header>

         {/* Content Scrollable Area */}
         <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-800">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'moderation' && renderModeration()}
            {activeTab === 'distribution' && renderDistribution()}
            {activeTab === 'community' && renderCommunity()}
            {activeTab === 'impact' && renderImpact()}
            {activeTab === 'communication' && renderCommunication()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'admins' && (role === 'super_admin' ? renderAdmins() : <div className="text-center py-20 text-stone-400 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800">Akses Ditolak. Memerlukan hak akses Super Admin.</div>)}
            {activeTab === 'config' && (role === 'super_admin' ? renderConfig() : <div className="text-center py-20 text-stone-400 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800">Akses Ditolak. Memerlukan hak akses Super Admin.</div>)}
         </div>

         {/* Moderation Detail Modal */}
         {selectedReport && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button 
                        onClick={() => setSelectedReport(null)}
                        className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedReport.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                 {selectedReport.priority} Priority
                             </span>
                             <span className="text-sm text-stone-500">{selectedReport.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white">Detail Laporan</h3>
                    </div>

                    <div className="space-y-4 bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase">Pelapor</p>
                                <p className="font-medium">{selectedReport.reporter}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase">Target</p>
                                <p className="font-medium">{selectedReport.target}</p>
                            </div>
                        </div>
                        <div>
                             <p className="text-xs font-bold text-stone-500 uppercase mb-1">Deskripsi Masalah</p>
                             <p className="text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                                 {selectedReport.description}
                             </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                         <Button variant="ghost" onClick={() => handleReportAction('dismiss')} className="border border-stone-200 dark:border-stone-700">Dismiss</Button>
                         <Button variant="outline" onClick={() => handleReportAction('ban_target')} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20">Ban User</Button>
                         <Button onClick={() => handleReportAction('resolve')} className="bg-green-600 hover:bg-green-500 text-white">Resolve</Button>
                    </div>
                </div>
            </div>
         )}
      </main>
    </div>
  );
};
