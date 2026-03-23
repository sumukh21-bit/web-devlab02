// src/js/spreadsheet.js
// DOM generation + jQuery interactivity + editing + summary updates



// initializing the grade book
let GB = null;



// Automatically load the csv file when the page is ready
$(document).ready(async function () {
  const rows = await loadGrades("../data/grades.csv");
    GB = buildGradebook(rows);

    buildTable();
    dispSTATS("None: —", []);
  
})



//Gives the structutre so the content from the csv can be over here
function buildTable(){
  const $table = $("#gradebook-table");
  $table.empty();

  let thead = "<thead><tr><th>Student</th>";

  GB.assessments.forEach((name, colIndex) => {
    thead += `<th class="col-header" data-col="${colIndex}">${name}</th>`;
  });


  thead+= "</tr></thead>";
  $table.append(thead);


  let tbody = "<tbody>";

  GB.students.forEach((sname, rowIndex) => {
    tbody += `<tr>`;
    tbody += `<td class="row-header" data-row="${rowIndex}">${sname}</td>`;

    GB.assessments.forEach((_, colIndex) => {
      const v = GB.matrix[rowIndex][colIndex];
      const displayV = (v === null || isNaN(v)) ? "" : v;

      
     

      tbody += `
        <td contenteditable="true"
            data-row="${rowIndex}"
            data-col="${colIndex}">
          ${displayV}
        </td>
      `;
    });

    tbody += `</tr>`;
     });

     tbody += "</tbody>";
     $table.append(tbody);

  makeEditable();

}


//Checks wheter the user is making either a row selections or a col selection and what index 
let currentSelection = { type: null, index: null };

//This function lets the user edit and change the grades from 0 to 100
function makeEditable(){
  

 
  $("#gradebook-table").on("click", ".row-header", function () {
    const rowIndex = parseInt($(this).data("row"));
    clearSel();
    selectRow(rowIndex);
    currentSelection = { type: "row", index: rowIndex };
    updateCurrSel();
  });


 $("#gradebook-table").on("click", ".col-header", function () {
    const colIndex = parseInt($(this).data("col"));
    clearSel();
    selectColumn(colIndex);
    currentSelection = { type: "col", index: colIndex };
    updateCurrSel();
  });



  $("#gradebook-table").on("keydown", "td[contenteditable='true']", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $(this).blur();
    }
  });


  $("#gradebook-table").on("blur", "td[contenteditable='true']", function () {
    const $cell = $(this);
    const rowIndex = parseInt($cell.data("row"));
    const colIndex = parseInt($cell.data("col"));
    const marks = $cell.text().trim();

   

    if (marks === "") {
      GB.matrix[rowIndex][colIndex] = null;
      $cell.text("");
    } else {
      const intNum = Number(marks);
      if(intNum<0){
               
        $cell.text(0);
        return;
      }
      if(intNum>100){
        $cell.text(100);
        return;

      }

      if (isNaN(intNum)) {
        const oldValue = GB.matrix[rowIndex][colIndex];

        if(oldValue===null){
          $cell.text(NaN);

        }else{
          $cell.text(oldValue);

        }
      
        return;
      }

      GB.matrix[rowIndex][colIndex] = intNum;
      $cell.text(intNum);
    }

    updateCurrSel();
  });

}

//Clears any previous selection
function clearSel() {
  $("#gradebook-table td.selected").removeClass("selected");
}


//When the user clicks on the row
function selectRow(rowIndex) {
  if (!GB || !isValidRow(GB, rowIndex)){
    return;

  } 

  $(`#gradebook-table td[data-row='${rowIndex}']`).addClass("selected");
}

//When the user clicks on the columns
function selectColumn(colIndex) {
  if (!GB || !isValidCol(GB, colIndex)){
    return;

  } 

  $(`#gradebook-table td[data-col='${colIndex}']`).addClass("selected");
}

//When the user selects either row or column it updates the current selection

function updateCurrSel() {
  if (!currentSelection.type) {
    dispSTATS("None: —", []);
    return;
  }

  if (currentSelection.type === "row") {
    const rowIndex = currentSelection.index;
    const nums = getRowNums(GB, rowIndex);
    dispSTATS(`Student: ${GB.students[rowIndex]}`, nums);
    return;
  }

  if (currentSelection.type === "col") {
    const colIndex = currentSelection.index;
    const nums = getColNums(GB, colIndex);
    dispSTATS(`Assessment: ${GB.assessments[colIndex]}`, nums);
  }
}

//Display plays the stats like name of either the studebt or the assesment, total count, mean, min grade and max grade and finally updates the chart for visual data

function dispSTATS(label, nums) {
  const stats = getStats(nums);

  $("#slab").text(label);
  $("#CNT").text(stats.count);

  if(stats.mean===null){
    $("#MEAN").text("-");

  }else{
     $("#MEAN").text(stats.mean);

  }
  if(stats.min===null){
    $("#MIN").text("-");

  }else{
     $("#MIN").text(stats.min);

  }
  if(stats.max===null){
    $("#MAX").text("-");

  }else{
     $("#MAX").text(stats.max);

  }


    updateChart(nums);
  

}