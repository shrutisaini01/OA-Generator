import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  getProgressData,
  calculateScoreAndGrade,
  getAssessmentStats,
  clearProgress,
} from "../utils/progress";
import { populateTestProgressData } from "../utils/testProgressData";
import {
  Trash2,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const staggerContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ThemeSwitcher = ({ theme, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className="p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === "light" ? (
        <Moon size={20} className="text-purple-600" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </motion.button>
  );
};

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    loadProgressData();
    document.documentElement.className = theme;
  }, [theme]);

  const loadProgressData = () => {
    const data = getProgressData();
    setProgressData(data);
    setStats(calculateScoreAndGrade(data));
  };

  const assessmentStats = getAssessmentStats(progressData);

  const handleClearProgress = () => {
    clearProgress();
    loadProgressData();
    setShowClearConfirm(false);
  };

  const handlePopulateTestData = () => {
    populateTestProgressData();
    loadProgressData();
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const getGradeColor = (grade) => {
    if (grade >= 9) return "text-green-500 dark:text-green-400";
    if (grade >= 7) return "text-blue-500 dark:text-blue-400";
    if (grade >= 5) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const getGradeText = (grade) => {
    if (grade >= 9) return "Excellent";
    if (grade >= 7) return "Good";
    if (grade >= 5) return "Average";
    return "Needs Improvement";
  };

  const formatAssessmentName = (name) => {
    const nameMap = {
      dsa: "Data Structures & Algorithms",
      development: "Development",
      machine_learning: "Machine Learning",
      cs: "Computer Science",
      english: "English",
    };
    return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (progressData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <BarChart3 size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Progress Data Available
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Complete some assessments to see your progress here.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Your Progress Dashboard
            </h1>
            <div className="flex gap-2 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePopulateTestData}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Load Test Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Clear Progress
              </motion.button>
              <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
            </div>
          </div>

          {/* Summary Cards */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Score</p>
                  <p className="text-2xl font-bold">
                    {stats.totalScore}/{stats.maxScore}
                  </p>
                </div>
                <Target size={24} />
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Current Grade</p>
                  <p className="text-2xl font-bold">{stats.grade}/10</p>
                </div>
                <Award size={24} />
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Attempts</p>
                  <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                </div>
                <TrendingUp size={24} />
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Average Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
                <BarChart3 size={24} />
              </div>
            </motion.div>
          </motion.div>

          {/* Grade Display */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Performance Rating
            </p>
            <p
              className={`text-3xl font-bold ${getGradeColor(stats.grade)}`}
            >
              {getGradeText(stats.grade)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Grade: {stats.grade}/10
            </p>
          </div>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Progress Over Time
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="session"
                tick={{ fontSize: 12, fill: theme === "dark" ? "#d1d5db" : "#4b5563" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: theme === "dark" ? "#d1d5db" : "#4b5563" }}
                label={{
                  value: "Score (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: theme === "dark" ? "#d1d5db" : "#4b5563",
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value}%`,
                  formatAssessmentName(name),
                ]}
                labelFormatter={(label) => `Session: ${label}`}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                  borderColor: theme === "dark" ? "#4b5563" : "#e5e7eb",
                }}
              />
              <Legend />
              {Object.keys(progressData[0] || {})
                .filter((key) => key !== "session")
                .map((assessment, i) => (
                  <Line
                    key={assessment}
                    type="monotone"
                    dataKey={assessment}
                    strokeWidth={3}
                    stroke={`hsl(${i * 60}, 70%, 50%)`}
                    name={formatAssessmentName(assessment)}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Assessment Statistics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Assessment Statistics
          </h2>
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Object.entries(assessmentStats).map(([assessment, stat]) => (
              <motion.div
                variants={cardVariants}
                key={assessment}
                className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
                  {formatAssessmentName(assessment)}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Latest Score:
                    </span>
                    <span className="font-semibold">{stat.latest}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Best Score:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {stat.best}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Average:
                    </span>
                    <span className="font-semibold">{stat.average}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Attempts:
                    </span>
                    <span className="font-semibold">{stat.attempts}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Performance Bar Chart */}
        {Object.keys(assessmentStats).length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Performance Comparison
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(assessmentStats).map(
                  ([name, stat]) => ({
                    name: formatAssessmentName(name),
                    latest: stat.latest,
                    best: stat.best,
                    average: stat.average,
                  })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: theme === "dark" ? "#d1d5db" : "#4b5563" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: theme === "dark" ? "#d1d5db" : "#4b5563" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    borderColor: theme === "dark" ? "#4b5563" : "#e5e7eb",
                  }}
                />
                <Legend />
                <Bar dataKey="latest" fill="#3B82F6" name="Latest Score" />
                <Bar dataKey="best" fill="#10B981" name="Best Score" />
                <Bar dataKey="average" fill="#F59E0B" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Clear Progress Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Clear Progress Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to clear all your progress data? This
                action cannot be undone.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearProgress}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Data
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Progress;