// src/js/gradebook.js
// Data + parsing + utilities for Gradebook Explorer

// src/js/gradebook.js
// Lab 04 core logic: data structure, safe parsing, row/col retrieval, stats,
// plus a Promise-shaped placeholder loader.



// Convert any grade value into a number or null (for missing/invalid)
function parseGrade(value) {
  if (value === "" || value === null || value === undefined){
    return 0;
  }

  const n = Number(value);
  return n;
}
function handleCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const row = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j].trim()] = parts[j].trim();
    }

    rows.push(row);
  }

  return rows;
}
function buildGradebook(rows) {
  let sNames=[];
  let aNames = [];
  let m_stuff = [];

  const f_row = rows[0];
   for(let x in f_row){
    if(x!=="Student"){
        aNames.push(x);
    }
  }

  for(let i=0; i<rows.length; i++){
    const r_e = rows[i];
    sNames.push(r_e.Student);

    const sGrades =[];

    for(let j=0; j<aNames.length; j++){
        const t = aNames[j];
        const v = r_e[t];
        const n_GRADE = parseGrade(v);
        sGrades.push(n_GRADE);
    }

    m_stuff.push(sGrades);
  }

 
  return {
    students: sNames,
    assessments: aNames,
    matrix: m_stuff
  };


}

// Safety checks
function isValidRow(gb, rowIndex) {
  return Number.isInteger(rowIndex) && rowIndex >= 0 && rowIndex < gb.students.length;
}

function isValidCol(gb, colIndex) {
  return Number.isInteger(colIndex) && colIndex >= 0 && colIndex < gb.assessments.length;
}

// Retrieve a row as numeric array (nulls removed)
function getRowNums(gb, rowIndex) {
  if (!isValidRow(gb, rowIndex)) return [];
  const sScores = gb.matrix[rowIndex];

  let nums =[];
  for(let i =0; i<sScores.length;i++){
    const cGrades = sScores[i];
    if(cGrades!=null && !isNaN(cGrades)){
        nums.push(cGrades)
    }
  }
  return nums;
}

// Retrieve a column as numeric array (nulls removed)
function getColNums(gb, colIndex) {
  if (!isValidCol(gb, colIndex)) {
    return [];
  }

  let nums = [];

  for (let i = 0; i < gb.matrix.length; i++) {
    const cGrade = gb.matrix[i][colIndex];
    if (cGrade != null || !isNaN(cGrade)) {
      nums.push(cGrade);
    }
  }

  return nums;
}
// Basic summary stats
function getStats(nums) {
  if (!nums || nums.length === 0) {
    return { count: 0, mean: null, min: null, max: null };
  }


  let sum = 0;
  let min = nums[0];
  let max = nums[0];
  

  for (const x of nums) {
    sum += x;
    if (x < min) min = x;
    if (x > max) max = x;
  }

  return {
    min,
    count: nums.length,
    mean: sum / nums.length,
    max,
  };
}


async function loadGrades(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error("Failed to load CSV");
  }

  const text = await response.text();
  return handleCSV(text);
}

// Informal “unit tests” for Lab 04 (console.log)
(function quickTests() {
  const gb = buildGradebook(SAMPLE_GRADES);

  console.log("=== Lab 04 Core JS Tests ===");
  console.log("Students:", gb.students);
  console.log("Assessments:", gb.assessments);
  console.log("Row 0:", getRowNums(gb, 0));
  console.log("Col 1:", getColNums(gb, 1));
  console.log("Summary Row 0:", getStats(getRowNums(gb, 0)));
  console.log("Summary Col 1:", getStats(getColNums(gb, 1)));
  console.log("Invalid row:", getRowNums(gb, 999)); // []
  console.log("Invalid col:", getColNums(gb, 999)); // []
})();