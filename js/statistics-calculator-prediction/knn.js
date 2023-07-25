function computeKNN(selectedColumns, k) {
  var xValues = currentCSV.map((row) => parseFloat(row[selectedColumns[0]]));
  var yValues = currentCSV.map((row) => parseFloat(row[selectedColumns[1]]));

  var distances = [];
  for (var i = 0; i < xValues.length; i++) {
    var distance = euclideanDistance(
      [xValues[i]],
      [xValues[selectedColumns[0]]]
    );
    distances.push({ index: i, distance: distance });
  }

  distances.sort((a, b) => a.distance - b.distance);

  var kNearestNeighbors = [];
  for (var i = 0; i < k; i++) {
    var index = distances[i].index;
    kNearestNeighbors.push({ x: xValues[index], y: yValues[index] });
  }

  var mode = findMode(kNearestNeighbors.map((neighbor) => neighbor.y));

  // Graph the result using scatter plot
  var regressionEquation = `KNN Mode: ${mode}`;
  knnChart(
    xValues,
    kNearestNeighbors.map((neighbor) => neighbor.y),
    regressionEquation
  );

  console.log(mode);
  return "KNN Mode is " + mode;
}

function findMode(arr) {
  var frequency = {};
  var maxFrequency = 0;
  var mode;
  for (var value of arr) {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFrequency) {
      maxFrequency = frequency[value];
      mode = value;
    }
  }
  return mode;
}

function euclideanDistance(point1, point2) {
  var sumSquaredDifferences = 0;
  for (var i = 0; i < point1.length; i++) {
    var difference = point1[i] - point2[i];
    sumSquaredDifferences += difference * difference;
  }
  return Math.sqrt(sumSquaredDifferences);
}

function knnChart(xValues, predictedValues, regressionEquation) {
  var ctx = document.getElementById("knnResultChart");
  ctx.width = 500;
  ctx.height = 450;
  // Check if a chart already exists on the canvas
  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "CSV Data",
          data: xValues.map((value, index) => ({ x: value, y: index })),
          borderColor: "black",
          backgroundColor: "lightblue",
          pointStyle: "rectRounded",
        },
        {
          label: "Predicted Values",
          data: predictedValues.map((value, index) => ({
            x: xValues[index],
            y: value,
          })), // Use xValues as x-values for the Predicted Values dataset
          borderColor: "black",
          backgroundColor: "pink",
          pointStyle: "rectRounded",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: regressionEquation,
      },
    },
  });
}

function callKNN() {
  document.getElementById("knnButton").addEventListener("click", function () {
    var modal = document.getElementById("knnModal");
    modal.style.display = "block";
  });

  document
    .getElementById("processKNNButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("knnColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }
      // Retrieve the value of K from the input field
      var knum = parseInt(document.getElementById("kValueNumber").value);

      console.log(selectedColumns.length);
      if (selectedColumns.length < 2) {
        var resultDiv = document.getElementById("knnResult");
        resultDiv.innerHTML =
          "Error: KNN requires at least 2 columns to be selected.";
        return;
      }

      var knnResult = computeKNN(selectedColumns, kValueNumber);

      var knnResult = computeKNN(selectedColumns, knum);

      var resultDiv = document.getElementById("knnResult");
      resultDiv.innerHTML = knnResult;

      logUserAction(sampleUserID, csvName, "K-Nearest Neighbor", selectedColumns + ",K:" + kValueNumber, knnResult );

    });

  document
    .getElementById("closeKNNButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("knnModal");
      modal.style.display = "none";
    });
  selectedColumns = [];
}

