let goals = { calories: 0, protein: 0 };
let consumptions = [];

function loadData() {
    const storedGoals = localStorage.getItem('goals');
    const storedConsumptions = localStorage.getItem('consumptions');
    
    if (storedGoals) {
        goals = JSON.parse(storedGoals);
        document.getElementById('calorieGoal').value = goals.calories;
        document.getElementById('proteinGoal').value = goals.protein;
    }
    
    if (storedConsumptions) {
        consumptions = JSON.parse(storedConsumptions);
    }
    
    updateDisplay();
}

function saveData() {
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('consumptions', JSON.stringify(consumptions));
}

function setGoals() {
    goals.calories = parseFloat(document.getElementById('calorieGoal').value) || 0;
    goals.protein = parseFloat(document.getElementById('proteinGoal').value) || 0;
    saveData();
    updateDisplay();
}

function addConsumption() {
    const calories = parseFloat(document.getElementById('caloriesConsumed').value) || 0;
    const protein = parseFloat(document.getElementById('proteinConsumed').value) || 0;
    let time = document.getElementById('mealTime').value;

    if (!time) {
        const now = new Date();
        time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    consumptions.push({ calories, protein, time });

    document.getElementById('caloriesConsumed').value = '';
    document.getElementById('proteinConsumed').value = '';
    document.getElementById('mealTime').value = '';

    saveData();
    updateDisplay();
}

function deleteConsumption(index) {
    consumptions.splice(index, 1);
    saveData();
    updateDisplay();
}

function resetConsumptions() {
    if (confirm('Are you sure you want to reset all consumptions?')) {
        consumptions = [];
        saveData();
        updateDisplay();
    }
}

function updateDisplay() {
    const totalConsumed = consumptions.reduce((total, consumption) => {
        total.calories += consumption.calories;
        total.protein += consumption.protein;
        return total;
    }, { calories: 0, protein: 0 });

    const remaining = {
        calories: Math.max(0, goals.calories - totalConsumed.calories),
        protein: Math.max(0, goals.protein - totalConsumed.protein)
    };

    document.getElementById('remaining').innerHTML = `
        Calories remaining: ${remaining.calories.toFixed(1)} kcal<br>
        Protein remaining: ${remaining.protein.toFixed(1)} g
    `;

    const consumptionLog = document.getElementById('consumptionLog');
    consumptionLog.innerHTML = '';
    consumptions.forEach((consumption, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${consumption.time} - 
            Calories: ${consumption.calories.toFixed(1)} kcal, 
            Protein: ${consumption.protein.toFixed(1)} g
            <button onclick="deleteConsumption(${index})">Delete</button>
        `;
        consumptionLog.appendChild(li);
    });
}

// Load data when the page loads
window.onload = loadData;