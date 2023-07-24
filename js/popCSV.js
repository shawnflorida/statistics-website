var charts = [];
var currentCSV = [];

var currentChartIndex = 2;
var columnNamesArray = [];

document.getElementById("csvButton").addEventListener("click", function (e) {
  e.preventDefault();
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv";
  fileInput.addEventListener("change", handleFileSelect);
  fileInput.click();
});
function handleFileSelect(e) {
  var selectedFile = e.target.files[0]; // Get the selected file from the file input
  csvName = selectedFile.name; // Get the name of the selected CSV file
  console.log("Selected CSV file name:", csvName);
  // Now you can use the csvName variable to store the CSV file name or perform any other actions with it.
}

document
  .getElementById("csvButton")
  .addEventListener("click", showButtonContainer2);

// Handle file selection
function handleFileSelect(event) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var csvData = e.target.result;
      renderCSVData(csvData);
    };
    reader.readAsText(file);
    csvName = file.name; // Get the name of the selected CSV file
    console.log("Selected CSV file name:", csvName);
  }
}

function renderCSVData(csvData) {
  var lines = csvData.split("\n");
  var jsonData = [];
  var columnNames = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var columns = lines[i].split(",");
    var rowData = {};

    var isValidRow = true;

    for (var j = 0; j < columns.length; j++) {
      var trimmedValue = columns[j].trim();
      if (trimmedValue === "undefined" || trimmedValue === "") {
        isValidRow = false;
        break;
      }

      // Check if the value matches a date pattern (e.g., "YYYY-MM-DD HH:mm:ss")
      if (isValidDate(trimmedValue)) {
        // If it's a valid date, store it as a Date object
        var dateValue = new Date(trimmedValue);
        rowData[columnNames[j]] = dateValue;
      } else {
        // Otherwise, store it as a string or other data type
        rowData[columnNames[j]] = trimmedValue;
      }
    }

    if (isValidRow) {
      jsonData.push(rowData);
    }
  }

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
}

// Function to check if a value matches a date pattern
function isValidDate(value) {
  var dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return dateRegex.test(value);
}
function clearSlideshow() {
  var slideshow = document.getElementById("slideshow");
  while (slideshow.firstChild) {
    slideshow.removeChild(slideshow.firstChild);
  }
}
