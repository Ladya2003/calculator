import React, { useState, useEffect } from 'react';
import { createStudent, deleteStudent, fetchStudents, updateStudent } from '../api/students';
import { MemberCurrency, MemberLanguage, MemberRating, MemberStatus } from '../constants/member';
import { fetchCalculations } from '../api/calculations';
import LoaderComponent from './LoaderComponent';
import './styles/Students.css';
import { fetchCurrencies } from '../api/currencies';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', rating: MemberRating.Good, status: MemberStatus.Working, language: MemberLanguage.German, comments: '' });
  const addButtonDisabled = Object.values(newStudent).some(value => value === '');
  const [studentMoneyLastMonth, setStudentMoneyLastMonth] = useState({});
  const [studentMoneyAllTime, setStudentMoneyAllTime] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState([]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const currencies = Object.values(MemberCurrency);
      const rates = {};
  
      for (const currency of currencies) {
        const currencyResponse = await fetchCurrencies(currency);
        const rate = currencyResponse.data.rates[MemberCurrency.EUR];
        rates[currency] = rate;
      }
  
      return rates;
    };

    const fetchStudentsFunction = async () => {
      setIsLoading(true);

      const response = await fetchStudents();
      response.data && setStudents(response.data.students);

      const rates = await fetchExchangeRates();
      setConvertedAmounts(rates);

      setIsLoading(false);

    };

    fetchStudentsFunction();
  }, []);

  useEffect(() => {
    if (convertedAmounts) {
      const performCalculations = async () => {
        const calculationsResponse = await fetchCalculations();
        if (calculationsResponse.data) {
          const calculations = calculationsResponse.data.calculations;
          calculateMoney(calculations);
        }
      };
  
      performCalculations();
    }
  }, [convertedAmounts]);

  const calculateMoney = (calculations) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthCalculations = {};
    const allTimeCalculations = {};

    calculations.forEach(calculation => {
      const { studentName, lessonCost, lessons, createdAt, currency } = calculation;
      const money = lessonCost * lessons * convertedAmounts[currency];

      if (!allTimeCalculations[studentName]) allTimeCalculations[studentName] = 0;
      allTimeCalculations[studentName] += money;

      const createdAtDate = new Date(createdAt);
      if (createdAtDate >= lastMonth) {
        if (!lastMonthCalculations[studentName]) lastMonthCalculations[studentName] = 0;
        lastMonthCalculations[studentName] += money;
      }
    });

    setStudentMoneyLastMonth(lastMonthCalculations);
    setStudentMoneyAllTime(allTimeCalculations);
  };

  const addStudent = async () => {
    if (addButtonDisabled) return alert('Калі ласка, запоўніце ўсе палі!'); 

    const response = await createStudent(newStudent);
    setStudents([...students, response.data.student]);
    setNewStudent({ name: '', rating: MemberRating.Good, status: MemberStatus.Working, language: MemberLanguage.German, comments: '' });

    alert('Студэнт паспяхова дададзены!');
  };

  const updateStudentFunction = async (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
    await updateStudent(updatedStudents[index]);
  };

  const deleteStudentFunction = async (index) => {
    const response = await deleteStudent(students[index]._id);
    if (response.data.message === 'Студэнт паспяхова выдалены') {
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);

      alert('Студэнт паспяхова выдалены!');
    }
  }

  return (
    <div className="student-container">
      <h2>Студэнты</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th></th>
            <th>Імя</th>
            <th>Рэйтынг</th>
            <th>Каментары</th>
            <th>Статус</th>
            <th>Мова</th>
            <th>Грошы ад студэнта (за мінулы месяц)</th>
            <th>Грошы ад студэнта (за ўвесь час, EUR)</th>
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

          {students?.map((student, index) => (
            <tr key={index}>
               <td>
                {index + 1}
                {/* <button onClick={() => deleteStudentFunction(index)}>Выдаліць</button> */}
              </td>
              <td>
                <input type="text" value={student.name} onChange={(e) => updateStudentFunction(index, 'name', e.target.value)} />
              </td>
              <td>
                <select value={student.rating} onChange={(e) => updateStudentFunction(index, 'rating', e.target.value)}>
                  {Object.values(MemberRating).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </td>
              <td>
                <textarea value={student.comments} onChange={(e) => updateStudentFunction(index, 'comments', e.target.value)}></textarea>
              </td>
              <td>
                <select value={student.status} onChange={(e) => updateStudentFunction(index, 'status', e.target.value)}>
                  {Object.values(MemberStatus).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </td>
              <td>
                <select value={student.language} onChange={(e) => updateStudentFunction(index, 'language', e.target.value)}>
                  {Object.values(MemberLanguage).map((rating) => 
                    <option key={rating} value={rating}>{rating}</option>
                  )}
                </select>
              </td>
              <td>{(studentMoneyLastMonth[student.name] || 0).toFixed(2)}</td>
              <td>{(studentMoneyAllTime[student.name] || 0).toFixed(2)}</td>
            </tr>
          ))}

         <tr>
            <td colSpan={20}><hr className='hr-calculations' /></td>
         </tr>

          <tr>
            <td></td>
            <td>
              <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
            </td>
            <td>
              <select value={newStudent.rating} onChange={(e) => setNewStudent({ ...newStudent, rating: e.target.value })}>
                {Object.values(MemberRating).map((rating) => 
                  <option key={rating} value={rating}>{rating}</option>
                )}
              </select>
            </td>
            <td>
              <textarea value={newStudent.comments} onChange={(e) => setNewStudent({ ...newStudent, comments: e.target.value })}></textarea>
            </td>
            <td>
              <select value={newStudent.status} onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}>
                {Object.values(MemberStatus).map((rating) => 
                  <option key={rating} value={rating}>{rating}</option>
                )}
              </select>
            </td>
            <td>
              <select value={newStudent.language} onChange={(e) => setNewStudent({ ...newStudent, language: e.target.value })}>
                {Object.values(MemberLanguage).map((rating) => 
                  <option key={rating} value={rating}>{rating}</option>
                )}
              </select>
            </td>
            <td colSpan="1">
              <button onClick={addStudent}>Дадаць студэнта</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Students;
