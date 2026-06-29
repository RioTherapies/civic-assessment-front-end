import React, { useState } from 'react';
import {
  ChevronRight, CheckCircle2,
  ShieldCheck, Lock, ChevronDown, ChevronUp,
  Wrench, Search, Palette, Heart, TrendingUp, Archive,
  Menu, X, Droplets, Calendar, User, MapPin, MessageSquare
} from 'lucide-react';
import {
  activismTypes as activismTypeData,
  civicActions,
  dimensionNames,
  pagesData,
  promptData,
  radarLabelsMap,
  scoreAssessment,
  type AssessmentAnswers,
  type Dimension,
  type DimensionScores,
  type LikertValue,
  type PromptCode,
  type ScoredCivicAction,
} from '@rio/civic-assessment';

const activismTypeIcons: Record<Dimension, React.ReactNode> = {
  R: <Wrench className="w-12 h-12 text-teal-600 mb-4" />,
  I: <Search className="w-12 h-12 text-blue-600 mb-4" />,
  A: <Palette className="w-12 h-12 text-cyan-600 mb-4" />,
  S: <Heart className="w-12 h-12 text-sky-600 mb-4" />,
  E: <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />,
  C: <Archive className="w-12 h-12 text-slate-600 mb-4" />,
};

const activismTypes = Object.fromEntries(
  Object.entries(activismTypeData).map(([id, data]) => [
    id,
    { ...data, icon: activismTypeIcons[id as Dimension] },
  ])
) as Record<Dimension, (typeof activismTypeData)[Dimension] & { icon: React.ReactNode }>;

