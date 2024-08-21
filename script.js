const gradeToPoint = {
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "U": 0 // U indicates fail, should not contribute to CGPA
};

let data = null;
let semesterGrades = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch('/curriculam.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            renderTable();
        })
        .catch(error => console.error('Fetching data failed:', error));
});

function renderTable() {
    const semester = document.getElementById('semester').value;
    const semesterData = data ? data[semester] : [];
    const tableDiv = document.getElementById('course-table');
    
    if (semesterData && semesterData.length > 0) {
        let tableHtml = '<table><thead><tr><th>Course Title</th><th>Grade</th><th>Credits</th></tr></thead><tbody>';
        
        semesterData.forEach(course => {
            tableHtml += `<tr>
                <td>${course["Course Title"]}</td>
                <td>
                    <select onchange="updateGrade('${course["Course Title"]}', this.value)">
                        <option value="">Select Grade</option>
                        <option value="10">O</option>
                        <option value="9">A+</option>
                        <option value="8">A</option>
                        <option value="7">B+</option>
                        <option value="6">B</option>
                        <option value="5">C</option>
                        <option value="4">D</option>
                        <option value="U">U</option>
                    </select>
                </td>
                <td>${course["Credits"]}</td>
            </tr>`;
        });

        tableHtml += '</tbody></table>';
        tableDiv.innerHTML = tableHtml;
    } else {
        tableDiv.innerHTML = '<p>No data available for the selected semester.</p>';
    }
}

function updateGrade(courseTitle, grade) {
    const semester = document.getElementById('semester').value;
    if (!semesterGrades[semester]) {
        semesterGrades[semester] = {};
    }
    semesterGrades[semester][courseTitle] = grade;
}

function submitSemester() {
    // Save grades for the current semester (Handled in updateGrade)
}

function showSemesterCGPA() {
    const semester = document.getElementById('semester').value;
    alert(`Your CGPA for this semester is: ${calculateSemesterCGPA(semester)}`);
}

function showGrandCGPA() {
    alert(`Your Grand CGPA is: ${calculateGrandCGPA()}`);
}

function calculateSemesterCGPA(semester) {
    let totalPoints = 0;
    let totalCredits = 0;
    let hasFailingGrade = false;
    const semesterData = data ? data[semester] : [];
    const semesterGradesData = semesterGrades[semester] || {};

    semesterData.forEach(course => {
        const courseTitle = course["Course Title"];
        const credits = course["Credits"];
        const grade = semesterGradesData[courseTitle];
        if (grade === 'U') {
            hasFailingGrade = true;
        } else if (grade) {
            totalPoints += gradeToPoint[grade] * credits;
            totalCredits += credits;
        }
    });

    return hasFailingGrade ? "N/A" : (totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A");
}

function calculateGrandCGPA() {
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

    return hasFailingGrade ? "N/A" : (grandTotalCredits > 0 ? (grandTotalPoints / grandTotalCredits).toFixed(2) : "N/A");
}
