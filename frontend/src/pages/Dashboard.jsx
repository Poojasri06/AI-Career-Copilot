import { BarChart3, FileText, Briefcase, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Resumes Analyzed',
      value: '3',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Job Matches Found',
      value: '24',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Mock Interviews',
      value: '5',
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Match Score',
      value: '87%',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentActivities = [
    { type: 'Resume Analyzed', title: 'Senior Developer Resume', time: '2 hours ago' },
    { type: 'Job Match', title: 'Software Engineer at TechCorp', time: '1 day ago' },
    { type: 'Interview', title: 'Mock Interview - Round 1', time: '3 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's your career optimization overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card/40 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-20`} />
                </div>
                <p className="text-muted-foreground text-sm mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/resume')}
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <span className="font-semibold text-foreground">Upload Resume</span>
                </div>
                <p className="text-sm text-muted-foreground">Analyze your resume with AI</p>
              </button>

              <button
                onClick={() => navigate('/jobs')}
                className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold text-foreground">Find Jobs</span>
                </div>
                <p className="text-sm text-muted-foreground">Discover matching job opportunities</p>
              </button>

              <button
                onClick={() => navigate('/interview')}
                className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-500/60 transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-green-400" />
                  <span className="font-semibold text-foreground">Start Interview</span>
                </div>
                <p className="text-sm text-muted-foreground">Practice with AI-powered mock interviews</p>
              </button>

              <button
                onClick={() => navigate('/jobs')}
                className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                  <span className="font-semibold text-foreground">View Analytics</span>
                </div>
                <p className="text-sm text-muted-foreground">Track your career progress</p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-card/40 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-primary">{activity.type}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <p className="text-foreground text-sm">{activity.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
