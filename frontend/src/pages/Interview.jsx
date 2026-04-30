import { Mic, Volume2, Clock, CheckCircle, Play } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/Modal';

const Interview = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [isRecording, setIsRecording] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const interviewQuestions = {
    easy: [
      {
        id: 1,
        question: "Tell me about yourself and your background.",
        category: "Introduction",
      },
      {
        id: 2,
        question: "What are your key technical skills?",
        category: "Skills",
      },
    ],
    medium: [
      {
        id: 1,
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        category: "Experience",
      },
      {
        id: 2,
        question: "How do you stay updated with the latest technologies?",
        category: "Growth",
      },
      {
        id: 3,
        question: "Walk us through your problem-solving approach.",
        category: "Technical",
      },
    ],
    hard: [
      {
        id: 1,
        question: "Design a system architecture for a high-traffic application.",
        category: "System Design",
      },
      {
        id: 2,
        question: "How would you handle a critical production bug during peak hours?",
        category: "Crisis Management",
      },
      {
        id: 3,
        question: "Describe your leadership approach and team collaboration style.",
        category: "Leadership",
      },
    ],
  };

  const handleStartInterview = () => {
    setIsInterviewActive(true);
    setIsRecording(true);
    setIsModalOpen(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleNextQuestion = () => {
    const questions = interviewQuestions[selectedDifficulty.toLowerCase()];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = () => {
    setIsRecording(false);
    setIsInterviewActive(false);
    // Could add score calculation here
  };

  const interviewSessions = [
    {
      id: 1,
      title: 'Technical Round - System Design',
      difficulty: 'Hard',
      duration: '45 mins',
      score: 82,
      date: '3 days ago',
      feedback: 'Great architecture knowledge. Work on edge case handling.',
    },
    {
      id: 2,
      title: 'Behavioral Interview',
      difficulty: 'Medium',
      duration: '30 mins',
      score: 78,
      date: '1 week ago',
      feedback: 'Good communication. Provide more specific examples.',
    },
    {
      id: 3,
      title: 'Coding Challenge - Arrays',
      difficulty: 'Medium',
      duration: '25 mins',
      score: 85,
      date: '2 weeks ago',
      feedback: 'Excellent problem solving. Time complexity could be optimized.',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Mock Interview</h1>
        <p className="text-muted-foreground">Practice with AI-powered interview scenarios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Start Interview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-card/40 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Start New Interview</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Difficulty Level</label>
                <div className="space-y-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff.toLowerCase())}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all text-left ${
                        selectedDifficulty === diff.toLowerCase()
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 border border-border hover:bg-white/10'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  📹 Make sure your camera and microphone are working properly.
                </p>
              </div>

              <button
                onClick={handleStartInterview}
                className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
            </div>
          </div>

          {/* Recording Status */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse text-red-400' : 'text-muted-foreground'}`} />
              <h4 className="font-semibold text-foreground">Recording {isRecording ? 'Active' : 'Inactive'}</h4>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-300 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                Recording in progress...
              </div>
            )}
          </div>
        </div>

        {/* Interview History */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-card/40 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Interview History</h3>
            <div className="space-y-4">
              {interviewSessions.map((session) => (
                <div key={session.id} className="p-4 rounded-xl bg-white/5 border border-border/50 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{session.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-medium">
                          {session.difficulty}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.duration}
                        </div>
                        <span>{session.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">{session.score}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Feedback: </span>
                      {session.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Clear Communication', icon: Volume2, desc: 'Speak clearly and at a good pace.' },
          { title: 'Structure Your Answers', icon: CheckCircle, desc: 'Use STAR method for behavioral questions.' },
          { title: 'Practice Regularly', icon: Clock, desc: 'Do 2-3 mock interviews per week.' },
        ].map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div key={i} className="p-6 rounded-2xl bg-card/40 border border-border">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">{tip.title}</h4>
              <p className="text-muted-foreground text-sm">{tip.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          handleFinishInterview();
        }}
        title="Mock Interview"
        size="2xl"
      >
        {isInterviewActive && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-300 text-sm">
                <strong>Difficulty:</strong> {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Question {currentQuestion + 1}</h3>
                <span className="text-muted-foreground text-sm">
                  {currentQuestion + 1} of {interviewQuestions[selectedDifficulty.toLowerCase()].length}
                </span>
              </div>
              <div className="p-6 rounded-lg bg-white/5 border border-border/50">
                <p className="text-foreground text-lg mb-2">
                  {interviewQuestions[selectedDifficulty.toLowerCase()][currentQuestion].question}
                </p>
                <p className="text-muted-foreground text-sm">
                  Category: {interviewQuestions[selectedDifficulty.toLowerCase()][currentQuestion].category}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 animate-pulse text-red-400" />
                  <span className="font-semibold text-foreground">Recording Active</span>
                </div>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className="px-4 py-2 rounded-lg border border-red-500/50 text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  {isRecording ? 'Stop' : 'Resume'}
                </button>
              </div>
              <p className="text-red-300 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                Recording your response...
              </p>
            </div>

            <div className="flex gap-3">
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex-1 px-4 py-3 rounded-lg border border-primary/50 text-primary font-medium hover:bg-primary/10 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNextQuestion}
                className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              >
                {currentQuestion === interviewQuestions[selectedDifficulty.toLowerCase()].length - 1
                  ? 'Finish Interview'
                  : 'Next Question'}
              </button>
            </div>

            <p className="text-center text-muted-foreground text-sm">
              💡 Take your time to answer thoroughly. Your response is being recorded.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Interview;
