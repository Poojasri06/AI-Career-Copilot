import { Upload, CheckCircle, AlertCircle, Zap, X, Download, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/Modal';

const Resume = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Senior_Developer_Resume.pdf', uploadedAt: '2 hours ago', status: 'analyzed', score: 78, enhanced: false },
    { id: 2, name: 'Resume_v2.pdf', uploadedAt: '1 week ago', status: 'analyzed', score: 82, enhanced: false },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Resume generation states
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('docx');
  const [generationForm, setGenerationForm] = useState({
    full_name: '',
    job_title: '',
    role: '',
    company: '',
    years_experience: 0,
    skills: [],
    achievements: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF, DOC, and DOCX files are allowed');
    }
  };

  const processFile = async (file) => {
    try {
      validateFile(file);
      setError('');
      setIsAnalyzing(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newFile = {
        id: Date.now(),
        name: file.name,
        uploadedAt: 'just now',
        status: 'analyzed',
        enhanced: false,
        score: Math.floor(Math.random() * 20) + 70,
      };

      setUploadedFiles([newFile, ...uploadedFiles]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  const handleBrowseFiles = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const viewAnalysis = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const getAnalysisData = (file) => {
    return {
      score: file.score,
      strengths: [
        'Clear structure and formatting',
        'Well-articulated achievements',
        'Good use of industry keywords',
      ],
      weaknesses: [
        'Could expand technical skills section',
        'Consider adding more quantifiable metrics',
        'Add more specific project outcomes',
      ],
      suggestions: [
        { category: 'Skills', issue: 'Add more technical skills', severity: 'warning' },
        { category: 'Format', issue: 'Use consistent date formatting', severity: 'info' },
        { category: 'Keywords', issue: 'Include more industry keywords', severity: 'warning' },
        { category: 'Experience', issue: 'Expand bullet points with quantifiable achievements', severity: 'warning' },
      ],
      improvements: [
        {
          id: 1,
          title: 'Expand Technical Skills Section',
          category: 'Skills',
          priority: 'High',
          steps: [
            'Add 5-7 more technical skills relevant to your target role',
            'Group skills by category (Frontend, Backend, Database, etc.)',
            'Include both tools and programming languages',
            'Example: React, Vue.js, TypeScript, Node.js, MongoDB',
          ],
          impact: 'Will increase match score by 8-12%',
        },
        {
          id: 2,
          title: 'Add Quantifiable Metrics',
          category: 'Experience',
          priority: 'High',
          steps: [
            'Review each job bullet point',
            'Add numbers where possible (% improvement, team size, revenue impact)',
            'Example: "Led team of 5" instead of "Led team"',
            'Include metrics like performance improvements or cost savings',
          ],
          impact: 'Will increase match score by 10-15%',
        },
        {
          id: 3,
          title: 'Use Consistent Date Formatting',
          category: 'Format',
          priority: 'Medium',
          steps: [
            'Choose one format: MM/YYYY or Month Year',
            'Apply consistently throughout the document',
            'Include both start and end dates for all positions',
            'Use "Present" for current role, not future dates',
          ],
          impact: 'Will increase match score by 2-3%',
        },
        {
          id: 4,
          title: 'Optimize for ATS Keywords',
          category: 'Keywords',
          priority: 'High',
          steps: [
            'Review job descriptions for your target roles',
            'Extract common keywords and requirements',
            'Naturally incorporate 10-15 of these keywords throughout resume',
            'Include them in experience descriptions and skills section',
          ],
          impact: 'Will increase match score by 12-18%',
        },
      ],
    };
  };

  const buildEnhancedResumeContent = (file) => {
    const analysis = getAnalysisData(file);
    const roleName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    const skills = [
      'React',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'REST APIs',
      'Responsive Design',
      'Problem Solving',
      'Team Collaboration',
    ];

    return `ENHANCED RESUME

File: ${file.name}
Improved Score: ${file.score}/100
Status: Enhanced with AI resume analysis

PROFESSIONAL SUMMARY
Results-driven professional focused on measurable impact, clean execution, and strong collaboration across projects and teams.

CORE SKILLS
${skills.map((skill) => `- ${skill}`).join('\n')}

EXPERIENCE IMPROVEMENTS
- Added stronger technical skill coverage
- Expanded achievements with measurable outcomes
- Standardized formatting for readability and ATS compatibility
- Optimized language with role-relevant keywords

ATS KEYWORDS APPLIED
${analysis.improvements
  .filter((item) => item.category === 'Skills' || item.category === 'Keywords')
  .map((item) => `- ${item.title}`)
  .join('\n')}

IMPROVEMENT NOTES
${analysis.improvements.map((item) => `- ${item.title} (${item.priority} priority)`).join('\n')}

TARGET ROLE FIT
This enhanced version is structured to improve match quality for modern applicant tracking systems while keeping the resume easy to scan.

NEXT STEP
Replace the placeholder content above with your actual experience, metrics, and project details, then keep this enhanced structure for future uploads.
`;
  };

  const downloadEnhancedResume = (file) => {
    const content = file.enhancedResumeContent || buildEnhancedResumeContent(file);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${file.name.split('.')[0]}_enhanced_resume.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const enhanceResume = (file) => {
    const analysis = getAnalysisData(file);
    const highPriorityCount = analysis.improvements.filter((item) => item.priority === 'High').length;
    const mediumPriorityCount = analysis.improvements.filter((item) => item.priority === 'Medium').length;
    const boost = highPriorityCount * 6 + mediumPriorityCount * 3;
    const enhancedScore = Math.min(100, file.score + boost);
    const enhancedResumeContent = buildEnhancedResumeContent({ ...file, score: enhancedScore });

    const enhancedFile = {
      ...file,
      score: enhancedScore,
      status: 'enhanced',
      enhanced: true,
      enhancedAt: 'just now',
      enhancementNotes: analysis.improvements.map((item) => item.title),
      correctedAreas: analysis.improvements.map((item) => item.category),
      enhancedResumeContent,
    };

    setUploadedFiles((previousFiles) =>
      previousFiles.map((currentFile) => (currentFile.id === file.id ? enhancedFile : currentFile))
    );
    setSelectedFile(enhancedFile);
  };

  const handleGenerateResume = async () => {
    if (!generationForm.full_name || !generationForm.job_title || !generationForm.role) {
      setError('Please fill in Name, Job Title, and Role');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationForm),
      });

      if (!response.ok) throw new Error('Failed to generate resume');
      const data = await response.json();
      setGeneratedResume(data.resume_data);
    } catch (err) {
      setError(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadGeneratedResume = async () => {
    try {
      const response = await fetch('http://localhost:8000/generate-resume-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationForm),
      });

      if (!response.ok) throw new Error('Failed to download resume');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${generationForm.full_name.replace(/\s+/g, '_')}_Resume.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    }
  };

  const handleDemoUpload = async () => {
    const demoFile = new File(['Demo resume content for testing'], 'Demo_Resume.pdf', {
      type: 'application/pdf',
    });
    await processFile(demoFile);
  };

  const suggestions = [
    { category: 'Skills', issue: 'Add more technical skills', severity: 'warning' },
    { category: 'Format', issue: 'Use consistent date formatting', severity: 'info' },
    { category: 'Keywords', issue: 'Include industry keywords for better matching', severity: 'warning' },
    { category: 'Experience', issue: 'Expand bullet points with quantifiable achievements', severity: 'warning' },
  ];

  const handleFormChange = (field, value) => {
    setGenerationForm(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setGenerationForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setGenerationForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setGenerationForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index) => {
    setGenerationForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Resume AI</h1>
        <p className="text-muted-foreground">Upload and analyze your resume with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-2xl bg-card/40 border border-border">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-12 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                dragActive
                  ? 'border-primary/60 bg-primary/5'
                  : 'border-border bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Drag and drop your resume</h3>
                <p className="text-muted-foreground text-sm mb-4">or</p>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium transition-colors"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Browse Files'}
                  </button>
                </label>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleBrowseFiles}
                  disabled={isAnalyzing}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-4">PDF, DOC, DOCX • Max 5MB</p>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Tip:</strong> For best results, use a clean format with clear sections: Contact, Summary, Experience, Skills, Education.
                </p>
              </div>

              <button
                onClick={handleDemoUpload}
                disabled={isAnalyzing}
                className="w-full px-4 py-3 rounded-lg border border-primary/50 hover:border-primary/80 disabled:border-primary/30 text-primary font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                    Analyzing...
                  </>
                ) : (
                  '📄 Try Demo Upload'
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-card/40 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h3>
            {uploadedFiles.length === 0 ? (
              <p className="text-muted-foreground text-sm">No resumes uploaded yet. Upload your first resume to get started!</p>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => viewAnalysis(file)}
                    className="p-4 rounded-lg bg-white/5 border border-border/50 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">Uploaded {file.uploadedAt}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${file.enhanced ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {file.enhanced ? 'Enhanced' : 'Analyzed'}
                        </span>
                        {file.enhanced && file.enhancedAt && (
                          <span className="text-muted-foreground">Enhanced {file.enhancedAt}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {file.status === 'analyzed' && (
                        <div className="text-right">
                          <p className="font-bold text-green-400 text-lg">{file.score}</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                      {file.status === 'enhanced' && (
                        <div className="text-right">
                          <p className="font-bold text-emerald-400 text-lg">{file.score}</p>
                          <p className="text-xs text-muted-foreground">Enhanced</p>
                        </div>
                      )}
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generate Resume Section */}
        <div>
          <button
            onClick={() => setIsGenerationModalOpen(true)}
            className="w-full p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-3 text-left">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Generate Resume</h3>
                <p className="text-sm text-muted-foreground mt-1">Create ATS-friendly resume with AI</p>
              </div>
              <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            </div>
          </button>

          {/* Suggestions */}
          <div className="mt-6 p-6 rounded-2xl bg-card/40 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-foreground">Improvement Tips</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 border border-border/50">
                  <div className="flex items-start gap-3">
                    {item.severity === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">{item.category}</p>
                      <p className="text-sm text-foreground mt-1">{item.issue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Resume Analysis Results"
        size="2xl"
      >
        {selectedFile && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-300 text-sm">
                <strong>File:</strong> {selectedFile.name}
              </p>
              {selectedFile.enhanced && (
                <p className="text-green-300 text-sm mt-2">
                  This uploaded resume has been enhanced in-app and the score has been updated.
                </p>
              )}
            </div>

            {/* Score */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Resume Score</p>
                  <p className="text-4xl font-bold text-green-400">{getAnalysisData(selectedFile).score}/100</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Performance</p>
                  <p className="text-lg font-semibold text-green-300">
                    {getAnalysisData(selectedFile).score >= 80 ? 'Excellent' : 'Good'}
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">✨ Strengths</h4>
              <div className="space-y-2">
                {getAnalysisData(selectedFile).strengths.map((strength, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-200">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas to Improve */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">⚡ Areas to Improve</h4>
              <div className="space-y-2">
                {getAnalysisData(selectedFile).weaknesses.map((weakness, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-200">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Improvements */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">🚀 How to Enhance Your Resume</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getAnalysisData(selectedFile).improvements.map((improvement) => (
                  <div key={improvement.id} className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30">
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-foreground">{improvement.title}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          improvement.priority === 'High' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {improvement.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Category: {improvement.category}</p>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-medium text-muted-foreground">Implementation Steps:</p>
                      {improvement.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-foreground/80 pl-2">
                          <span className="text-purple-400 flex-shrink-0">→</span>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-border/30">
                      <p className="text-xs text-green-300">
                        <span className="font-semibold">💪 Impact:</span> {improvement.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedFile.enhanced && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h5 className="font-semibold text-emerald-300 mb-2">Enhanced Resume Ready</h5>
                <p className="text-sm text-emerald-100">
                  All listed improvement areas have been applied to this uploaded resume. You can now download the enhanced version.
                </p>
              </div>
            )}

            {selectedFile.enhanced && selectedFile.enhancementNotes && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h5 className="font-semibold text-emerald-300 mb-2">Applied Enhancements</h5>
                <ul className="space-y-2 text-sm text-emerald-100">
                  {selectedFile.enhancementNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => (selectedFile.enhanced ? downloadEnhancedResume(selectedFile) : enhanceResume(selectedFile))}
                className="flex-1 px-4 py-3 rounded-lg border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 font-medium transition-colors"
              >
                {selectedFile.enhanced ? '📥 Download Enhanced Resume' : '✨ Enhance This Resume'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              >
                Close Analysis
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Resume Generation Modal */}
      <Modal
        isOpen={isGenerationModalOpen}
        onClose={() => {
          setIsGenerationModalOpen(false);
          setGeneratedResume(null);
        }}
        title={generatedResume ? "Generated Resume Preview" : "Generate ATS-Friendly Resume"}
        size="2xl"
      >
        {!generatedResume ? (
          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <input
                  type="text"
                  value={generationForm.full_name}
                  onChange={(e) => handleFormChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={generationForm.job_title}
                    onChange={(e) => handleFormChange('job_title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                    placeholder="Senior Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role *</label>
                  <input
                    type="text"
                    value={generationForm.role}
                    onChange={(e) => handleFormChange('role', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                    placeholder="Full Stack Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                  <input
                    type="text"
                    value={generationForm.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                    placeholder="Tech Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={generationForm.years_experience}
                    onChange={(e) => handleFormChange('years_experience', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Technical Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                    placeholder="e.g., React, Node.js"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generationForm.skills.map((skill, idx) => (
                    <div key={idx} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm flex items-center gap-2">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-primary/80"
                        onClick={() => removeSkill(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Key Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none"
                    placeholder="e.g., Led team of 5, Improved performance by 40%"
                  />
                  <button
                    onClick={addAchievement}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {generationForm.achievements.map((achievement, idx) => (
                    <div key={idx} className="p-2 rounded bg-white/5 border border-border/50 flex items-center justify-between text-sm text-foreground">
                      <span>{achievement}</span>
                      <X
                        className="w-4 h-4 cursor-pointer hover:text-red-300"
                        onClick={() => removeAchievement(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerateResume}
                disabled={isGenerating}
                className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Resume
                  </>
                )}
              </button>
              <button
                onClick={() => setIsGenerationModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-300 text-sm">
                Your ATS-friendly resume has been generated! Download it as a Word document below.
              </p>
            </div>

            {/* Preview */}
            <div className="p-6 rounded-lg bg-white text-black text-sm space-y-4 max-h-96 overflow-y-auto">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{generationForm.full_name}</h2>
                <p className="text-gray-600">{generationForm.job_title} | {generationForm.role}</p>
              </div>

              {generatedResume?.summary && (
                <div>
                  <h3 className="font-bold text-lg mb-2">PROFESSIONAL SUMMARY</h3>
                  <p className="text-gray-700">{generatedResume.summary}</p>
                </div>
              )}

              {generatedResume?.skills && (
                <div>
                  <h3 className="font-bold text-lg mb-2">CORE SKILLS</h3>
                  <p className="text-gray-700">{(generatedResume.skills || []).join(', ')}</p>
                </div>
              )}

              {generatedResume?.experience && (
                <div>
                  <h3 className="font-bold text-lg mb-2">PROFESSIONAL EXPERIENCE</h3>
                  {generatedResume.experience.map((job, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="font-bold">{job.title} | {job.company}</p>
                      <p className="text-gray-600 text-xs">{job.duration}</p>
                      <ul className="list-disc list-inside text-gray-700 text-xs mt-1">
                        {job.bullets?.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadGeneratedResume}
                className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download as DOCX
              </button>
              <button
                onClick={() => {
                  setGeneratedResume(null);
                  setIsGenerationModalOpen(false);
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Resume;
