import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calculator.css'; // Make sure to create and import this CSS file

const Calculator = () => {
  const [cost, setCost] = useState(0);
  const [lessons, setLessons] = useState(0);
  const [results, setResults] = useState(null);
  const [calculations, setCalculations] = useState([]);

  useEffect(() => {
    const fetchCalculations = async () => {
      const response = await axios.get('http://localhost:5000/calculations');
      setCalculations(response.data);
    };

    fetchCalculations();
  }, []);

  const calculate = () => {
    const total = cost * lessons;
    const lawyer = total * 0.2;
    const teacher = total * 0.3;
    const accountant = total * 0.1;
    setResults({ total, lawyer, teacher, accountant });
  };

  const saveResults = async () => {
    if (results) {
      const response = await axios.post('http://localhost:5000/save', results);
      if (response.data.message === 'Calculation saved successfully!') {
        setCalculations([...calculations, results]); // Add new result to the table
        alert('Results saved successfully!');
      }
    }
  };

  return (
    <div className="calculator-container">
      <div className="input-container">
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost of Lesson"
          className="input-field"
        />
        <input
          type="number"
          value={lessons}
          onChange={(e) => setLessons(e.target.value)}
          placeholder="Number of Lessons"
          className="input-field"
        />
        <button onClick={calculate} className="calculate-button">Calculate</button>
      </div>
      {results && (
        <>
          <table className="results-table">
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
          <button onClick={saveResults} className="save-button">Save Results</button>
        </>
      )}
      <h2>Past Calculations</h2>
      <table className="past-calculations-table">
        <thead>
          <tr>
            <th></th>
            <th>Total</th>
            <th>Lawyer</th>
            <th>Teacher</th>
            <th>Accountant</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calculation, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{calculation.total}</td>
              <td>{calculation.lawyer}</td>
              <td>{calculation.teacher}</td>
              <td>{calculation.accountant}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calculator;
