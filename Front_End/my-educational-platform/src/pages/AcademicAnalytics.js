// AcademicAnalytics.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/AcademicAnalytics.css';
import LineChart from '../components/LineChart';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserData } from '../services/api';

const AcademicAnalytics = () => {
  const { userData, authToken } = useAuth();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentExam, setCurrentExam] = useState('');
  const [currentClass, setCurrentClass] = useState(null);
  const [examPercentages, setExamPercentages] = useState([]);
  const [averageData, setAverageData] = useState({ xAxisData: [], yAxisData: [] });
  const [totalAverage, setTotalAverage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await getUserData(studentId, authToken);
        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [studentId, authToken]);

  useEffect(() => {
    if (studentData && studentData.classes && studentData.classes.length > 0) {
      setClasses(studentData.classes);
      setCurrentClass(studentData.classes[0].classNo);
    } else if (userData && userData.classes && userData.classes.length > 0) {
      setClasses(userData.classes);
      setCurrentClass(userData.classes[0].classNo);
    }
  }, [studentData, userData]);

  useEffect(() => {
    if (classes.length > 0) {
      const selectedClass = classes.find((item) => item.classNo === currentClass) || classes[0];
      setSubjects(selectedClass.subjects || []);
      if (selectedClass.subjects && selectedClass.subjects.length > 0) {
        setCurrentExam(selectedClass.subjects[0].examNameAndMarks[0]?.name || '');
      }
    }
  }, [classes, currentClass]);

  useEffect(() => {
    if (subjects.length > 0) {
      const percentages = subjects.map(subject => {
        return subject.examNameAndMarks.map(exam => ({
          ...exam,
          percentage: ((exam.gainedMarks / exam.totalMarks) * 100).toFixed(2)
        }));
      });
      setExamPercentages(percentages);
    }
  }, [subjects]);

  useEffect(() => {
    const calculateAveragePercentages = () => {
      if (subjects.length === 0) return { xAxisData: [], yAxisData: [] };

      const examNames = [...new Set(subjects.flatMap(subject => subject.examNameAndMarks.map(exam => exam.name)))];

      const averagePercentages = examNames.map(examName => {
        let totalPercentage = 0;
        let count = 0;

        subjects.forEach(subject => {
          const exam = subject.examNameAndMarks.find(exam => exam.name === examName);
          if (exam) {
            totalPercentage += (exam.gainedMarks / exam.totalMarks) * 100;
            count++;
          }
        });

        return count > 0 ? (totalPercentage / count).toFixed(2) : 0;
      });

      return {
        xAxisData: examNames.map(name => name.charAt(0).toUpperCase() + name.slice(1)),
        yAxisData: averagePercentages
      };
    };

    const averageData = calculateAveragePercentages();
    setAverageData(averageData);

    // Calculate total average
    const total = averageData.yAxisData.reduce((acc, curr) => acc + parseFloat(curr), 0);
    const average = averageData.yAxisData.length > 0 ? total / averageData.yAxisData.length : 0;
    setTotalAverage(average);
  }, [subjects]);

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getStatus = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const handleGoBack = () => {
    if (userData.userType === 'student') {
      navigate('/analytics');
    } else {
      navigate(`/counselors-student-dashboard?studentId=${studentId}`);
    }
  };

  return (
    <div className='analytics-container'>
      {loading && (
        <div id="loadingOverlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className='analytics-container-header'>
        <div className="nav flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-2" aria-label="Go back" onClick={handleGoBack}>
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Academic Analysis</h1>
          </div>
        </div>
      </div>

      <div className='container_academic_analysics'>
        <div style={{ textAlign: "center" }}>
          <h1>Academic Records</h1>
          {!studentData ? (<p className="text-muted">View your complete academic history and progress</p>) : (<p className="text-muted">View the academic history and progress of {studentData.name}</p>) }
        </div>

        <div className="flex justify-between items-center mt-4" style={{ alignItems: "center" }} id="select_class_No">
          <select id="Class_No_select" onChange={(e) => setCurrentClass(parseInt(e.target.value))}>
            {classes.map((item) => (
              <option key={item.classNo} value={item.classNo}>Class {item.classNo}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 mt-4">
          <div className="card">
            <div className="text-center">
              <p className="text-muted">Average Percentage</p>
              <p className="text-primary" style={{ fontSize: "2rem", fontWeight: 700 }}>{totalAverage.toFixed(2)}</p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-muted">Class Number</p>
              <p style={{ fontSize: "2rem", fontWeight: 700 }}>{currentClass}</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-muted">Academic Standing</p>
              <p className="text-green" style={{ fontSize: "2rem", fontWeight: 700 }}>{getStatus(totalAverage)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4" id="select_Exams">
          <select id="semesterSelect" onChange={(e) => setCurrentExam(e.target.value)}>
            {subjects.length > 0 && subjects[0].examNameAndMarks.map((exam) => (
              <option key={exam._id} value={exam.name}>
                {exam.name.charAt(0).toUpperCase() + exam.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2>{currentExam.charAt(0).toUpperCase() + currentExam.slice(1)}</h2>
          </div>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Course</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                subject.examNameAndMarks.map((exam, examIndex) => (
                  exam.name === currentExam && (
                    <tr key={exam._id}>
                      <td>{subject.name.charAt(0).toUpperCase() + subject.name.slice(1)}</td>
                      <td>{examPercentages[index] && examPercentages[index][examIndex] ? `${examPercentages[index][examIndex].percentage}%` : 'N/A'}</td>
                      <td>{examPercentages[index] && examPercentages[index][examIndex] ? getGrade(examPercentages[index][examIndex].percentage) : 'N/A'}</td>
                      <td>{examPercentages[index] && examPercentages[index][examIndex] ? getStatus(examPercentages[index][examIndex].percentage) : 'N/A'}</td>
                    </tr>
                  )
                ))
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <h2>Academic Progress Graphs</h2>
          <div className="grid grid-cols-3 mt-4">
            {subjects.map((subject) => {
              const xAxisData = subject.examNameAndMarks.map(exam => exam.name.charAt(0).toUpperCase() + exam.name.slice(1));
              const yAxisData = subject.examNameAndMarks.map(exam => ((exam.gainedMarks / exam.totalMarks) * 100).toFixed(2));
              return (
                <LineChart
                  key={subject._id}
                  title={subject.name.charAt(0).toUpperCase() + subject.name.slice(1)}
                  xAxisData={xAxisData}
                  yAxisData={yAxisData}
                  label={`${subject.name.charAt(0).toUpperCase() + subject.name.slice(1)} Progress (%)`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <LineChart
            title="Total Average"
            xAxisData={averageData.xAxisData}
            yAxisData={averageData.yAxisData}
            xAxisLabel="Exams"
            yAxisLabel="Percentage (%)"
            label="Total Average (%)"
          />
        </div>
      </div>
    </div>
  );
}

export default AcademicAnalytics;