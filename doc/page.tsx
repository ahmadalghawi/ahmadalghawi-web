'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import {
  Terminal,
  FileCode,
  Folder,
  Play,
  GitBranch,
  Database,
  Server,
  Code,
  Monitor,
  Mail,
  Github,
  ExternalLink,
  Download,
  User,
  Briefcase,
  Rocket,
  Coffee,
  Zap,
  Bug,
  Settings
} from 'lucide-react';
import { experiences } from '../../data/experienceData';
import projectsData from '../../data/projectsData';
import UniversalNavigation from '../../components/UniversalNavigation';

// Developer Playground Theme - Fresh Implementation
const DeveloperPlaygroundPortfolio = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{command: string, output: string[]}>>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Terminal command processing
  const processCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    let output: string[] = [];

    switch (cmd) {
      case 'help':
        output = [
          'Available commands:',
          '  help          - Show this help message',
          '  whoami        - Display user information',
          '  resume        - Show resume summary',
          '  skills        - List technical skills',
          '  experience    - Show work experience',
          '  projects      - List recent projects',
          '  contact       - Show contact information',
          '  clear         - Clear terminal history',
          '  cat resume    - Display detailed resume',
          '  ls            - List available files'
        ];
        break;
      case 'whoami':
        output = [
          'Ahmad Al-Ghawi',
          'Full Stack Developer',
          'Location: Sweden',
          'Current Role: FullStack Developer at Cognes'
        ];
        break;
      case 'resume':
      case 'cat resume':
        output = [
          '=== AHMAD AL-GHAWI - RESUME ===',
          '',
          '📧 Email: ahmadalghawi.86@gmail.com',
          '🌍 Location: Sweden',
          '💼 Current: FullStack Developer at Cognes (Jan 2025 - Present)',
          '',
          '🎯 SUMMARY:',
          'Passionate full-stack developer with 5+ years of experience',
          'Specializing in React, Node.js, React Native, and AI tools',
          'Currently developing web and mobile applications at Cognes',
          '',
          '🚀 KEY SKILLS:',
          '• Frontend: React.js, Next.js, TypeScript, Tailwind CSS',
          '• Backend: Node.js, Express.js, MySQL, MongoDB',
          '• Mobile: React Native, Expo',
          '• Tools: Git, Figma, Jira, AI Tools, Windsurf',
          '',
          '💼 RECENT EXPERIENCE:',
          '• Cognes (Jan 2025 - Present) - FullStack Developer',
          '• Freelancer (May 2024 - Present) - FullStack Developer', 
          '• SKILLUR AB (Aug 2022 - May 2024) - FullStack Developer',
          '',
          'Type "experience" for detailed work history',
          'Type "projects" to see portfolio projects'
        ];
        break;
      case 'skills':
        output = [
          '🛠️  TECHNICAL SKILLS:',
          '',
          'Frontend Development:',
          '  ✓ React.js, Next.js, TypeScript',
          '  ✓ HTML5, CSS3, Tailwind CSS',
          '  ✓ Responsive Design, UI/UX',
          '',
          'Backend Development:',
          '  ✓ Node.js, Express.js',
          '  ✓ MySQL, MongoDB',
          '  ✓ RESTful APIs, JSON',
          '',
          'Mobile Development:',
          '  ✓ React Native, Expo',
          '  ✓ Cross-platform development',
          '',
          'Tools & Technologies:',
          '  ✓ Git, GitHub, Jira',
          '  ✓ Figma, Design Systems',
          '  ✓ AI Tools (Windsurf, ChatGPT)'
        ];
        break;
      case 'experience':
        output = [
          '💼 WORK EXPERIENCE:',
          '',
          '🏢 Cognes (Jan 2025 - Present)',
          '   Role: FullStack Developer',
          '   • Developing web and mobile applications',
          '   • Specializing in React Native with Expo',
          '   • Creating AI tools and dashboards',
          '',
          '💻 Freelancer (May 2024 - Present)',
          '   Role: FullStack Developer',
          '   • Web and mobile app development',
          '   • Leveraging AI tools for innovative solutions',
          '   • Custom solutions for diverse clients',
          '',
          '🌟 SKILLUR AB (Aug 2022 - May 2024)',
          '   Role: FullStack Developer',
          '   • Developed web apps using React.js, Node.js',
          '   • Database design and optimization',
          '   • Cross-functional team collaboration',
          '',
          'Type "cat resume" for complete resume details'
        ];
        break;
      case 'projects':
        output = [
          '🚀 RECENT PROJECTS:',
          '',
          '1. Skillur.com - Full-stack website',
          '   Tech: React, CSS, Node.js, Express, SQL',
          '   🔗 https://www.skillur.com/',
          '',
          '2. Pokemon Explorer - React/TypeScript app',
          '   Tech: React, TypeScript, API integration',
          '   🔗 https://ahmadalghawi.github.io/Pokemon/',
          '',
          '3. Portfolio Website - Modern React portfolio',
          '   Tech: React, Bootstrap, Responsive design',
          '   🔗 https://ahmadalghawi.github.io/myportfolio/',
          '',
          '4. ShawarmaX - ASP.NET Core project',
          '   Tech: ASP.NET Core, C#, CRUD operations',
          '   🔗 https://github.com/ahmadalghawi/ShawarmaX',
          '',
          'Navigate to "projects" tab to see all projects with demos'
        ];
        break;
      case 'contact':
        output = [
          '📧 CONTACT INFORMATION:',
          '',
          '📧 Email: ahmadalghawi.86@gmail.com',
          '🐙 GitHub: https://github.com/ahmadalghawi',
          '💼 LinkedIn: https://www.linkedin.com/in/ahmad-alghawi-310722197/',
          '🌍 Location: Sweden',
          '',
          '📄 Resume: Available for download in contact tab',
          '💬 Open to new opportunities and collaborations!'
        ];
        break;
      case 'ls':
        output = [
          'total 5',
          'drwxr-xr-x  2 ahmad  staff   README.md',
          'drwxr-xr-x  2 ahmad  staff   experience.json',
          'drwxr-xr-x  2 ahmad  staff   skills.js',
          'drwxr-xr-x  2 ahmad  staff   projects.tsx',
          'drwxr-xr-x  2 ahmad  staff   contact.env',
          'drwxr-xr-x  2 ahmad  staff   resume.pdf'
        ];
        break;
      case 'clear':
        setTerminalHistory([]);
        return;
      default:
        if (cmd.startsWith('cat ')) {
          const file = cmd.substring(4);
          output = [`cat: ${file}: No such file or directory`, 'Try "ls" to see available files or "help" for commands'];
        } else if (cmd === '') {
          return;
        } else {
          output = [`Command not found: ${command}`, 'Type "help" to see available commands'];
        }
    }

    setTerminalHistory(prev => [...prev, { command, output }]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      setCommandHistory(prev => [...prev, terminalInput]);
      setHistoryIndex(-1);
      processCommand(terminalInput);
      setTerminalInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalInput('');
        } else {
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Terminal loading animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 font-mono flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <Terminal className="text-green-400 mr-3" size={32} />
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <TypeAnimation
            sequence={[
              'Initializing developer environment...',
              1000,
              'Loading portfolio modules...',
              1000,
              'Compiling creative code...',
              1000,
              'npm start --portfolio',
              1000,
              'Ready! Welcome to Ahmad\'s Developer Playground! 🚀',
              500
            ]}
            wrapper="div"
            className="text-green-400 text-lg"
            cursor={true}
            repeat={0}
          />
        </motion.div>
      </div>
    );
  }

  // File tree structure
  const fileTree = [
    { id: 'about', name: 'README.md', icon: FileCode, type: 'markdown' },
    { id: 'experience', name: 'experience.json', icon: Database, type: 'json' },
    { id: 'skills', name: 'skills.js', icon: Code, type: 'javascript' },
    { id: 'projects', name: 'projects.tsx', icon: Monitor, type: 'react' },
    { id: 'contact', name: 'contact.env', icon: Mail, type: 'env' }
  ];

  const renderAbout = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <FileCode className="text-blue-400" size={24} />
          <span className="text-white text-xl font-bold">README.md</span>
        </div>
        <div className="text-green-400 space-y-4">
          <div>
            <span className="text-gray-500"># </span>
            <span className="text-cyan-400 text-2xl font-bold">Ahmad Al-Ghawi</span>
          </div>
          <div>
            <span className="text-gray-500">## </span>
            <span className="text-yellow-400 text-lg">Full Stack Developer</span>
          </div>
          <div className="text-gray-300 leading-relaxed">
            <span className="text-gray-500">```markdown</span><br/>
            Passionate full-stack developer with expertise in modern web technologies.<br/>
            Currently working at Cognes, developing innovative web and mobile applications<br/>
            using React Native, Expo, and AI-powered tools.<br/>
            <span className="text-gray-500">```</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <div className="text-cyan-400 font-bold mb-2">🚀 Current Role</div>
              <div className="text-white">FullStack Developer at Cognes</div>
              <div className="text-gray-400 text-sm">Jan 2025 - Present</div>
            </div>
            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <div className="text-cyan-400 font-bold mb-2">💼 Experience</div>
              <div className="text-white">5+ Years</div>
              <div className="text-gray-400 text-sm">Web & Mobile Development</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Windows Terminal Box */}
      <div className="bg-black rounded-lg border-2 border-gray-600 shadow-2xl">
        <div className="bg-blue-600 px-4 py-2 rounded-t-lg border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="text-white" size={16} />
              <span className="text-white text-sm font-semibold">Command Prompt - Interactive Resume</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 hover:bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer">
                <span className="text-black text-xs font-bold">−</span>
              </div>
              <div className="w-4 h-4 bg-gray-300 hover:bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer">
                <span className="text-black text-xs font-bold">□</span>
              </div>
              <div className="w-4 h-4 bg-red-500 hover:bg-red-400 rounded-sm flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs font-bold">×</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-black">
          <div className="text-gray-300 font-mono text-sm mb-4">
            <div className="text-white mb-1">Microsoft Windows [Version 10.0.19045.3570]</div>
            <div className="text-white mb-2">(c) Microsoft Corporation. All rights reserved.</div>
            <div className="text-gray-400 mb-2">Welcome to Ahmad's Interactive Resume Terminal!</div>
            <div className="text-gray-400 mb-3">Type "help" to see available commands or "resume" to view resume data.</div>
          </div>
          
          {/* Terminal History */}
          <div className="max-h-64 overflow-y-auto font-mono text-sm">
            {terminalHistory.length === 0 && (
              <div className="text-gray-300">
                <div className="mb-2">
                  <span className="text-white">C:\Users\Ahmad\Portfolio{'>'}</span>
                  <span className="text-gray-400 ml-2">Try typing "help" or "resume"</span>
                </div>
              </div>
            )}
            {terminalHistory.map((entry, index) => (
              <div key={index} className="mb-3">
                <div className="text-white">
                  <span className="text-white">C:\Users\Ahmad\Portfolio{'>'}</span>
                  <span className="text-gray-300 ml-2">{entry.command}</span>
                </div>
                <div className="text-gray-300 mt-1 whitespace-pre-line ml-0">
                  {entry.output.join('\n')}
                </div>
                <div className="mt-2"></div>
              </div>
            ))}
          </div>
          
          {/* Terminal Input */}
          <form onSubmit={handleTerminalSubmit} className="flex items-center font-mono text-sm mt-2">
            <span className="text-white">C:\Users\Ahmad\Portfolio{'>'}</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-gray-300 outline-none ml-2 caret-white"
              placeholder="Type a command..."
              autoComplete="off"
            />
          </form>
          
          <div className="text-gray-500 text-xs mt-4 border-t border-gray-700 pt-3">
            💡 Available commands: <code className="text-blue-400 bg-gray-800 px-1 rounded">help</code>, <code className="text-blue-400 bg-gray-800 px-1 rounded">resume</code>, <code className="text-blue-400 bg-gray-800 px-1 rounded">skills</code>, <code className="text-blue-400 bg-gray-800 px-1 rounded">experience</code>, <code className="text-blue-400 bg-gray-800 px-1 rounded">projects</code>, <code className="text-blue-400 bg-gray-800 px-1 rounded">contact</code>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderExperience = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-green-400" size={24} />
          <span className="text-white text-xl font-bold">experience.json</span>
        </div>
        <div className="text-green-400 font-mono text-sm space-y-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 p-4 rounded border border-gray-600"
            >
              <div className="text-cyan-400 font-bold mb-2">
                "{exp.company}": {'{'}
              </div>
              <div className="ml-4 space-y-1">
                <div><span className="text-yellow-400">"title":</span> <span className="text-white">"{exp.title}"</span>,</div>
                <div><span className="text-yellow-400">"period":</span> <span className="text-white">"{exp.period}"</span>,</div>
                <div><span className="text-yellow-400">"type":</span> <span className="text-white">"{exp.type}"</span>,</div>
                <div><span className="text-yellow-400">"skills":</span> [
                  <div className="ml-4">
                    {exp.skills.map((skill, i) => (
                      <span key={i} className="text-green-300">"{skill}"{i < exp.skills.length - 1 ? ',' : ''} </span>
                    ))}
                  </div>
                  ]
                </div>
              </div>
              <div className="text-cyan-400">{'}'}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSkills = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Code className="text-yellow-400" size={24} />
          <span className="text-white text-xl font-bold">skills.js</span>
        </div>
        <div className="text-green-400 font-mono text-sm">
          <div className="text-purple-400 mb-2">const skills = {'{'}</div>
          <div className="ml-4 space-y-3">
            <div>
              <span className="text-cyan-400">frontend:</span> [
              <div className="ml-4 text-green-300">
                'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'
              </div>
              ],
            </div>
            <div>
              <span className="text-cyan-400">backend:</span> [
              <div className="ml-4 text-green-300">
                'Node.js', 'Express.js', 'MySQL', 'MongoDB'
              </div>
              ],
            </div>
            <div>
              <span className="text-cyan-400">mobile:</span> [
              <div className="ml-4 text-green-300">
                'React Native', 'Expo', 'Mobile Development'
              </div>
              ],
            </div>
            <div>
              <span className="text-cyan-400">tools:</span> [
              <div className="ml-4 text-green-300">
                'Git', 'Figma', 'Jira', 'AI Tools', 'Windsurf'
              </div>
              ]
            </div>
          </div>
          <div className="text-purple-400 mt-2">{'};'}</div>
          <div className="mt-4 text-gray-400">
            <span className="text-green-400">export default</span> skills;
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Filter projects based on selected filter
  const filteredProjects = selectedFilter === 'All' 
    ? projectsData 
    : projectsData.filter(project => project.tag.includes(selectedFilter));

  const renderProjects = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="text-blue-400" size={24} />
          <span className="text-white text-xl font-bold">projects.tsx</span>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Web', 'Mobile'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                selectedFilter === filter
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-700 text-green-400 hover:bg-gray-600'
              }`}
            >
              {filter === 'All' ? 'show_all()' : `filter_${filter.toLowerCase()}()`}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProjects.slice(0, 8).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-600 rounded-lg overflow-hidden hover:border-green-400 transition-colors cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <div className="h-32 bg-gray-800 relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="hidden w-full h-full bg-gray-800 items-center justify-center">
                  <FileCode className="text-green-400" size={32} />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="text-yellow-400" size={16} />
                  <span className="text-cyan-400 font-mono text-sm">{project.title}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tag.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-gray-700 text-green-400 rounded text-xs font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <a
                  href={project.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={14} /> Code
                </a>
                {project.previewUrl && (
                  <a
                    href={project.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} /> Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </motion.div>
  );

  const renderContact = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="text-green-400" size={24} />
          <span className="text-white text-xl font-bold">contact.env</span>
        </div>
        <div className="text-green-400 font-mono space-y-2">
          <div><span className="text-gray-500"># Contact Information</span></div>
          <div><span className="text-cyan-400">EMAIL</span>=ahmadalghawi.86@gmail.com</div>
          <div><span className="text-cyan-400">GITHUB</span>=https://github.com/ahmadalghawi</div>
          <div><span className="text-cyan-400">LINKEDIN</span>=https://www.linkedin.com/in/ahmad-alghawi-310722197/</div>
          <div><span className="text-cyan-400">LOCATION</span>=Sweden</div>
          <div className="mt-6">
            <a
              href="/data/Rsume.pdf"
              download
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              <Download size={16} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'about': return renderAbout();
      case 'experience': return renderExperience();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'contact': return renderContact();
      default: return renderAbout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      <div className="flex">
        {/* VS Code Style Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 min-h-screen">
          {/* Terminal Header */}
          <div className="bg-gray-900 p-4 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-sm ml-2">portfolio.dev</span>
            </div>
            <div className="text-green-400 text-sm">
              <span className="text-cyan-400">$</span> whoami
            </div>
            <div className="text-white text-sm">
              <TypeAnimation
                sequence={['ahmad-alghawi - Full Stack Developer', 1000]}
                wrapper="span"
                cursor={false}
                repeat={0}
              />
            </div>
          </div>

          {/* File Explorer */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 text-gray-300">
              <Folder className="text-blue-400" size={16} />
              <span className="text-xs font-bold tracking-wide">EXPLORER</span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                <GitBranch size={12} className="text-orange-400" />
                <span>portfolio-main/</span>
              </div>
              
              {fileTree.map((file) => {
                const IconComponent = file.icon;
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
                      activeSection === file.id
                        ? 'bg-gray-700 text-cyan-400'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setActiveSection(file.id)}
                  >
                    <IconComponent size={14} />
                    <span>{file.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Terminal Status */}
            <div className="mt-8 bg-gray-900 p-3 rounded border border-gray-700">
              <div className="text-green-400 text-xs mb-2">
                <span className="text-cyan-400">$</span> git status
              </div>
              <div className="text-gray-400 text-xs">
                On branch <span className="text-green-400">main</span><br/>
                Modified: <span className="text-yellow-400">{fileTree.find(f => f.id === activeSection)?.name}</span>
              </div>
            </div>

            {/* Back to Main Site */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <Link
                href="/"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                <Terminal size={14} />
                <span>cd ../main-site</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Monitor className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tag.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-gray-700 text-green-400 rounded text-sm font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={selectedProject.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <Github size={16} />
                  View Code
                </a>
                {selectedProject.previewUrl && selectedProject.previewUrl !== selectedProject.gitUrl && (
                  <a
                    href={selectedProject.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Universal Navigation */}
      <UniversalNavigation currentTheme="Developer Playground" position="top-right" variant="dark" />
      
      {/* Navigation Footer */}
      <ThemeNavigationFooter />
    </div>
  );
};

// Navigation Footer Component
const ThemeNavigationFooter = () => (
  <motion.footer 
    className="border-t border-green-500/30 bg-gray-900/50 backdrop-blur-sm pt-8 mt-16"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 1 }}
  >
    <div className="max-w-6xl mx-auto px-6 text-center">
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <Link 
          href="/"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          ~/home
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/vintage-newspaper"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          vintage-newspaper
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/art-deco"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          art-deco
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/cyberpunk"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          cyberpunk
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/watercolor"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          watercolor
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/glassmorphism"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          glassmorphism
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/nature"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          nature
        </Link>
        <span className="text-gray-600">|</span>
        <Link 
          href="/ai-generator"
          className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono underline hover:no-underline"
        >
          ai-generator
        </Link>
      </div>
      <div className="text-xs text-gray-500 font-mono">
        <p> 2025 Ahmad Alghawi - Full Stack Developer</p>
        <p className="mt-1 text-green-500/70">// Explore different portfolio themes above</p>
      </div>
    </div>
  </motion.footer>
);



export default DeveloperPlaygroundPortfolio;
