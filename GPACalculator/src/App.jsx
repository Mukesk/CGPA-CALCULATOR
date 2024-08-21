import React, { useState, useEffect } from 'react';
import "./App.css";

const gradeToPoint = {
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "U": 0, // U indicates fail, should not contribute to CGPA
};

const App = () => {
  const [data, setData] = useState(null); // State to hold the fetched data
  const [selectedSemester, setSelectedSemester] = useState("Semester I"); // State to hold the selected semester
  const [grades, setGrades] = useState({}); // State to hold grades for each course
  const [semesterGrades, setSemesterGrades] = useState({}); // State to hold grades for all semesters

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/curriculam.json"); // Fetch JSON file
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData); // Set the fetched data
      } catch (error) {
        console.error('Fetching data failed:', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    // Reset grades when the selected semester changes
    setGrades({});
  }, [selectedSemester]);

  // Handle change in semester selection
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  // Handle change in grade selection
  const handleGradeChange = (courseTitle, grade) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [courseTitle]: grade
    }));
  };

  // Store grades for the selected semester
  const handleSubmitSemester = () => {
    setSemesterGrades(prevGrades => ({
      ...prevGrades,
      [selectedSemester]: grades
    }));
  };

  // Check if data exists and selected semester is valid
  const semesterData = data ? data[selectedSemester] : [];

  // Calculate CGPA for the current semester
  const calculateSemesterCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    let hasFailingGrade = false;

    semesterData.forEach(course => {
      const courseTitle = course["Course Title"];
      const credits = course["Credits"];
      const grade = grades[courseTitle];
      if (grade === 'U') {
        hasFailingGrade = true;
      } else if (grade) {
        totalPoints += gradeToPoint[grade] * credits;
        totalCredits += credits;
      }
    });

    if (hasFailingGrade) {
      return "N/A"; // Fail in any course means no valid CGPA
    }

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
  };

  // Calculate Grand CGPA across all semesters
  const calculateGrandCGPA = () => {
    let grandTotalPoints = 0;
    let grandTotalCredits = 0;
    let hasFailingGrade = false;

    for (const semester in semesterGrades) {
      const semesterData = data ? data[semester] : [];
      const semesterGradesData = semesterGrades[semester] || {};
      
      semesterData.forEach(course => {
        const courseTitle = course["Course Title"];
        const credits = course["Credits"];
        const grade = semesterGradesData[courseTitle];
        if (grade === 'U') {
          hasFailingGrade = true;
        } else if (grade) {
          grandTotalPoints += gradeToPoint[grade] * credits;
          grandTotalCredits += credits;
        }
      });
    }

    if (hasFailingGrade) {
      return "N/A"; // Fail in any semester means no valid Grand CGPA
    }

    return grandTotalCredits > 0 ? (grandTotalPoints / grandTotalCredits).toFixed(2) : "N/A";
  };

  return (
    <>
      <select value={selectedSemester} onChange={handleSemesterChange}>
        <option value="Semester I">Semester I</option>
        <option value="Semester II">Semester II</option>
        <option value="Semester III">Semester III</option>
        <option value="Semester IV">Semester IV</option>
        <option value="Semester V">Semester V</option>
        <option value="Semester VI">Semester VI</option>
        <option value="Semester VII">Semester VII</option>
        <option value="Semester VIII">Semester VIII</option>
      </select>

      <div>
        {semesterData && semesterData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Grade</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {semesterData.map((course, index) => (
                <tr key={index}>
                  <td>{course["Course Title"]}</td>
                  <td>
                    <select 
                      value={grades[course["Course Title"]] || ""} 
                      onChange={(e) => handleGradeChange(course["Course Title"], e.target.value)}
                    >
                      <option value="">Select Grade</option>
                      <option value="10">O</option>
                      <option value="9">A+</option>
                      <option value="8">A</option>
                      <option value="7">B+</option>
                      <option value="6">B</option>
                      <option value="5">C</option>
                      <option value="U">U</option>
                    </select>
                  </td>
                  <td>{course["Credits"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available for the selected semester.</p>
        )}
        <button onClick={handleSubmitSemester}>Submit Semester</button>
        <button onClick={() => alert(`Your CGPA for this semester is: ${calculateSemesterCGPA()}`)}>Submit This Semester CGPA</button>
        <button onClick={() => alert(`Your Grand CGPA is: ${calculateGrandCGPA()}`)}>Submit Grand CGPA</button>
      </div>
    </>
  );
};

export default App;