const RadarChart = ({ scores }) => {
  const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
  const size = 320;
  const center = size / 2;
  const radius = (size / 2) - 40; 
  
  const angleStep = (Math.PI * 2) / 6;
  const startAngle = -Math.PI / 2;

  const getPoint = (score, index) => {
    const normalizedDistance = (Math.max(0, Math.min(score, 3)) / 3) * radius;
    const angle = startAngle + (index * angleStep);
    return {
      x: center + Math.cos(angle) * normalizedDistance,
      y: center + Math.sin(angle) * normalizedDistance
    };
  };

  const scorePoints = dimensions.map((dim, i) => getPoint(scores[dim] || 0, i));
  const polygonPoints = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

  const webLevels = [1, 2, 3];
  
  return (
    <div className="flex justify-center items-center p-4">
      <svg width={size} height={size} className="overflow-visible">
        {webLevels.map((level) => {
          const distance = (level / 3) * radius;
          const points = dimensions.map((_, i) => {
            const angle = startAngle + (i * angleStep);
            return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
          }).join(' ');
          return (
            <polygon key={`web-${level}`} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          );
        })}
        
        {dimensions.map((_, i) => {
          const angle = startAngle + (i * angleStep);
          return (
            <line 
              key={`axis-${i}`}
              x1={center} y1={center}
              x2={center + Math.cos(angle) * radius} y2={center + Math.sin(angle) * radius}
              stroke="#e2e8f0" strokeWidth="1.5"
            />
          );
        })}

        <polygon 
          points={polygonPoints} 
          fill="rgba(6, 182, 212, 0.35)" // cyan-500 equivalent 
          stroke="#06b6d4" 
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {scorePoints.map((p, i) => (
          <circle key={`pt-${i}`} cx={p.x} cy={p.y} r="5" fill="#0891b2" stroke="white" strokeWidth="1.5" />
        ))}

        {dimensions.map((dim, i) => {
          const angle = startAngle + (i * angleStep);
          const labelDist = radius + 25;
          const x = center + Math.cos(angle) * labelDist;
          const y = center + Math.sin(angle) * labelDist;
          
          return (
            <text 
              key={`label-${i}`} 
              x={x} y={y} 
              dominantBaseline="middle" 
              textAnchor="middle"
              className="text-base font-bold fill-slate-700 font-sans"
            >
              {radarLabelsMap[dim]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const TypeDetail = ({ typeId }) => {
  const data = activismTypes[typeId];
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-300">
      <div className={`border rounded-3xl p-8 sm:p-12 shadow-sm ${data.color}`}>
        <div className="flex justify-center">
          {data.icon}
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-4">{data.title}</h2>
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 opacity-80">You are {data.resultTitle}</h3>
        
        <div className="space-y-6">
          <div className="bg-white/60 p-6 rounded-2xl backdrop-blur-sm">
            <h4 className="font-bold text-lg mb-2 text-slate-900">Personality Traits</h4>
            <p className="leading-relaxed text-slate-800">{data.description}</p>
          </div>
          <div className="bg-white/60 p-6 rounded-2xl backdrop-blur-sm">
            <h4 className="font-bold text-lg mb-2 text-slate-900">Activism Approach</h4>
            <p className="leading-relaxed text-slate-800">{data.resultText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionsDirectory = () => {
  const [expandedActionId, setExpandedActionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', action: '', description: '' });

  // Sorting civic actions from least time commitment to most
  const sortedActions = [...civicActions].sort((a, b) => a.Time - b.Time);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', action: '', description: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-10 space-y-12 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Submission Form */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Submit an Idea</h2>
        <p className="text-slate-600 mb-8">
          The world of activism is vast. Have an idea for a civic action that isn't listed here? 
          Submit it below for consideration to be added to our database!
        </p>
        
        {submitted ? (
          <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 p-6 rounded-xl flex items-center justify-center space-x-3">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">Thank you! Your idea has been submitted successfully.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Your Name</label>
                <input 
                  type="text" id="name" name="name" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
                <input 
                  type="email" id="email" name="email" required
                  value={formData.email} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="action">Action Title</label>
              <input 
                type="text" id="action" name="action" required
                value={formData.action} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Organize a community fridge"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">Action Description</label>
              <textarea 
                id="description" name="description" rows="3" required
                value={formData.description} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Describe what the action is and why it's impactful..."
              ></textarea>
            </div>
            <button 
              type="submit" disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Idea'}
            </button>
          </form>
        )}
      </section>

      {/* Directory List */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Civic Action Directory</h2>
          <p className="text-slate-600">Browse the complete list of {sortedActions.length} activism opportunities currently available in our database, sorted by lowest time commitment to highest.</p>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {sortedActions.map((action, index) => {
            const isExpanded = expandedActionId === action.name;
            const badges = ['R', 'I', 'A', 'S', 'E', 'C'].filter(dim => action[dim] >= 1.5);
            const badgeNames = badges.map(b => dimensionNames[b]).join(', ');

            return (
              <div key={action.name} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-cyan-300 transition-colors">
                <div 
                  className="p-4 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  onClick={() => setExpandedActionId(isExpanded ? null : action.name)}
                >
                  <div className="flex-1">
                    <div className="flex items-start sm:items-center gap-3 mb-3 lg:mb-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mt-0.5 sm:mt-0">
                        {index + 1}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{action.name}</h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 ml-9">
                      {badges.map(b => (
                        <span 
                          key={b} 
                          title={`This action is a good fit for ${badgeNames}`}
                          className="px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-600 cursor-help"
                        >
                          {dimensionNames[b]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-6 ml-9 lg:ml-0 text-sm mt-2 lg:mt-0 border-t lg:border-0 border-slate-100 pt-3 lg:pt-0">
                    <div className="flex flex-col items-center group relative cursor-help">
                      <span className="font-bold text-slate-800">{action.E_I}/10</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Social</span>
                    </div>
                    
                    <div className="flex flex-col items-center group relative cursor-help">
                      <span className="font-bold text-slate-800">{action.Dis}/10</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Access</span>
                    </div>

                    <div className="flex flex-col items-center group relative cursor-help">
                      <span className="font-bold text-slate-800">{action.Time}/10</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Time</span>
                    </div>

                    <div className="text-slate-400 pl-2">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100">
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base ml-0 lg:ml-9">
                      {action.desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const ConsultationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', location: '', goals: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', location: '', goals: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
        
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Request a Live Consultation</h2>
          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
            Not sure where to begin? We offer a free 30-minute live consultation to go over your RIO Civic Assessment results and help find appropriate, actionable civic opportunities right in your local area.
          </p>
        </div>

        {submitted ? (
          <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-cyan-600" />
            <h3 className="text-xl font-bold">Request Received!</h3>
            <p className="text-cyan-700">
              Thank you for reaching out. We will review your request and get back to you shortly to schedule your 30-minute consultation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center" htmlFor="name">
                  <User className="w-4 h-4 mr-2 text-slate-400" /> Full Name
                </label>
                <input 
                  type="text" id="name" name="name" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center" htmlFor="email">
                  <Droplets className="w-4 h-4 mr-2 text-slate-400" /> Email Address
                </label>
                <input 
                  type="email" id="email" name="email" required
                  value={formData.email} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center" htmlFor="location">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Location (City, State / Zip)
              </label>
              <input 
                type="text" id="location" name="location" required
                value={formData.location} onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Austin, TX 78701"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center" htmlFor="goals">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Briefly describe your civic goals
              </label>
              <textarea 
                id="goals" name="goals" rows="4" required
                value={formData.goals} onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="I want to help with environmental causes but I only have 2 hours a week..."
              ></textarea>
            </div>
            <p className="text-xs text-slate-500 italic text-center">
              * Note: This request is completely separate from the assessment tool and will not affect your results or grading.
            </p>
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? 'Sending Request...' : 'Request Consultation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-12">
        
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Test</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              When I speak to people about engaging in their communities or activism, the response I get most frequently is “I just don’t know what to do.” This assessment was designed to try to help people address that very issue. My hope is that by taking this test, you feel that you have a clear sense of how you can get involved in your community through actions that are sustainable and rewarding.
            </p>
            <p>
              This test is inspired by Dr. John L. Holland’s theory of career and vocational choice. He explored a set of six personality types (historically known as RIASEC: Realistic, Investigative, Artistic, Social, Entrepreneurial, and Conventional) that mapped on to the world of work. Holland believed that when people did work aligned with their interests, they were intrinsically rewarded, and thus experiencing greater stability, satisfaction, and achievement in their career.
            </p>
            <p>
              Having worked with people across the spectrum of activism experience - from people considering volunteering at a local animal shelter, to long-time community organizers - I’ve seen that mismatch between personality and activism activities prevents people from engaging in it and burns people out faster. This test is designed to assess your specific activism interests based on your personality, then present you with direct opportunities by which you can put them to work making a difference in the world.
            </p>
            <p>
              That being said, don’t let this limit you in terms of your engagement in activism. I currently have about 100 activism activities listed as possible outcomes, but the world of activism is far larger. This assessment is a starting point, not a definitive profile. Your interests are complex and context-dependent; treat these results as an invitation to explore, not a prescription.
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Writer</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              I (Robert Ortega, Ph.D.) am a licensed clinical psychologist in the Washington, D.C. area. While in graduate school at the University of Oregon, I studied the concepts of Liberation Psychology and Critical Consciousness under Ellen McWhirter, Ph.D. I learned a lot during that time, but one of the things I was most interested in was how our engagement in our communities and through activism can have a positive impact on mental health. I published two articles on the subject and wrote my dissertation on the intersection between depression and voting behaviors in young adults.
            </p>
            <p>
              Since then, I’ve worked with people in private practice. Over and over, I’ve heard people’s struggles with feeling helpless and worried about what is going on in the world. Given my extremely niche graduate experience, I have been able to help people develop a greater sense of efficacy around their engagement in these systems. But recently, I myself have struggled with feeling that I am only able to help a small number of people through my direct clinical practice.
            </p>
            <p>
              That’s why I wanted to create this assessment. While I can practically and ethically only work with so many people in clinical practice, this test can reach many more people in a day than I can work with in a lifetime. My goal for this assessment is helping people find accessible, realistic options for activism that fit their personalities.
            </p>
            <p>
              If you wish to read more about my writings on the intersection between mental health and sociopolitics, visit my Substack <a href="https://substack.com/@robertortegaphd" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">here</a> and my website (<a href="https://www.riotherapies.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">https://www.riotherapies.com/</a>).
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Use of A.I.</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              A.I. was used in the programming of this website. The test questions, process, and outcomes were all developed by Robert Ortega, Ph.D. Our small team debated the costs and benefits of using A.I. vs traditional website development options. We ultimately decided that due to this being a self-funded project and our desire to publish it quickly, we would use A.I. to build the infrastructure around the test. In the future, should this assessment become very popular, we would love to hire a website developer to grow the site.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [step, setStep] = useState('welcome');
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [, setResearchConsent] = useState<boolean | null>(null);
  const [finalScores, setFinalScores] = useState<DimensionScores | null>(null);
  const [userTypes, setUserTypes] = useState<Dimension[]>([]);
  const [recommendedActions, setRecommendedActions] = useState<ScoredCivicAction[]>([]);
  const [showAllActions, setShowAllActions] = useState(false);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalPages = pagesData.length;

  const navigateTo = (route) => {
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    window.scrollTo(0, 0);
  };

  const startAssessment = () => {
    setStep('consent');
    setCurrentPage(0);
    setAnswers({});
    setFinalScores(null);
    setResearchConsent(null);
    window.scrollTo(0, 0);
  };

  const beginQuiz = (consentValue) => {
    setResearchConsent(consentValue);
    setStep('quiz');
    window.scrollTo(0, 0);
  };

  const handleSelectOption = (promptCode: PromptCode, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [promptCode]: value }));
  };

  const calculateResults = () => {
    const result = scoreAssessment(answers);
    setFinalScores(result.scores);
    setUserTypes(result.types);
    setRecommendedActions(result.recommendedActions);
    setStep('results');
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      calculateResults();
    }
  };

  const renderWelcome = () => (
    <div className="animate-in fade-in zoom-in-95 duration-300 relative">
      
      {/* Decorative River Background using SVG waves */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg">
          <path fill="#0284c7" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,160C672,160,768,192,864,197.3C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative z-10 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <Droplets className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500 pb-2">
          RIO Civic Assessment
        </h2>
        <p className="text-xl text-slate-700 mb-10 leading-relaxed max-w-2xl mx-auto">
          This structured evaluation will identify your primary <span className="font-bold text-blue-700">Activism type</span> and translate it into actionable political engagement strategies based on multidimensional analysis.
        </p>
        <button 
          onClick={startAssessment}
          className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Begin Evaluation <ChevronRight className="ml-2 w-6 h-6" />
        </button>

        {/* Testimonials Section */}
        <div className="mt-20 pt-16 border-t border-slate-200/60">
          <h3 className="text-2xl font-bold text-slate-800 mb-10">Real Impact. Real People.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-600 italic mb-4 leading-relaxed">
                "I always felt paralyzed by the news. The RIO assessment showed me that my skills as a <span className="font-bold text-cyan-600">Storyteller</span> were exactly what my local climate group needed."
              </p>
              <div className="font-bold text-slate-800 text-sm">- Sarah T.</div>
            </div>
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-600 italic mb-4 leading-relaxed">
                "Finding out I was an <span className="font-bold text-slate-600">Organizer</span> completely changed how I volunteer. Instead of burning out at protests, I now manage logistics for a food bank and love it!"
              </p>
              <div className="font-bold text-slate-800 text-sm">- Marcus J.</div>
            </div>
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-600 italic mb-4 leading-relaxed">
                "The <span className="font-bold text-blue-600">Analyst</span> profile fit me perfectly. I now use my skills to help my neighborhood council audit traffic safety data in our area."
              </p>
              <div className="font-bold text-slate-800 text-sm">- Elena R.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="p-8 sm:p-12 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <ShieldCheck className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-slate-900">Data & Privacy Consent</h2>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 text-slate-600 leading-relaxed space-y-4">
        <p>Before you begin, we want to be fully transparent about how your data is handled. We are conducting ongoing psychological research to better understand how different personality types engage in political activism.</p>
        <p className="font-medium text-slate-800 flex items-center"><Lock className="w-5 h-5 text-blue-500 mr-2" /> We will never sell your data to third parties.</p>
        <p>If you opt-in, your assessment results will be anonymized and aggregated into a research dataset to help improve strategies for civic organizations. No personally identifiable information will be tied to your answers.</p>
        <p>You are completely free to opt out. Opting out will not affect your ability to take the assessment or view your results.</p>
      </div>
      <div className="space-y-4">
        <button onClick={() => beginQuiz(true)} className="w-full p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-between font-medium">
          <span className="text-left">I consent to my anonymized results being used for research.</span><ChevronRight className="w-5 h-5 opacity-70 flex-shrink-0 ml-2" />
        </button>
        <button onClick={() => beginQuiz(false)} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-between font-medium">
          <span className="text-left">I want to take the assessment, but opt out of the research.</span><ChevronRight className="w-5 h-5 opacity-70 flex-shrink-0 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const currentPrompts = pagesData[currentPage];
    const isCurrentPageComplete = currentPrompts.every(code => answers[code] !== undefined);

    return (
      <div className="p-4 sm:p-10 max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm font-medium text-slate-500 mb-3">
            <span>Page {currentPage + 1} of {totalPages}</span>
            <span>{Math.round(((currentPage) / totalPages) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentPage) / totalPages) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6 mb-8 text-blue-900 leading-relaxed font-medium text-sm sm:text-base shadow-sm">
          How much would you enjoy this activity? Do not worry about how skilled or experienced you are at it, how much money you can make from the activity, or the prestige of it. Instead, only focus on how much you would enjoy doing it.
        </div>

        <div className="space-y-6 sm:space-y-8">
          {currentPrompts.map((code) => (
            <div key={code} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-6 leading-snug">{promptData[code]}</h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider hidden sm:block w-16">Dislike</span>
                <div className="flex justify-between w-full sm:w-auto sm:justify-center gap-2 sm:gap-6">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val} className="flex flex-col items-center cursor-pointer group flex-1 sm:flex-none">
                      <input type="radio" name={`prompt-${code}`} value={val} checked={answers[code] === val} onChange={() => handleSelectOption(code, val)} className="sr-only" />
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all ${answers[code] === val ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400 bg-white'}`}>
                        {answers[code] === val && <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>}
                      </div>
                      {(val === 1 || val === 5) && (
                        <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider sm:hidden ${val === 1 ? 'text-slate-400' : 'text-blue-600'}`}>
                          {val === 1 ? 'Dislike' : 'Like'}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider hidden sm:block w-16 text-right">Like</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleNextPage} disabled={!isCurrentPageComplete}
            className={`px-8 py-4 text-base font-bold rounded-full transition-all flex items-center ${isCurrentPageComplete ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-md' : 'text-slate-400 bg-slate-200 cursor-not-allowed'}`}
          >
            {currentPage === totalPages - 1 ? 'Calculate Results' : 'Next Page'} <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const visibleActions = showAllActions ? recommendedActions : recommendedActions.slice(0, 10);

    return (
      <div className="p-4 sm:p-10 max-w-5xl mx-auto space-y-12 sm:space-y-16 animate-in fade-in duration-300">
        <section className="text-center pt-8">
          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6">Your Civic Identity</h2>
          <div className="space-y-6">
            {userTypes.map((typeCode, index) => {
              const typeData = activismTypes[typeCode];
              return (
                <div key={typeCode} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-tight">
                    {index === 0 ? "You are " : "You are also "}
                    <span className="text-blue-600">{typeData.resultTitle}</span>
                  </h3>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto text-left sm:text-center">
                    {typeData.resultText}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm flex flex-col items-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 text-center">Your Profile</h3>
          <p className="text-slate-500 mb-6 text-center max-w-lg text-sm sm:text-base">
            This chart maps your unique alignment across the six dimensions of civic work.
          </p>
          <RadarChart scores={finalScores} />
        </section>

        <section>
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Recommended Actions</h3>
            <p className="text-slate-600 text-sm sm:text-base">
              These specific activities closely match your Euclidean profile. 
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {visibleActions.map((action, index) => {
              const isExpanded = expandedActionId === action.id;
              const badges = ['R', 'I', 'A', 'S', 'E', 'C'].filter(dim => action[dim] >= 1.5);
              const badgeNames = badges.map(b => dimensionNames[b]).join(', ');

              return (
                <div key={action.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                  <div 
                    className="p-4 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    onClick={() => setExpandedActionId(isExpanded ? null : action.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-start sm:items-center gap-3 mb-3 lg:mb-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mt-0.5 sm:mt-0">
                          {index + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{action.name}</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 ml-9">
                        {badges.map(b => (
                          <span 
                            key={b} 
                            title={`This action is a good fit for ${badgeNames}`}
                            className="px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-800 cursor-help"
                          >
                            {dimensionNames[b]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-6 ml-9 lg:ml-0 text-sm mt-2 lg:mt-0 border-t lg:border-0 border-slate-100 pt-3 lg:pt-0">
                      <div className="flex flex-col items-center group relative cursor-help">
                        <span className="font-bold text-slate-800">{action.E_I}/10</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Social</span>
                      </div>
                      
                      <div className="flex flex-col items-center group relative cursor-help">
                        <span className="font-bold text-slate-800">{action.Dis}/10</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Access</span>
                      </div>

                      <div className="flex flex-col items-center group relative cursor-help">
                        <span className="font-bold text-slate-800">{action.Time}/10</span>
                        <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Time</span>
                      </div>

                      <div className="text-slate-400 pl-2">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100">
                      <p className="text-slate-700 leading-relaxed text-sm sm:text-base ml-0 lg:ml-9">
                        {action.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!showAllActions && recommendedActions.length > 10 && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowAllActions(true)}
                className="w-full sm:w-auto px-8 py-3 rounded-full border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
              >
                See more actions
              </button>
            </div>
          )}
        </section>

        <div className="text-center pt-10 border-t border-slate-200">
          <button 
            onClick={() => setStep('welcome')}
            className="text-blue-600 font-bold hover:text-blue-800"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-sans selection:bg-cyan-200 selection:text-cyan-900">
      
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
              <Droplets className="w-6 h-6 text-blue-600 mr-2" />
              <span className="font-bold text-slate-900 text-lg tracking-tight">RIO Assessment</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigateTo('home')} 
                className={`text-sm font-bold transition-colors ${currentRoute === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Home
              </button>
              
              {/* Dropdown for Activism Types */}
              <div 
                className="relative group h-full flex items-center"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className={`flex items-center text-sm font-bold transition-colors ${currentRoute.startsWith('type-') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                  Activism Type <ChevronDown className="ml-1 w-4 h-4 opacity-70" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-10 -left-4 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                    {Object.values(activismTypes).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => navigateTo(`type-${type.id}`)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                      >
                        {dimensionNames[type.id]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigateTo('actions')} 
                className={`text-sm font-bold transition-colors ${currentRoute === 'actions' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Civic Actions
              </button>
              <button 
                onClick={() => navigateTo('consultation')} 
                className={`text-sm font-bold transition-colors ${currentRoute === 'consultation' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Consultation
              </button>
              <button 
                onClick={() => navigateTo('about')} 
                className={`text-sm font-bold transition-colors ${currentRoute === 'about' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                About Us
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-slate-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => navigateTo('home')} 
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold text-slate-900 hover:bg-slate-50"
              >
                Home
              </button>
              
              <div className="px-3 py-2 text-sm font-bold text-slate-400 uppercase tracking-wider">Activism Types</div>
              <div className="pl-6 space-y-1">
                {Object.values(activismTypes).map((type) => (
                  <button
                    key={type.id}
                    onClick={() => navigateTo(`type-${type.id}`)}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {dimensionNames[type.id]}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => navigateTo('actions')} 
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold text-slate-900 hover:bg-slate-50 mt-2"
              >
                Civic Actions
              </button>
              <button 
                onClick={() => navigateTo('consultation')} 
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold text-slate-900 hover:bg-slate-50 mt-2"
              >
                Consultation
              </button>
              <button 
                onClick={() => navigateTo('about')} 
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold text-slate-900 hover:bg-slate-50"
              >
                About Us
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="py-8 relative z-10">
        {currentRoute === 'home' && (
          <>
            {step === 'welcome' && renderWelcome()}
            {step === 'consent' && renderConsent()}
            {step === 'quiz' && renderQuiz()}
            {step === 'results' && renderResults()}
          </>
        )}
        
        {currentRoute.startsWith('type-') && (
          <TypeDetail typeId={currentRoute.split('-')[1]} />
        )}

        {currentRoute === 'actions' && (
          <ActionsDirectory />
        )}

        {currentRoute === 'consultation' && (
          <ConsultationPage />
        )}

        {currentRoute === 'about' && (
          <AboutUs />
        )}
      </main>

    </div>
  );
}