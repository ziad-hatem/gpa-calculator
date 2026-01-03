"use client";

import { useState, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  Share2,
  Calculator,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { StyledInput } from "@/components/ui/StyledInput";
import { cn } from "@/utils/cn";

interface Subject {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

interface GradeResult {
  gpa: number;
  totalPoints: number;
  totalCredits: number;
  rank: string;
  rankColor: string;
  gradient: string;
}

const INITIAL_ROW: Subject = { id: "1", name: "", grade: "", credits: "" };

const PREDEFINED_SUBJECTS = [
  { name: "Economics and Management", credits: 3 },
  { name: "Physics", credits: 3 },
  { name: "Math 1", credits: 2 },
  { name: "English", credits: 2 },
  { name: "Human Rights", credits: 1 },
  { name: "Intro to Programming", credits: 4 },
  { name: "Intro to Computer Science", credits: 3 },
];

export default function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([INITIAL_ROW]);
  const [result, setResult] = useState<GradeResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const getAvailableSubjects = (currentId: string) => {
    const selectedNames = subjects
      .filter((s) => s.id !== currentId)
      .map((s) => s.name);
    return PREDEFINED_SUBJECTS.filter((s) => !selectedNames.includes(s.name));
  };

  const addRow = () => {
    if (subjects.length < PREDEFINED_SUBJECTS.length) {
      setSubjects([
        ...subjects,
        { id: crypto.randomUUID(), name: "", grade: "", credits: "" },
      ]);
    }
  };

  const removeRow = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    if (field === "name") {
      const selectedSubject = PREDEFINED_SUBJECTS.find((s) => s.name === value);
      if (selectedSubject) {
        setSubjects(
          subjects.map((s) =>
            s.id === id
              ? {
                  ...s,
                  name: value,
                  credits: selectedSubject.credits.toString(),
                }
              : s
          )
        );
      }
    } else {
      setSubjects(
        subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    }
  };

  const getPoints = (percentage: number) => {
    if (percentage >= 93) return 4.0;
    if (percentage >= 89) return 3.7;
    if (percentage >= 84) return 3.3;
    if (percentage >= 80) return 3.0;
    if (percentage >= 76) return 2.7;
    if (percentage >= 73) return 2.3;
    if (percentage >= 70) return 2.0;
    if (percentage >= 67) return 1.7;
    if (percentage >= 64) return 1.3;
    if (percentage >= 60) return 1.0;
    return 0.0;
  };

  const getLetterGrade = (points: number) => {
    if (points === 4.0) return "A";
    if (points === 3.7) return "A-";
    if (points === 3.3) return "B+";
    if (points === 3.0) return "B";
    if (points === 2.7) return "B-";
    if (points === 2.3) return "C+";
    if (points === 2.0) return "C";
    if (points === 1.7) return "C-";
    if (points === 1.3) return "D+";
    if (points === 1.0) return "D";
    return "F";
  };

  const getRank = (gpa: number) => {
    if (gpa >= 3.5)
      return {
        text: "Excellent",
        rankColor: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
        gradient: "from-emerald-500/20 to-teal-500/20",
      };
    if (gpa >= 3.0)
      return {
        text: "Very Good",
        rankColor: "text-blue-300 border-blue-500/30 bg-blue-500/10",
        gradient: "from-blue-500/20 to-indigo-500/20",
      };
    if (gpa >= 2.5)
      return {
        text: "Good",
        rankColor: "text-teal-300 border-teal-500/30 bg-teal-500/10",
        gradient: "from-teal-500/20 to-cyan-500/20",
      };
    if (gpa >= 2.0)
      return {
        text: "Sufficient",
        rankColor: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10",
        gradient: "from-yellow-500/20 to-amber-500/20",
      };
    if (gpa >= 1.0)
      return {
        text: "Weak",
        rankColor: "text-orange-300 border-orange-500/30 bg-orange-500/10",
        gradient: "from-orange-500/20 to-red-500/20",
      };
    return {
      text: "Very Weak",
      rankColor: "text-red-300 border-red-500/30 bg-red-500/10",
      gradient: "from-red-500/20 to-rose-500/20",
    };
  };

  const calculateGPA = () => {
    let totalQualityPoints = 0;
    let totalCredits = 0;

    subjects.forEach((s) => {
      const grade = parseFloat(s.grade);
      const credits = parseFloat(s.credits);

      if (!isNaN(grade) && !isNaN(credits)) {
        const points = getPoints(grade);
        totalQualityPoints += points * credits;
        totalCredits += credits;
      }
    });

    if (totalCredits === 0) {
      setResult(null); // Or show error?
      return;
    }

    const gpa = totalQualityPoints / totalCredits;
    const rank = getRank(gpa);

    setResult({
      gpa,
      totalPoints: totalQualityPoints,
      totalCredits,
      rank: rank.text,
      rankColor: rank.rankColor,
      gradient: rank.gradient,
    });
  };

  const resetForm = () => {
    setSubjects([INITIAL_ROW]);
    setResult(null);
  };

  const exportAsImage = useCallback(async () => {
    if (resultRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(resultRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = "gpa-report.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  }, [resultRef]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">
      <div className="mb-12 text-center space-y-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Academic GPA Calculator
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Precisely calculate your semester GPA. Add your subjects, enter your
          grades, and get instant results.
        </motion.p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr] items-start">
        {/* Input Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-accent block shadow-sm shadow-accent/50" />
                Subjects
              </h2>
              <span className="text-sm text-muted-foreground font-medium">
                {subjects.length} / {PREDEFINED_SUBJECTS.length} Added
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group flex flex-col sm:flex-row gap-3 items-stretch sm:items-start bg-zinc-900/40 p-3 rounded-2xl hover:bg-zinc-900/60 transition-colors border border-white/5 hover:border-white/10"
                  >
                    <div className="flex-1 min-w-[140px] relative">
                      <select
                        className="w-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 py-3 pl-4 pr-10 appearance-none cursor-pointer outline-none font-medium"
                        value={subject.name}
                        onChange={(e) =>
                          updateSubject(subject.id, "name", e.target.value)
                        }
                      >
                        <option
                          value=""
                          disabled
                          className="bg-zinc-900 text-muted-foreground"
                        >
                          Select Subject
                        </option>
                        {getAvailableSubjects(subject.id).map((s) => (
                          <option
                            key={s.name}
                            value={s.name}
                            className="text-foreground bg-zinc-900"
                          >
                            {s.name}
                          </option>
                        ))}
                        {subject.name &&
                          !getAvailableSubjects(subject.id).some(
                            (s) => s.name === subject.name
                          ) && (
                            <option
                              value={subject.name}
                              className="text-foreground bg-zinc-900"
                            >
                              {subject.name}
                            </option>
                          )}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-accent transition-colors pointer-events-none"
                        size={16}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 sm:w-28 relative">
                        <StyledInput
                          type="number"
                          placeholder="Grade %"
                          className="bg-transparent border-0 text-center font-medium placeholder:text-muted-foreground"
                          value={subject.grade}
                          onChange={(e) =>
                            updateSubject(subject.id, "grade", e.target.value)
                          }
                          min={0}
                          max={100}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none opacity-50">
                          %
                        </span>
                      </div>
                      <div className="flex-1 sm:w-24 relative">
                        <StyledInput
                          type="number"
                          placeholder="Cr"
                          className="bg-zinc-900/20 border-transparent text-muted-foreground text-center cursor-not-allowed"
                          value={subject.credits}
                          readOnly
                          min={0}
                          max={10}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none opacity-30">
                          Hrs
                        </span>
                      </div>
                      {subjects.length > 1 && (
                        <button
                          onClick={() => removeRow(subject.id)}
                          className="p-3 text-muted-foreground/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all sm:mt-0"
                          aria-label="Remove subject"
                          title="Remove Subject"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {subjects.length < PREDEFINED_SUBJECTS.length && (
              <motion.button
                layout
                onClick={addRow}
                className="group mt-4 w-full py-4 flex items-center justify-center gap-2 text-accent-foreground font-medium bg-accent rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/10"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus size={18} className="text-current" />
                Add Another Subject
              </motion.button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetForm}
              className="flex-1 py-4 flex items-center justify-center gap-2 text-muted-foreground bg-white/5 border border-white/5 hover:bg-white/10 hover:text-foreground rounded-2xl font-semibold transition-all active:scale-95"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <button
              onClick={calculateGPA}
              className="flex-[2] py-4 flex items-center justify-center gap-2 text-primary-foreground bg-foreground hover:bg-foreground/90 rounded-2xl font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calculator size={20} /> Calculate GPA
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                className="sticky top-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  ref={resultRef}
                  className="bg-card/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-black/50 border border-white/10 overflow-hidden relative"
                >
                  {/* Background Gradient */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-10 bg-linear-to-br pointer-events-none",
                      result.gradient
                    )}
                  />

                  <div className="relative p-8 text-center border-b border-white/5">
                    <h3 className="text-muted-foreground font-medium mb-2 uppercase tracking-widest text-xs">
                      Semester GPA
                    </h3>
                    <div className="text-7xl font-bold text-foreground tracking-tighter my-4">
                      {result.gpa.toFixed(2)}
                    </div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border backdrop-blur-md shadow-sm",
                        result.rankColor
                      )}
                    >
                      {result.rank}
                    </div>
                  </div>

                  <div className="relative bg-black/20 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Course Breakdown
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {result.totalCredits} Credit Hours
                      </span>
                    </div>

                    <div className="space-y-3">
                      {subjects.map((s, i) => {
                        const grade = parseFloat(s.grade);
                        const credits = parseFloat(s.credits);
                        if (isNaN(grade) || isNaN(credits)) return null;
                        return (
                          <div
                            key={s.id}
                            className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0 group"
                          >
                            <span className="font-medium text-zinc-300 group-hover:text-white transition-colors max-w-[140px]">
                              {s.name || `Subject ${i + 1}`}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground text-xs">
                                {grade}%
                              </span>
                              <span className="w-8 text-center py-0.5 rounded-md bg-white/5 font-mono text-xs font-bold text-foreground">
                                {getLetterGrade(getPoints(grade))}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">
                        Quality Points
                      </span>
                      <span className="font-mono text-lg font-bold text-accent">
                        {result.totalPoints.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Watermark for image export */}
                  <div className="absolute bottom-2 right-4 text-[10px] text-white/10 pointer-events-none opacity-0 group-hover:opacity-100">
                    Calculated via GPA Pro
                  </div>
                </div>

                <motion.button
                  onClick={exportAsImage}
                  className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-accent-foreground bg-accent hover:brightness-110 rounded-2xl font-bold transition-all shadow-lg shadow-accent/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={18} /> Share Results
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="sticky top-8 h-[400px] flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/10 text-muted-foreground p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
                  <Calculator size={32} className="text-white/40" />
                </div>
                <h3 className="text-lg font-semibold text-white/80 mb-2">
                  Ready to Calculate?
                </h3>
                <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground/80">
                  Enter your grades and credit hours on the left to generate
                  your comprehensive GPA report.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
