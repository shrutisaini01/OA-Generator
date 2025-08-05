// Utility to populate test progress data for demonstration
export const populateTestProgressData = () => {
  const testData = [
    {
      session: "Attempt 1",
      dsa: 75,
      development: 60,
      machine_learning: 80
    },
    {
      session: "Attempt 2", 
      dsa: 85,
      development: 70,
      machine_learning: 90
    },
    {
      session: "Attempt 3",
      dsa: 90,
      development: 85,
      machine_learning: 95
    },
    {
      session: "Attempt 4",
      dsa: 95,
      development: 90,
      machine_learning: 100
    }
  ];
  
  localStorage.setItem("progress", JSON.stringify(testData));
  return testData;
};

// Clear test data
export const clearTestProgressData = () => {
  localStorage.removeItem("progress");
};

// Get current progress data
export const getCurrentProgressData = () => {
  return JSON.parse(localStorage.getItem("progress")) || [];
}; 