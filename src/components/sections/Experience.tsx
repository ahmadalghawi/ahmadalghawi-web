import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { experiences as staticExperiences } from '../../data/experienceData';
import { useExperience } from '../../hooks/useExperience';
import type { Experience as ExperienceType } from '../../lib/types';

const fallback: ExperienceType[] = staticExperiences.map((e, idx) => ({ ...e, order: idx }));

export default function Experience() {
  const { data } = useExperience();
  const experiences = data && data.length > 0 ? data : fallback;

  return (
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
                <div>
                  <span className="text-yellow-400">"title":</span>{' '}
                  <span className="text-white">"{exp.title}"</span>,
                </div>
                <div>
                  <span className="text-yellow-400">"period":</span>{' '}
                  <span className="text-white">"{exp.period}"</span>,
                </div>
                <div>
                  <span className="text-yellow-400">"location":</span>{' '}
                  <span className="text-white">"{exp.location}"</span>,
                </div>
                <div>
                  <span className="text-yellow-400">"type":</span>{' '}
                  <span className="text-white">"{exp.type}"</span>,
                </div>
                <div>
                  <span className="text-yellow-400">"skills":</span> [
                  <div className="ml-4 flex flex-wrap gap-1 my-1">
                    {exp.skills.map((skill, i) => (
                      <span key={skill} className="text-green-300">
                        "{skill}"{i < exp.skills.length - 1 ? ',' : ''}
                      </span>
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

      {/* Education */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-500 font-mono text-sm mb-4">// Education</div>
        <div className="space-y-4 font-mono text-sm">
          {[
            { degree: 'Diploma, .NET Full Stack', school: 'Lexicon', period: 'Dec 2020 – May 2021' },
            { degree: "Bachelor's in Computer Information Systems", school: "Al-Balqa' Applied University", period: 'Sep 2006 – Aug 2009' },
            { degree: 'Tawjehe IT', school: 'Al-Shareef Hussein Ben Naser Augusti', period: 'Feb 2002 – Jul 2004' },
          ].map((edu) => (
            <div key={edu.degree} className="flex items-start justify-between gap-4 bg-gray-900 p-3 rounded border border-gray-600">
              <div>
                <span className="text-cyan-400">{edu.degree}</span>
                <span className="text-gray-500"> · </span>
                <span className="text-white">{edu.school}</span>
              </div>
              <span className="text-green-300 whitespace-nowrap text-xs">{edu.period}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
