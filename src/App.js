import React, { useState } from 'react';
import './App.css';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [healthData, setHealthData] = useState(null);
  const [dietType, setDietType] = useState('');
  const [dietCompatibility, setDietCompatibility] = useState('');

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file)); // Display the uploaded image
  };

  // Extract ingredients from the image (API call 1)
  const extractIngredients = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);

    // API call to extract ingredients (replace with your actual API)
    const response = await fetch('/api/extract-ingredients', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setIngredients(data.ingredients);

    // Trigger health analysis after extraction
    analyzeIngredients(data.ingredients);
  };

  // Analyze the health impact of the ingredients (API call 2)
  const analyzeIngredients = async (ingredients) => {
    const response = await fetch('/api/analyze-health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });
    const data = await response.json();
    setHealthData(data.healthBreakdown);
  };

  // Check if the ingredients are compatible with the selected diet (API call 3)
  const checkDietCompatibility = async () => {
    const response = await fetch('/api/check-diet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients, dietType }),
    });
    const data = await response.json();
    setDietCompatibility(data.result);
  };

  // Pie chart data for health breakdown
  const pieChartData = {
    labels: healthData ? Object.keys(healthData) : [],
    datasets: [
      {
        label: 'Health Analysis',
        data: healthData ? Object.values(healthData) : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Food Insight Analyzer</h1>
      </header>

      <div className="container">
        {/* Upload and Extract Ingredients Section */}
        <div className="card">
          <h2>Upload Image to Get Ingredients</h2>
          <input type="file" onChange={handleFileChange} />
          {imageUrl && <img src={imageUrl} alt="Uploaded" className="uploaded-image" />}
          <button onClick={extractIngredients}>Upload and Extract</button>
          {ingredients && <p>Extracted Ingredients: {ingredients}</p>}
        </div>

        {/* Ingredient Health Analysis Section */}
        <div className="card">
          <h2>Ingredient Health Analysis</h2>
          {ingredients && <textarea readOnly value={ingredients} />}
          {healthData && (
            <div className="pie-chart-container">
              <Pie data={pieChartData} />
            </div>
          )}
        </div>

        {/* Check Diet Compatibility Section */}
        <div className="card">
          <h2>Check Diet Compatibility</h2>
          <textarea readOnly value={ingredients} />
          <select onChange={(e) => setDietType(e.target.value)}>
            <option value="">Select Diet Type</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
          <button onClick={checkDietCompatibility}>Check</button>
          {dietCompatibility && <p>Compatibility: {dietCompatibility}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
