import React, { useState, useEffect } from 'react';
import './styles/Calculator.css';
import { fetchCurrencies } from '../api/currencies';
import { fetchTeachers } from '../api/teachers';
import { fetchStudents } from '../api/students';
import { createCalculation, deleteCalculation, fetchCalculations, updateCalculation } from '../api/calculations';
import { MemberCurrency, MemberStatus } from '../constants/member';
import { displayCurrency, getBackgroundColor, isDifferentMonth } from '../utils/calculations';
import LoaderComponent from './LoaderComponent';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const Calculator = () => {
  const [rows, setRows] = useState([]);
  const [currencies, setCurrencies] = useState({
    [MemberCurrency.PLN]: 0,
    [MemberCurrency.USD]: 0,
    [MemberCurrency.EUR]: 0,
    [MemberCurrency.BYN]: 0,
  });
  const [rowCurrencies, setRowCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [newCalculation, setNewCalculation] = useState({
    currency: MemberCurrency.PLN,
    teacherName: '',
    studentName: '',
    lessons: 0,
    lessonCost: 0,
    taxPercentage: 0,
    teachersCostFor90Mins: 0,
    teachersMinutes: 0,
    firmPercentage: 0,
    comments: ''
  });
  const [convertedAmounts, setConvertedAmounts] = useState([]);

  const addButtonDisabled = Object.entries(newCalculation).some(([field, value]) => value === '' && field !== 'comments');

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);

      const teacherResponse = await fetchTeachers();
      setTeachers(teacherResponse.data.teachers);

      const studentResponse = await fetchStudents();
      setStudents(studentResponse.data.students);

      const calculationsResponse = await fetchCalculations();
      setRows(calculationsResponse.data.calculations);


      setNewCalculation({...newCalculation, teacherName: teacherResponse.data.teachers[0]?.name, studentName: studentResponse.data.students[0]?.name});

      setIsLoading(false);
    };

    const convertToEuro = async () => {
      // here you need to iterate over all MemberCurrency values, call fetchCurrencies for each of them, and set all rates to the state
      const currencies = Object.values(MemberCurrency);
      const rates = {};
  
      for (const currency of currencies) {
        const currencyResponse = await fetchCurrencies(currency);
        const rate = currencyResponse.data.rates[MemberCurrency.EUR];
        rates[currency] = rate;
      }
  
      setConvertedAmounts(rates);
    }

    fetchInitialData();
    convertToEuro();
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async (currency) => {
      const currencyResponse = await fetchCurrencies(currency);
      const baseAmount = ((newCalculation?.lessons * newCalculation?.lessonCost) - ((newCalculation?.lessons * newCalculation?.lessonCost) * newCalculation?.taxPercentage / 100) - ((newCalculation?.lessons * newCalculation?.lessonCost) * newCalculation?.firmPercentage / 100) - ((newCalculation?.teachersMinutes * newCalculation?.teachersCostFor90Mins) / 90)) / 2;
      const exchangeRates = {};
      for (const currency of Object.values(MemberCurrency)) {
        const rate = currencyResponse.data.rates[currency];
        const amountInCurrency = baseAmount * rate;
        exchangeRates[currency] = amountInCurrency;
      }
      setCurrencies(exchangeRates);
    };

    if (newCalculation.currency) {
      fetchExchangeRates(newCalculation.currency);
    } else {
      fetchExchangeRates(MemberCurrency.PLN);
    }
  }, [newCalculation]);

  useEffect(() => {
    const fetchExchangeRates = async (currency, index) => {
      const currencyResponse = await fetchCurrencies(currency);
      const baseAmount = ((rows[index]?.lessons * rows[index]?.lessonCost) - ((rows[index]?.lessons * rows[index]?.lessonCost) * rows[index]?.taxPercentage / 100) - ((rows[index]?.lessons * rows[index]?.lessonCost) * rows[index]?.firmPercentage / 100) - ((rows[index]?.teachersMinutes * rows[index]?.teachersCostFor90Mins) / 90)) / 2;
      const exchangeRates = {};
      for (const currency of Object.values(MemberCurrency)) {
        const rate = currencyResponse.data.rates[currency];
        const amountInCurrency = baseAmount * rate;
        exchangeRates[currency] = amountInCurrency;
      }
      setRowCurrencies(prevRowCurrencies => {
        const updatedRowCurrencies = [...prevRowCurrencies];
        updatedRowCurrencies[index] = exchangeRates;
        return updatedRowCurrencies;
      });
    };

    if (rows && rows.length > 0) {
      rows.forEach((row, index) => {
        if (row.currency) {
          fetchExchangeRates(row.currency, index);
        } else {
          fetchExchangeRates(MemberCurrency.PLN, index);
        }
      });
    }
  }, [rows]);

  const updateRow = async (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    await updateCalculation(updatedRows[index]);
  };

  const deleteRow = async (index) => {
    const response = await deleteCalculation(rows[index]._id);
    if (response.data.message === 'Разлік паспяхова выдалены') {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);

      alert('Разлік паспяхова выдалены!');
    }
    
  };

  const addCalculation = async () => {
    if (addButtonDisabled) return alert('Калі ласка, запоўніце ўсе палі!'); 

    const response = await createCalculation(newCalculation);
    setRows([response.data.calculation, ...rows]);
    setNewCalculation({
      currency: MemberCurrency.PLN,
      teacherName: teachers[0]?.name, 
      studentName: students[0]?.name,
      lessons: 0,
      lessonCost: 0,
      taxPercentage: 0,
      teachersCostFor90Mins: 0,
      teachersMinutes: 0,
      firmPercentage: 0,
      comments: ''
    });

    alert('Разлік паспяхова дададзены!');
    // if (window !== 'undefined') window.location.reload();
  };

  return (
    <div className="calculator-container">
      <h4 style={{ 'text-align': 'left' }}>Дадаць новы разлік</h4>

      <table className="calculator-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Валюта</th>
            <th>Імя настаўніка</th>
            <th>Імя вучня</th>
            <th>Урокі</th>
            <th>Кошт урока</th>
            <th>Кошт урокаў</th>
            <th>Працэнт падатку</th>
            <th>Падатак</th>
            <th>Кошт настаўніка за 90 хвілін</th>
            <th>Хвіліны настаўніка</th>
            <th>Зарплата настаўніка</th>
            <th>Працэнт фірмы</th>
            <th>Грошы фірмы</th>
            <th>Грошы Кірыла</th>
            <th>Грошы Марыны</th>
            <th>Валюты</th>
            <th>Каментары</th>
            <th>Дзеянні</th>
          </tr>
        </thead>
        <tbody>
        <tr>
            <td></td>
            <td>
              <select value={newCalculation.currency} onChange={(e) => setNewCalculation({ ...newCalculation, currency: e.target.value })}>
                {Object.values(MemberCurrency).map((currency) => 
                  <option key={currency} value={currency}>{currency}</option>
                )}
              </select>
            </td>
            <td>
              <select value={newCalculation.teacherName} onChange={(e) => setNewCalculation({ ...newCalculation, teacherName: e.target.value })}>
                {teachers?.filter((newTeacher) => newTeacher.status !== MemberStatus.Fired).map((teacher) => (
                  <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
                ))}
              </select>
            </td>
            <td>
              <select value={newCalculation.studentName} onChange={(e) => setNewCalculation({ ...newCalculation, studentName: e.target.value })}>
                {students?.filter((newTeacher) => newTeacher.status !== MemberStatus.Fired).map((student) => (
                  <option key={student._id} value={student.name}>{student.name}</option>
                ))}
              </select>
            </td>
            <td>
              <input type="number" value={newCalculation.lessons} onChange={(e) => setNewCalculation({ ...newCalculation, lessons: e.target.value })} />
            </td>
            <td>
              <input type="number" step="5" value={newCalculation.lessonCost} onChange={(e) => setNewCalculation({ ...newCalculation, lessonCost: e.target.value })} />
            </td>
            <td>{!!newCalculation.lessonCost && !!newCalculation.lessons ? (newCalculation.lessons * newCalculation.lessonCost).toFixed(2) : 0}</td>
            <td>
              <input type="number" step="10" value={newCalculation.taxPercentage} onChange={(e) => setNewCalculation({ ...newCalculation, taxPercentage: e.target.value })} />
            </td>
            <td>{!!newCalculation.lessonCost && !!newCalculation.lessons && !!newCalculation.taxPercentage ? ((newCalculation.lessons * newCalculation.lessonCost) * newCalculation.taxPercentage / 100).toFixed(2) : 0}</td>
            <td>
              <input type="number" step="5" value={newCalculation.teachersCostFor90Mins} onChange={(e) => setNewCalculation({ ...newCalculation, teachersCostFor90Mins: e.target.value })} />
            </td>
            <td>
              <input type="number" step="10" value={newCalculation.teachersMinutes} onChange={(e) => setNewCalculation({ ...newCalculation, teachersMinutes: e.target.value })} />
            </td>
            <td>{!!newCalculation.teachersCostFor90Mins && !!newCalculation.teachersMinutes ? ((newCalculation.teachersMinutes * newCalculation.teachersCostFor90Mins) / 90).toFixed(2) : 0}</td>
            <td>
              <input type="number" step="10" value={newCalculation.firmPercentage} onChange={(e) => setNewCalculation({ ...newCalculation, firmPercentage: e.target.value })} />
            </td>
            <td>{((newCalculation.lessons * newCalculation.lessonCost) * newCalculation.firmPercentage / 100).toFixed(2)}</td>
            <td>{(((newCalculation.lessons * newCalculation.lessonCost) - ((newCalculation.lessons * newCalculation.lessonCost) * newCalculation.taxPercentage / 100) - ((newCalculation.lessons * newCalculation.lessonCost) * newCalculation.firmPercentage / 100) - ((newCalculation.teachersMinutes * newCalculation.teachersCostFor90Mins) / 90)) / 2).toFixed(2)}</td>
            <td>{(((newCalculation.lessons * newCalculation.lessonCost) - ((newCalculation.lessons * newCalculation.lessonCost) * newCalculation.taxPercentage / 100) - ((newCalculation.lessons * newCalculation.lessonCost) * newCalculation.firmPercentage / 100) - ((newCalculation.teachersMinutes * newCalculation.teachersCostFor90Mins) / 90)) / 2).toFixed(2)}</td>
            <td>
              {Object.values(MemberCurrency).map((currency) => (
                <div key={currency}>{currency}: {(currencies?.[currency])?.toFixed(2)} {displayCurrency(currency)}</div>
              ))}
            </td>
            <td>
              <textarea value={newCalculation.comments} onChange={(e) => setNewCalculation({ ...newCalculation, comments: e.target.value })}></textarea>
            </td>
            <td>
              <button onClick={addCalculation}>Дадаць разлік</button>
            </td>
          </tr>

         <tr>
            <td colSpan={20}><hr className='hr-calculations' /></td>
         </tr>

         {isLoading && 
          <tr>
            <td colSpan={10}>
              <LoaderComponent size="70px"/>
            </td>
          </tr>
          }

          <tr>
            <td colSpan={19}>
            <h4 style={{ 'text-align': 'left' }}>Усе разлікі</h4>
            </td>
          </tr>

          {rows?.map((row, index) => (
            <>
            {getBackgroundColor(index, row, rows[index - 1]) && <tr>
              <td colSpan={19}>
                <h4 style={{ 'text-align': 'left', textTransform: 'capitalize' }}>{dayjs(row.createdAt).format('MMM D, YYYY')}</h4>
              </td>
            </tr>}
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <select value={row.currency} onChange={(e) => updateRow(index, 'currency', e.target.value)}>
                  {Object.values(MemberCurrency).map((currency) => 
                    <option key={currency} value={currency}>{currency}</option>
                  )}
                </select>
              </td>
              <td>
                <select value={row.teacherName} onChange={(e) => updateRow(index, 'teacherName', e.target.value)}>
                  {teachers?.map((teacher) => (
                    <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select value={row.studentName} onChange={(e) => updateRow(index, 'studentName', e.target.value)}>
                  {students?.map((student) => (
                    <option key={student._id} value={student.name}>{student.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <input type="number" value={row.lessons} onChange={(e) => updateRow(index, 'lessons', e.target.value)} />
              </td>
              <td>
                <input type="number" step="5" value={row.lessonCost} onChange={(e) => updateRow(index, 'lessonCost', e.target.value)} />
              </td>
              <td>{!!row.lessonCost && !!row.lessons ? (row.lessons * row.lessonCost).toFixed(2) : 0}</td>
              <td>
                <input type="number" step="0.01" value={row.taxPercentage} onChange={(e) => updateRow(index, 'taxPercentage', e.target.value)} />
              </td>
              <td>{!!row.lessonCost && !!row.lessons && !!row.taxPercentage ? ((row.lessons * row.lessonCost) * row.taxPercentage / 100).toFixed(2) : 0}</td>
              <td>
                <input type="number" step="0.01" value={row.teachersCostFor90Mins} onChange={(e) => updateRow(index, 'teachersCostFor90Mins', e.target.value)} />
              </td>
              <td>
                <input type="number" step="0.01" value={row.teachersMinutes} onChange={(e) => updateRow(index, 'teachersMinutes', e.target.value)} />
              </td>
              <td>{!!row.teachersCostFor90Mins && !!row.teachersMinutes ? ((row.teachersMinutes * row.teachersCostFor90Mins) / 90).toFixed(2) : 0}</td>
              <td>
                <input type="number" step="0.01" value={row.firmPercentage} onChange={(e) => updateRow(index, 'firmPercentage', e.target.value)} />
              </td>
              <td>{((row.lessons * row.lessonCost) * row.firmPercentage / 100).toFixed(2)}</td>
              <td>{(((row.lessons * row.lessonCost) - ((row.lessons * row.lessonCost) * row.taxPercentage / 100) - ((row.lessons * row.lessonCost) * row.firmPercentage / 100) - ((row.teachersMinutes * row.teachersCostFor90Mins) / 90)) / 2).toFixed(2)}</td>
              <td>{(((row.lessons * row.lessonCost) - ((row.lessons * row.lessonCost) * row.taxPercentage / 100) - ((row.lessons * row.lessonCost) * row.firmPercentage / 100) - ((row.teachersMinutes * row.teachersCostFor90Mins) / 90)) / 2).toFixed(2)}</td>
              <td>
                {!!rowCurrencies && !!rowCurrencies > 0 && Object.values(MemberCurrency).map((currency) => (
                  <div key={currency}>{currency}: {(rowCurrencies?.[index]?.[currency])?.toFixed(2)} {displayCurrency(currency)}</div>
                ))}
              </td>
              <td>
                <textarea value={row.comments} onChange={(e) => updateRow(index, 'comments', e.target.value)}></textarea>
              </td>
              <td>
                <button onClick={() => deleteRow(index)}>Выдаліць</button>
              </td>
            </tr>

            {isDifferentMonth(row, rows[index + 1]) && 
                <tr>
                  <td colSpan={2}>
                    Колькасць урокаў: {rows.filter((r) => dayjs(r.createdAt).isSame(row.createdAt, 'month')).reduce((acc, r) => acc + r.lessons, 0)}
                  </td>
                  <td colSpan={2}>
                    Агульная сума (EUR): {rows.filter((r) => dayjs(r.createdAt).isSame(row.createdAt, 'month')).reduce((acc, r) => acc + (r.lessons * r.lessonCost * convertedAmounts[r.currency]), 0).toFixed(2)}
                  </td>
                  <td colSpan={3}>
                    Агульная сума падатку (EUR): {rows.filter((r) => dayjs(r.createdAt).isSame(row.createdAt, 'month')).reduce((acc, r) => acc + (r.lessons * r.lessonCost) * r.taxPercentage * convertedAmounts[r.currency] / 100, 0).toFixed(2)}
                  </td>
                  <td colSpan={3}>
                    Агульная сума на фірму (EUR): {rows.filter((r) => dayjs(r.createdAt).isSame(row.createdAt, 'month')).reduce((acc, r) => acc + (r.lessons * r.lessonCost) * r.firmPercentage * convertedAmounts[r.currency] / 100, 0).toFixed(2)}
                  </td>
                  <td colSpan={3}>
                    Агульная доля Кiрылла (EUR): {rows.filter((r) => dayjs(r.createdAt).isSame(row.createdAt, 'month')).reduce((acc, r) => acc + ((r.lessons * r.lessonCost) - ((r.lessons * r.lessonCost) * r.taxPercentage / 100) - ((r.lessons * r.lessonCost) * r.firmPercentage / 100) - ((r.teachersMinutes * r.teachersCostFor90Mins) / 90)) * convertedAmounts[r.currency] / 2, 0).toFixed(2)}
                  </td>
                </tr>
              }
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calculator;
