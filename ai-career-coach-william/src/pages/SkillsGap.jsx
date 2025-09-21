import React, { useState } from 'react';
import { FaChartLine, FaBookOpen, FaLightbulb, FaClock } from 'react-icons/fa';
import { MdTrendingUp, MdAssessment } from 'react-icons/md';
import { ai } from '../lib/api';

const SkillsGap = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [currentSkills, setCurrentSkills] = useState('Python, SQL, React');
  const [result, setResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onAnalyze() {
    try {
      setLoading(true);
      setError('');
      const res = await ai.skillGapRoadmap({ targetRole, currentSkills: currentSkills.split(',').map(s => s.trim()).filter(Boolean), currentLevel: 'beginner' });
      setResult(res.data.skillGap || res.data?.skillgap || res.data?.gap || null);
      setRoadmap(res.data.roadmap || null);
    } catch (err) {
      setError(err.message || 'Failed to analyze');
      setResult(null); // Clear any previous results
      setRoadmap(null); // Clear any previous roadmap
    } finally {
      setLoading(false);
    }
  }

  // Only process data if there's no error and we have valid results
  const have = (!error && result && Array.isArray(result.have)) ? result.have : [];
  const need = (!error && result && Array.isArray(result.need)) ? result.need : [];

  const computedFromResult = have.length > 0 || need.length > 0;

  // Only show skills data if we have real results and no error
  const skillsData = (computedFromResult && !error) ? (
    [
      ...have.map((s, i) => ({ id: i + 1, name: s, currentLevel: 70, requiredLevel: 85, priority: 'Medium', category: 'Technical', timeToComplete: '1-2 months', recommendations: [] })),
      ...need.map((s, i) => ({ id: 100 + i + 1, name: s, currentLevel: 30, requiredLevel: 80, priority: 'High', category: 'Technical', timeToComplete: '2-3 months', recommendations: [] })),
    ]
  ) : [];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGapPercentage = (current, required) => {
    return Math.max(0, required - current);
  };

  const filteredSkills = error ? [] : (selectedLevel === 'all'
    ? skillsData
    : skillsData.filter(skill => skill.priority.toLowerCase() === selectedLevel));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-4 md:p-8">
        <div className="mb-6 bg-white rounded-xl p-4 border">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Role</label>
              <input className="border rounded p-2 w-full" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Data Analyst, Software Engineer" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Skills</label>
              <input className="border rounded p-2 w-full" value={currentSkills} onChange={e => setCurrentSkills(e.target.value)} placeholder="e.g. Python, SQL, React" />
            </div>
            <div className="flex items-end">
              <button onClick={onAnalyze} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">{loading ? 'Analyzing...' : 'Analyze'}</button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 transition-colors duration-300 hover:text-indigo-600">Skills Gap Analysis</h1>
          <p className="text-gray-600 transition-colors duration-200 hover:text-gray-700">Identify and bridge the gaps between your current skills and career requirements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <FaChartLine className="text-blue-400 transition-all duration-200 transform group-hover:scale-110 group-hover:rotate-12" size={24} />
              <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-blue-600">{error ? 0 : filteredSkills.length}</span>
            </div>
            <p className="text-gray-600 transition-colors duration-200 group-hover:text-gray-700">Skills to Improve</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <MdTrendingUp className="text-red-400 transition-all duration-200 transform group-hover:scale-110 group-hover:rotate-12" size={24} />
              <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-red-600">{error ? 0 : filteredSkills.filter(s => s.priority.toLowerCase()==='high').length}</span>
            </div>
            <p className="text-gray-600 transition-colors duration-200 group-hover:text-gray-700">High Priority</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <FaClock className="text-yellow-400 transition-all duration-200 transform group-hover:scale-110 group-hover:rotate-12" size={24} />
              <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-yellow-600">{error ? 0 : Math.max(1, Math.ceil(filteredSkills.length * 2))}</span>
            </div>
            <p className="text-gray-600 transition-colors duration-200 group-hover:text-gray-700">Months to Complete</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <MdAssessment className="text-green-400 transition-all duration-200 transform group-hover:scale-110 group-hover:rotate-12" size={24} />
              <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-green-600">{error ? '0%' : '72%'}</span>
            </div>
            <p className="text-gray-600 transition-colors duration-200 group-hover:text-gray-700">Overall Progress</p>
          </div>
        </div>

        <div className="space-y-6">
          {!error && filteredSkills.map((skill) => (
            <div key={skill.id} className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600">{skill.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 transform group-hover:scale-105 ${getPriorityColor(skill.priority)}`}>{skill.priority} Priority</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 transition-all duration-200 transform group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-indigo-700">{skill.category}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                    <span className="flex items-center gap-1"><FaClock size={12} className="transition-transform duration-200 group-hover:rotate-12" />{skill.timeToComplete}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!error && roadmap && Array.isArray(roadmap.milestones) && roadmap.milestones.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-700">Key Ingredients For</h2>
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">LEARNING ROADMAP</h2>
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 overflow-visible">
              {/* Steps Container */}
              <div className="flex justify-center items-start space-x-8 pb-32">
                {roadmap.milestones.map((m, idx) => {
                  // Define gradient colors for circles and boxes
                  const gradients = [
                    { circle: 'from-blue-400 to-purple-500', box: 'from-blue-600 to-purple-700' },
                    { circle: 'from-pink-400 to-red-500', box: 'from-pink-600 to-red-700' },
                    { circle: 'from-orange-400 to-yellow-500', box: 'from-orange-600 to-yellow-700' },
                    { circle: 'from-pink-400 to-red-500', box: 'from-pink-600 to-red-700' },
                    { circle: 'from-blue-400 to-purple-500', box: 'from-blue-600 to-purple-700' }
                  ];
                  
                  const gradient = gradients[idx % gradients.length];
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Gradient Circle */}
                      <div className={`w-20 h-20 bg-gradient-to-br ${gradient.circle} rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer mb-4`}>
                        <span className="text-white font-bold text-2xl">{idx + 1}</span>
                      </div>
                      
                      {/* Colored Box */}
                      <div className={`relative bg-gradient-to-br ${gradient.box} rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer min-w-48 max-w-56 group`}>
                        <div className="text-white font-semibold text-sm leading-tight text-center">
                          {m.title}
                        </div>
                        
                        {/* Detailed Card (appears on hover) */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 w-80 bg-white rounded-lg p-6 shadow-2xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{m.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{m.description}</p>
                          
                          {/* Resources */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Study Resources:</h4>
                            {(m.resources || []).slice(0, 3).map((r, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <div className={`w-2 h-2 bg-gradient-to-r ${gradient.circle} rounded-full flex-shrink-0`}></div>
                                <a href={r.url} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors hover:underline" target="_blank" rel="noreferrer">
                                  {r.title}
                                </a>
                              </div>
                            ))}
                            {(m.resources || []).length > 3 && (
                              <div className="text-sm text-gray-500 mt-2">+{(m.resources || []).length - 3} more resources available</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SkillsGap;