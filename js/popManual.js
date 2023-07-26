var manualDataButton = document.getElementById("manualDataButton");
var modal = document.getElementById("manualDataModal");
var closeButton = document.querySelector("#manualDataModal .close");
var inputDataField = document.getElementById("inputData");
var addDataButton = document.getElementById("addDataButton");
var dataList = document.getElementById("dataList");
var processDataButton = document.getElementById("processDataButton");
var deleteLatestColumn = document.getElementById("clearColumns");

var dataItems = [];



manualDataButton.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "block";
});


closeButton.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
});



addDataButton.addEventListener("click", function () {
  var input = inputDataField.value.trim();
  if (input !== "") {
    // Split the input into separate column names using commas
    var newItems = input.split(",").map(function (item) {
      return item.trim();
    });
    // Add the new column names to the dataItems array
    dataItems = dataItems.concat(newItems);
    renderDataList();
    inputDataField.value = "";
  }
});





processDataButton.addEventListener("click", function () {
  if (dataItems.length === 0) {
    alert("Please enter column names first!");
    return;
  }

  var numberOfColumns = dataItems.length;
  var columnDataInputs = document.createElement("div");
  columnDataInputs.classList.add("column-data-inputs");

  for (var i = 0; i < numberOfColumns; i++) {
    var label = document.createElement("label");
    label.textContent = "Enter values for Column " + dataItems[i] + ":";
    var input = document.createElement("input");
    input.type = "text";
    input.name = "column_" + (i + 1);
    columnDataInputs.appendChild(label);
    columnDataInputs.appendChild(input);
  }

  // Hide the current modal
  modal.style.display = "none";

  // Create a new modal for inputting column values
  var columnValuesModal = document.createElement("div");
  columnValuesModal.classList.add("modal");

  var modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  var closeColumnValuesModal = document.createElement("span");
  closeColumnValuesModal.classList.add("close");
  closeColumnValuesModal.textContent = "×";
  modalContent.appendChild(closeColumnValuesModal);
  
  // Add click event listener to close the modal when the "×" button is clicked
  closeColumnValuesModal.addEventListener("click", function() {
    columnValuesModal.style.display = "none";
  });

  columnValuesModal.appendChild(modalContent);



  
  var header = document.createElement("h2");
  header.textContent = "Enter Values for Each Column";
  modalContent.appendChild(header);

  modalContent.appendChild(columnDataInputs);

  var processColumnValuesButton = document.createElement("button");
  processColumnValuesButton.textContent = "Process Column Values";
  modalContent.appendChild(processColumnValuesButton);

  columnValuesModal.appendChild(modalContent);
  document.body.appendChild(columnValuesModal);

  // Display the new modal
  columnValuesModal.style.display = "block";

  // Event listener for processing column values
  processColumnValuesButton.addEventListener("click", function () {
    var columnValues = {};
    var inputs = columnDataInputs.querySelectorAll("input");

    // Collect all the values into an array of arrays
    var valuesArray = [];
    for (var j = 0; j < inputs.length; j++) {
      var value = inputs[j].value.trim();
      var singleColumnArray = value.split(",").map(function (item) {
        return parseFloat(item.trim());
      });
      valuesArray.push(singleColumnArray);
    }

    // Determine the number of rows based on the maximum number of elements in a column
    var numRows = Math.max(...valuesArray.map((arr) => arr.length));

    // Convert the array of arrays to an array of objects where keys are column names
    for (var i = 0; i < inputs.length; i++) {
      columnValues[dataItems[i]] = [];
      for (var row = 0; row < numRows; row++) {
        columnValues[dataItems[i]].push(valuesArray[i][row] || ""); // Use an empty string if the value doesn't exist
      }
    }

    // Convert the columnValues object to CSV format with column names included
    var csvData = Object.keys(columnValues).join(",") + "\n";
    for (var row = 0; row < numRows; row++) {
      csvData += row + 1 + ","; // Include the row number
      csvData +=
        Object.keys(columnValues)
          .map(function (key) {
            return columnValues[key][row];
          })
          .join(",") + "\n";
    }

    // Save the CSV data in local storage
    localStorage.setItem("userData", csvData);

    console.log(csvData);

    renderCSVData(csvData);
    // Close the column values modal
    columnValuesModal.style.display = "none";
    currentCSV = jsonData;
    columnNamesArray = columnNames;
    console.log(currentCSV);
    console.log(columnNamesArray);

    for (var column in columnNames) {
      if (column !== "") {
        createChart(jsonData, columnNames[column]);
      }
    }

    updateSlideshow();
    showSlideshowControls();
    showButtonContainer2();
    showSlideshowHeader();

    setInterval(updateSlideshow, 7000);
    initializeStatisticsModal();
    initializeCalculatorModal();
    initializePredictionModal();
  });
});

function renderDataList() {
  dataList.innerHTML = "";
  var items = dataItems.join(",").split(",");
  items.forEach(function (item) {
    var li = document.createElement("li");
    li.textContent = item.trim();
    dataList.appendChild(li);
  });

  var columnCount = document.createElement("li");
  columnCount.textContent = "Column count: " + items.length;
  dataList.appendChild(columnCount);
}
