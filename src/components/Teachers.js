import React, { useState, useEffect } from 'react';
import { createTeacher, deleteTeacher, fetchTeachers, updateTeacher } from '../api/teachers';
import { MemberLanguage, MemberRating, MemberStatus } from '../constants/member';
import { fetchCalculations } from '../api/calculations';
import LoaderComponent from './LoaderComponent';
import './styles/Teachers.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: '', rating: MemberRating.Good, status: MemberStatus.Working, language: MemberLanguage.German, comments: '' });
  const addButtonDisabled = Object.values(newTeacher).some(value => value === '');
  const [teacherStatsLastMonth, setTeacherStatsLastMonth] = useState({});
  const [teacherStatsAllTime, setTeacherStatsAllTime] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeachersFunctions = async () => {
      setIsLoading(true);

      const response = await fetchTeachers();
      response?.data && setTeachers(response?.data.teachers);

      setIsLoading(false);

      const calculationsResponse = await fetchCalculations();
      if (calculationsResponse.data) {
        const calculations = calculationsResponse.data.calculations;
        calculateTeacherStats(calculations);
      }
    };

    fetchTeachersFunctions();
  }, []);

  const calculateTeacherStats = (calculations) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthStats = {};
    const allTimeStats = {};

    calculations.forEach(calculation => {
      const { teacherName, studentName, lessonCost, lessons, createdAt } = calculation;
      const money = lessonCost * lessons;

      if (!allTimeStats[teacherName]) allTimeStats[teacherName] = { students: new Set(), salary: 0 };
      allTimeStats[teacherName].students.add(studentName);
      allTimeStats[teacherName].salary += money;

      const createdAtDate = new Date(createdAt);
      if (createdAtDate >= lastMonth) {
        if (!lastMonthStats[teacherName]) lastMonthStats[teacherName] = { students: new Set(), salary: 0 };
        lastMonthStats[teacherName].students.add(studentName);
        lastMonthStats[teacherName].salary += money;
      }
    });

    const formatStats = (stats) => {
      const formatted = {};
      for (const [teacherName, { students, salary }] of Object.entries(stats)) {
        formatted[teacherName] = { numberOfStudents: students.size, salary };
      }
      return formatted;
    };

    setTeacherStatsLastMonth(formatStats(lastMonthStats));
    setTeacherStatsAllTime(formatStats(allTimeStats));
  };

  const addTeacher = async () => {
    if (addButtonDisabled) return alert('Калі ласка, запоўніце ўсе палі!'); 

    const response = await createTeacher(newTeacher);
    setTeachers([...teachers, response.data.teacher]);
    setNewTeacher({ name: '', rating: MemberRating.Good, status: MemberStatus.Working, language: MemberLanguage.German, comments: '' });

    alert('Настаўнік паспяхова дададзены!');
  };

  const updateTeacherFunction = async (index, field, value) => {
    const updatedTeachers = [...teachers];
    updatedTeachers[index][field] = value;
    setTeachers(updatedTeachers);
    await updateTeacher(updatedTeachers[index]);
  };

  const deleteTeacherFunction = async (index) => {
    const response = await deleteTeacher(teachers[index]._id);
    if (response.data.message === 'Настаўнік паспяхова выдалены') {
      const updatedTeachers = teachers.filter((_, i) => i !== index);
      setTeachers(updatedTeachers);

      alert('Настаўнік паспяхова выдалены!');
    }
  }

  return (
    <div className="teacher-container">
      <h2>Настаўнікі</h2>
      <table className="teacher-table">
        <thead>
          <tr>
            <th></th>
            <th>Імя</th>
            <th>Рэйтынг</th>
            <th>Каментары</th>
            <th>Статус</th>
            <th>Мова</th>
            <th>Колькасць студэнтаў (за мінулы месяц)</th>
            <th>Заробак (за мінулы месяц)</th>
            <th>Колькасць студэнтаў (за ўвесь час)</th>
            <th>Заробак (за ўвесь час)</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && 
            <tr>
              <td colSpan={12}>
                <LoaderComponent size="70px"/>
              </td>
            </tr>
          }

          {teachers?.map((teacher, index) => (
            <tr key={index}>
              {/* <td>
                <button onClick={() => deleteTeacherFunction(index)}>Delete</button>
              </td> */}
              <td>{index + 1}</td>
              <td>
                <input type="text" value={teacher.name} onChange={(e) => updateTeacherFunction(index, 'name', e.target.value)} />
              </td>
              <td>
                <select value={teacher.rating} onChange={(e) => updateTeacherFunction(index, 'rating', e.target.value)}>
                  {Object.values(MemberRating).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </td>
              <td>
                <textarea value={teacher.comments} onChange={(e) => updateTeacherFunction(index, 'comments', e.target.value)}></textarea>
              </td>
              <td>
                <select value={teacher.status} onChange={(e) => updateTeacherFunction(index, 'status', e.target.value)}>
                  {Object.values(MemberStatus).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </td>
              <td>
                <select value={teacher.language} onChange={(e) => updateTeacherFunction(index, 'language', e.target.value)}>
                  {Object.values(MemberLanguage).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </td>
              <td>{teacherStatsLastMonth[teacher.name]?.numberOfStudents || 0}</td>
              <td>{teacherStatsLastMonth[teacher.name]?.salary || 0}</td>
              <td>{teacherStatsAllTime[teacher.name]?.numberOfStudents || 0}</td>
              <td>{teacherStatsAllTime[teacher.name]?.salary || 0}</td>
            </tr>
          ))}

         <tr>
            <td colSpan={20}><hr className='hr-calculations' /></td>
         </tr>

          <tr>
            <td></td>
            <td>
              <input type="text" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} />
            </td>
            <td>
              <select value={newTeacher.rating} onChange={(e) => setNewTeacher({ ...newTeacher, rating: e.target.value })}>
                  {Object.values(MemberRating).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
              </select>
            </td>
            <td>
              <textarea value={newTeacher.comments} onChange={(e) => setNewTeacher({ ...newTeacher, comments: e.target.value })}></textarea>
            </td>
            <td>
              <select value={newTeacher.status} onChange={(e) => setNewTeacher({ ...newTeacher, status: e.target.value })}>
                  {Object.values(MemberStatus).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
              </select>
            </td>
            <td>
              <select value={newTeacher.language} onChange={(e) => setNewTeacher({ ...newTeacher, language: e.target.value })}>
                  {Object.values(MemberLanguage).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
              </select>
            </td>
            <td colSpan="1">
              <button onClick={addTeacher}>Дадаць настаўніка</button>
            </td>
          </tr>
          <tr>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Teachers;
