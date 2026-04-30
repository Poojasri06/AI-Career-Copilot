import { MapPin, DollarSign, Briefcase, ExternalLink, Star } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/Modal';

const Jobs = () => {
  const [filter, setFilter] = useState('all');
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$150k - $200k',
      match: 95,
      type: 'Full-time',
      saved: true,
      description: 'We are looking for an experienced Full Stack Developer to join our growing team.',
      requirements: ['5+ years experience', 'React & Node.js', 'AWS', 'Leadership skills'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Professional Development'],
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupAI',
      location: 'Remote',
      salary: '$120k - $160k',
      match: 87,
      type: 'Full-time',
      saved: false,
      description: 'Join our fast-growing startup and help build the future of AI.',
      requirements: ['3+ years React', 'TypeScript', 'State management', 'Testing'],
      benefits: ['Equity', 'Flexible hours', 'Learning budget', 'Remote'],
    },
    {
      id: 3,
      title: 'Backend Engineer',
      company: 'CloudSystems',
      location: 'New York, NY',
      salary: '$130k - $180k',
      match: 82,
      type: 'Full-time',
      saved: true,
      description: 'Design and build scalable backend systems for our cloud platform.',
      requirements: ['4+ years backend', 'Python/Java', 'Microservices', 'SQL'],
      benefits: ['Competitive salary', 'Health', 'Gym membership', 'Stock options'],
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'DesignStudio',
      location: 'Austin, TX',
      salary: '$110k - $150k',
      match: 78,
      type: 'Full-time',
      saved: false,
      description: 'Create beautiful user interfaces and experiences for our products.',
      requirements: ['3+ years frontend', 'CSS/UI design', 'Accessibility', 'Performance'],
      benefits: ['Creative environment', 'Health', 'Flexible schedule', 'Travel'],
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'InfraCloud',
      location: 'Remote',
      salary: '$140k - $190k',
      match: 73,
      type: 'Contract',
      saved: false,
      description: 'Manage and optimize our infrastructure and deployment pipelines.',
      requirements: ['3+ years DevOps', 'Kubernetes', 'CI/CD', 'Linux'],
      benefits: ['Contract to hire', 'Remote', 'Flexible', 'Training'],
    },
    {
      id: 6,
      title: 'Full Stack Engineer',
      company: 'MobileApp Inc',
      location: 'Chicago, IL',
      salary: '$125k - $165k',
      match: 91,
      type: 'Full-time',
      saved: true,
      description: 'Build mobile and web applications using modern technologies.',
      requirements: ['4+ years fullstack', 'React/Mobile', 'Database design', 'Testing'],
      benefits: ['Wellness', 'Commuter', 'Food', 'Professional development'],
    },
  ]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSave = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const filteredJobs = filter === 'saved' ? jobs.filter(j => j.saved) : jobs;

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-400';
    if (match >= 80) return 'text-emerald-400';
    if (match >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Job Matches</h1>
        <p className="text-muted-foreground">AI-matched job opportunities based on your profile</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:bg-white/10'
          }`}
        >
          All Jobs
        </button>
        <button
          onClick={() => setFilter('saved')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            filter === 'saved'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:bg-white/10'
          }`}
        >
          <Star className="w-4 h-4" />
          Saved
        </button>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="group p-6 rounded-2xl bg-card/40 border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:bg-card/60"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-muted-foreground mt-1">{job.company}</p>
              </div>
              <button
                onClick={() => toggleSave(job.id)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    job.saved ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </div>
              <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                {job.type}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Match Score</p>
                  <p className={`text-lg font-bold ${getMatchColor(job.match)}`}>{job.match}%</p>
                </div>
              </div>
              <button
                onClick={() => openJobDetails(job)}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
              >
                View Details
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedJob?.title}
        size="2xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Company</p>
              <p className="text-xl font-semibold text-foreground">{selectedJob.company}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Location</p>
                <p className="text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {selectedJob.location}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Salary Range</p>
                <p className="text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> {selectedJob.salary}
                </p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-2">Description</p>
              <p className="text-foreground">{selectedJob.description}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-3">Requirements</p>
              <ul className="space-y-2">
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-3">Benefits</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedJob.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground text-sm"
                  >
                    ✓ {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <button
                onClick={() => {
                  toggleSave(selectedJob.id);
                  setJobs(jobs.map(j => j.id === selectedJob.id ? { ...selectedJob, saved: !selectedJob.saved } : j));
                }}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  selectedJob.saved
                    ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                <Star className={`w-5 h-5 ${selectedJob.saved ? 'fill-current' : ''}`} />
                {selectedJob.saved ? 'Saved' : 'Save Job'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;
