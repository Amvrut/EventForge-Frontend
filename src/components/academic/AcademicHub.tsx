import React, { useState } from 'react';
import {
  FileText,
  LayoutGrid,
  Cpu,
  GitFork,
  Database,
  Code,
  Globe,
  CodeXml,
  Server,
  Layers,
  ShieldCheck,
  BarChart3,
  Edit3,
  Ticket,
  CheckCircle2,
  GraduationCap,
  Copy,
  Check,
  Search,
  Presentation,
  HelpCircle,
  FileDown,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { ACADEMIC_STEPS } from '../../data/academicSteps';
import { PPT_SLIDES, VIVA_QUESTIONS, PROJECT_REPORT_MARKDOWN } from '../../data/vivaAndReport';
import { PPTSlide, VivaQuestion } from '../../types';

export const AcademicHub: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [stepSearch, setStepSearch] = useState<string>('');
  const [copiedSectionIndex, setCopiedSectionIndex] = useState<number | null>(null);

  // Step 16 sub-tabs: 'report' | 'ppt' | 'viva'
  const [step16Tab, setStep16Tab] = useState<'report' | 'ppt' | 'viva'>('ppt');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);

  // Viva Voce state
  const [vivaSearch, setVivaSearch] = useState<string>('');
  const [vivaCategory, setVivaCategory] = useState<string>('All');
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // Icon mapping
  const iconMap: Record<string, any> = {
    FileText,
    LayoutGrid,
    Cpu,
    GitFork,
    Database,
    Code,
    Globe,
    CodeXml,
    Server,
    Layers,
    ShieldCheck,
    BarChart3,
    Edit3,
    Ticket,
    CheckCircle2,
    GraduationCap,
  };

  const currentStep = ACADEMIC_STEPS[activeStepIndex];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSectionIndex(idx);
    setTimeout(() => setCopiedSectionIndex(null), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([PROJECT_REPORT_MARKDOWN], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EventForge-Academic-Project-Report.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Filter steps by search
  const filteredSteps = ACADEMIC_STEPS.filter(
    (s) =>
      s.title.toLowerCase().includes(stepSearch.toLowerCase()) ||
      s.summary.toLowerCase().includes(stepSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(stepSearch.toLowerCase())
  );

  // Filter viva questions
  const filteredViva = VIVA_QUESTIONS.filter((vq) => {
    const matchesSearch =
      vq.question.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      vq.answer.toLowerCase().includes(vivaSearch.toLowerCase());
    const matchesCategory =
      vivaCategory === 'All' || vq.category === vivaCategory;
    return matchesSearch && matchesCategory;
  });

  const isStep16 = activeStepIndex === 15; // 0-indexed for 16th step

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Academic Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Comprehensive 16-Step Capstone Project Dossier</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              EventForge: Complete Java & MySQL Academic Blueprint
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Every stage from Project Abstract to 3-Tier MVC Architecture, Flowcharts, 3NF ER Schema, MySQL DDL/DML, JSP/Servlets, Concurrency Locks, Formal Testing Suite, Presentation PPT, and Viva Voce preparation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveStepIndex(15);
                setStep16Tab('ppt');
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Launch 15-Slide PPT</span>
            </button>
            <button
              onClick={() => {
                setActiveStepIndex(15);
                setStep16Tab('viva');
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Viva Voce Prep (40 Q&A)</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Report (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Navigation & Right Step Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Steps 1 to 16 Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Project Step Navigator
              </span>
              <span className="text-[11px] font-mono text-indigo-400">
                16 Total Modules
              </span>
            </div>

            {/* Search Steps */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={stepSearch}
                onChange={(e) => setStepSearch(e.target.value)}
                placeholder="Filter steps by name or topic..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* List of Steps */}
            <div className="space-y-1 max-h-[650px] overflow-y-auto pr-1">
              {filteredSteps.map((step) => {
                const isSelected = activeStepIndex === step.stepNumber - 1;
                const IconComponent = iconMap[step.iconName] || FileText;

                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepIndex(step.stepNumber - 1)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center space-x-3 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-indigo-400'
                      }`}
                    >
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {step.shortTitle}
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500'
                        }`}
                      >
                        {step.category}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-white' : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}

              {/* Step 16 Entry */}
              <button
                onClick={() => setActiveStepIndex(15)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center space-x-3 transition-all ${
                  activeStepIndex === 15
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-300 hover:bg-amber-950/30'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                    activeStepIndex === 15
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-950/60 text-amber-400'
                  }`}
                >
                  16
                </div>
                <div className="flex-1 truncate">
                  <div className="text-xs font-semibold truncate leading-tight">
                    Report + PPT + Viva Q&A
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      activeStepIndex === 15 ? 'text-amber-100' : 'text-amber-400/70'
                    }`}
                  >
                    Evaluation Defense Suite
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area: Detailed Step Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {/* If Step 16 is selected, render the defense suite */}
          {isStep16 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider block">
                    STEP 16 : FINAL EVALUATION DEFENSE
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    Project Report, 15-Slide PPT & Viva Voce Bank
                  </h2>
                </div>

                {/* Sub-tabs for Step 16 */}
                <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-lg">
                  <button
                    onClick={() => setStep16Tab('ppt')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      step16Tab === 'ppt'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    15-Slide Presentation (PPT)
                  </button>
                  <button
                    onClick={() => setStep16Tab('viva')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      step16Tab === 'viva'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Viva Voce Q&A (40)
                  </button>
                  <button
                    onClick={() => setStep16Tab('report')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      step16Tab === 'report'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Report Dossier
                  </button>
                </div>
              </div>

              {/* Step 16 Tab 1: Interactive 15-Slide Presentation Deck */}
              {step16Tab === 'ppt' && (
                <div>
                  {/* Slide Carousel Navigator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-400 font-mono">
                      Slide {currentSlideIndex + 1} of {PPT_SLIDES.length}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentSlideIndex === 0}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded text-xs flex items-center space-x-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>
                      <button
                        onClick={() =>
                          setCurrentSlideIndex((prev) =>
                            Math.min(PPT_SLIDES.length - 1, prev + 1)
                          )
                        }
                        disabled={currentSlideIndex === PPT_SLIDES.length - 1}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded text-xs flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                        className={`px-2.5 py-1 text-xs rounded transition-colors ${
                          showSpeakerNotes
                            ? 'bg-amber-600/30 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Speaker Notes {showSpeakerNotes ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {/* Active Slide Screen Layout */}
                  {(() => {
                    const slide = PPT_SLIDES[currentSlideIndex];
                    return (
                      <div className="space-y-4">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 aspect-video flex flex-col justify-between shadow-2xl relative overflow-hidden">
                          {/* Slide Background Subtle Accent */}
                          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                          {/* Slide Header */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                                EVENTFORGE SYSTEM EVALUATION
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                SLIDE #{slide.slideNumber}
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                              {slide.title}
                            </h3>
                            {slide.subtitle && (
                              <p className="text-xs sm:text-sm text-indigo-400 font-medium mt-1">
                                {slide.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Slide Bullets */}
                          <div className="my-4 space-y-2.5">
                            {slide.bullets.map((bullet, bIdx) => (
                              <div
                                key={bIdx}
                                className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                                <span className="leading-relaxed">{bullet}</span>
                              </div>
                            ))}
                          </div>

                          {/* Slide Bottom Key Takeaway Callout */}
                          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs flex items-center justify-between">
                            <span className="text-slate-400">
                              <strong className="text-white">Core Highlight:</strong>{' '}
                              {slide.keyHighlight}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                              Jakarta EE · MySQL
                            </span>
                          </div>
                        </div>

                        {/* Speaker Notes Drawer */}
                        {showSpeakerNotes && (
                          <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs space-y-1">
                            <div className="font-bold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Recommended Script & Speaker Notes for Evaluation</span>
                            </div>
                            <p className="text-slate-300 italic leading-relaxed">
                              "{slide.speakerNotes}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Step 16 Tab 2: Viva Voce Q&A Bank */}
              {step16Tab === 'viva' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        value={vivaSearch}
                        onChange={(e) => setVivaSearch(e.target.value)}
                        placeholder="Search viva questions (e.g. concurrency, filter, JDBC, ACID)..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={vivaCategory}
                        onChange={(e) => setVivaCategory(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">All Categories</option>
                        <option value="Servlets & JSP">Servlets & JSP</option>
                        <option value="JDBC & Database">JDBC & Database</option>
                        <option value="System Design & Concurrency">Concurrency & Design</option>
                        <option value="Web Security">Web Security</option>
                        <option value="Core Java">Core Java</option>
                      </select>

                      <button
                        onClick={() => setFlashcardMode(!flashcardMode)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                          flashcardMode
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {flashcardMode ? 'Flashcard Mode: ON' : 'Practice Flashcards'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredViva.map((q) => {
                      const isRevealed = !flashcardMode || revealedAnswers[q.id];
                      return (
                        <div
                          key={q.id}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                {q.id}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                {q.category}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                  q.difficulty === 'Easy'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : q.difficulty === 'Medium'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-white leading-snug">
                            {q.question}
                          </h4>

                          {isRevealed ? (
                            <div className="pt-2 border-t border-slate-800/80 space-y-2">
                              <p className="text-xs text-slate-300 leading-relaxed">
                                <strong className="text-indigo-400">Model Answer: </strong>
                                {q.answer}
                              </p>
                              {q.commonFollowUp && (
                                <p className="text-[11px] text-amber-300/90 italic bg-amber-950/20 p-2 rounded border border-amber-900/30">
                                  <strong>Examiner Follow-up: </strong> {q.commonFollowUp}
                                </p>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setRevealedAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: true,
                                }))
                              }
                              className="text-xs text-indigo-400 hover:text-indigo-300 pt-1 flex items-center gap-1 font-semibold"
                            >
                              <span>Click to reveal answer</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 16 Tab 3: Full Project Report Dossier */}
              {step16Tab === 'report' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-mono">
                      Full Academic Document Format (IEEE / University Standard)
                    </span>
                    <button
                      onClick={handleDownloadReport}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download .md</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px]">
                    {PROJECT_REPORT_MARKDOWN}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* Steps 1 to 15 standard detailed display */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono font-semibold text-indigo-400 uppercase tracking-wider block">
                    STEP {currentStep.stepNumber} OF 16 · {currentStep.category}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    {currentStep.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentStep.summary}
                  </p>
                </div>
              </div>

              {/* Sections in this step */}
              <div className="space-y-6">
                {currentStep.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>{section.heading}</span>
                    </h3>

                    {section.content && (
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-mono">
                        {section.content}
                      </div>
                    )}

                    {/* Table View if present */}
                    {section.tableData && (
                      <div className="border border-slate-800 rounded-xl overflow-hidden shadow">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                            <tr>
                              {section.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="py-2.5 px-3.5">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                            {section.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-800/40">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="py-2.5 px-3.5 whitespace-pre-line leading-relaxed align-top"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Code Snippet with 1-click Copy if present */}
                    {section.codeSnippet && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                          <span>{section.codeLanguage?.toUpperCase() || 'CODE'} SOURCE</span>
                          <button
                            onClick={() => handleCopyCode(section.codeSnippet!, sIdx)}
                            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-white transition-colors"
                          >
                            {copiedSectionIndex === sIdx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[450px]">
                          <code>{section.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Footer for Next / Prev Step */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeStepIndex === 0}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center space-x-1.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>

                <span className="text-xs text-slate-500 font-mono">
                  Step {activeStepIndex + 1} of 16
                </span>

                <button
                  onClick={() =>
                    setActiveStepIndex((prev) => Math.min(15, prev + 1))
                  }
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow"
                >
                  <span>
                    {activeStepIndex === 14
                      ? 'Proceed to Defense Suite (Step 16)'
                      : 'Next Step'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
