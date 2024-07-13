// src/Calculator.js (Add save functionality)
import React, { useState } from 'react';
import axios from 'axios';

const Calculator = () => {
  const [cost, setCost] = useState(0);
  const [lessons, setLessons] = useState(0);
  const [results, setResults] = useState(null);

  const calculate = () => {
    const total = cost * lessons;
    const lawyer = total * 0.2;
    const teacher = total * 0.3;
    const accountant = total * 0.1;
    setResults({ total, lawyer, teacher, accountant });
  };

  const saveResults = async () => {
    if (results) {
      await axios.post('http://localhost:5000/save', results);
      alert('Results saved successfully!');
    }
  };

  return (
    <div>
      <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost of Lesson" />
      <input type="number" value={lessons} onChange={(e) => setLessons(e.target.value)} placeholder="Number of Lessons" />
      <button onClick={calculate}>Calculate</button>
      {results && (
        <>
          <table>
            <thead>
              <tr>
                <th>Total</th>
                <th>Lawyer</th>
                <th>Teacher</th>
                <th>Accountant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{results.total}</td>
                <td>{results.lawyer}</td>
                <td>{results.teacher}</td>
                <td>{results.accountant}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={saveResults}>Save Results</button>
        </>
      )}
    </div>
  );
};

export default Calculator;
