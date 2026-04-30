import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Briefcase, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Resume AI', href: '/resume', icon: FileText },
    { name: 'Job Match', href: '/jobs', icon: Briefcase },
    { name: 'Mock Interview', href: '/interview', icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Decorative gradient blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      {/* Sidebar */}
      <div className="w-64 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            CareerCopilot
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  active 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border space-y-4">
          {user && (
            <div className="p-3 rounded-lg bg-white/5 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Logged in as</p>
              <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-red-400 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto z-10">
        <header className="h-16 flex items-center px-8 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 ml-auto">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right mr-3">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-border"
                />
              </div>
            )}
          </div>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
