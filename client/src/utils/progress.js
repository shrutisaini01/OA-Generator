const saveAssessmentAttempt = (assessmentId, correctAnswers, totalQuestions) => {
    const previous = JSON.parse(localStorage.getItem("progress")) || [];
  
    const lastAttempt = previous[previous.length - 1] || {};
    const attemptNumber = previous.length > 0
      ? Number(lastAttempt.session?.split(" ")[1]) + 1
      : 1;
  
    const newAttempt = {
      session: `Attempt ${attemptNumber}`,
      [assessmentId]: Math.round((correctAnswers / totalQuestions) * 100),
    };
  
    const updated = [...previous, newAttempt];
    localStorage.setItem("progress", JSON.stringify(updated));
  };

// Get all progress data
const getProgressData = () => {
  return JSON.parse(localStorage.getItem("progress")) || [];
};

// Calculate total score and grade
const calculateScoreAndGrade = (data) => {
  if (!data || data.length === 0) {
    return {
      totalScore: 0,
      maxScore: 0,
      grade: 0,
      totalAttempts: 0,
      averageScore: 0
    };
  }

  const latest = data[data.length - 1];
  const totalAssessments = Object.keys(latest).length - 1; // exclude 'session'
  const totalScore = Object.values(latest).reduce((acc, val) => typeof val === 'number' ? acc + val : acc, 0);
  const maxScore = totalAssessments * 100;
  const grade = Math.round((totalScore / maxScore) * 10);
  
  // Calculate average score across all attempts
  const allScores = data.flatMap(attempt => 
    Object.entries(attempt)
      .filter(([key, value]) => key !== 'session' && typeof value === 'number')
      .map(([key, value]) => value)
  );
  
  const averageScore = allScores.length > 0 
    ? Math.round(allScores.reduce((acc, score) => acc + score, 0) / allScores.length)
    : 0;

  return {
    totalScore,
    maxScore,
    grade,
    totalAttempts: data.length,
    averageScore
  };
};

// Get assessment statistics
const getAssessmentStats = (data) => {
  if (!data || data.length === 0) return {};

  const stats = {};
  const assessmentKeys = Object.keys(data[0]).filter(key => key !== 'session');
  
  assessmentKeys.forEach(assessment => {
    const scores = data
      .map(attempt => attempt[assessment])
      .filter(score => typeof score === 'number');
    
    if (scores.length > 0) {
      const average = Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
      const best = Math.max(...scores);
      const attempts = scores.length;
      
      stats[assessment] = {
        average,
        best,
        attempts,
        latest: scores[scores.length - 1]
      };
    }
  });
  
  return stats;
};

// Clear progress data
const clearProgress = () => {
  localStorage.removeItem("progress");
};

export { 
  saveAssessmentAttempt, 
  getProgressData, 
  calculateScoreAndGrade, 
  getAssessmentStats,
  clearProgress 
};
  