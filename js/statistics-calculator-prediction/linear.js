function computeLinearRegression() {
  var selectedColumns = [];
  var checkboxes = document.getElementsByName("linearRegressionColumn");
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selectedColumns.push(checkboxes[i].value);
    }
  }

  if (selectedColumns.length !== 2) {
    return "Error: Linear Regression requires exactly two columns.";
  }

  var dependentColumn = selectedColumns[0];
  var independentColumn = selectedColumns[1];

  console.log("Column Data Arrays:", currentCSV);

  var dependentData = currentCSV.map((row) => parseFloat(row[dependentColumn]));
  var independentData = currentCSV.map((row) =>
    parseFloat(row[independentColumn])
  );
  console.log(dependentData, independentData);

  var meanDependent =
    dependentData.reduce((acc, value) => acc + value, 0) / dependentData.length;
  var meanIndependent =
    independentData.reduce((acc, value) => acc + value, 0) /
    independentData.length;

  var numerator = 0;
  var denominator = 0;
  for (var i = 0; i < dependentData.length; i++) {
    numerator +=
      (independentData[i] - meanIndependent) *
      (dependentData[i] - meanDependent);
    denominator += Math.pow(independentData[i] - meanIndependent, 2);
  }

  var beta1 = numerator / denominator;
  var beta0 = meanDependent - beta1 * meanIndependent;

  var regressionEquation = `y = ${beta0.toFixed(2)} + ${beta1.toFixed(2)} * x`;

  // Get all values of the first column as xValues
  var xValues = currentCSV.map((row) => parseFloat(row[selectedColumns[0]]));
  var predictedValues = calculatePredictedValues(xValues, beta0, beta1);

  regressionChart(
    xValues,
    dependentData,
    independentData,
    predictedValues,
    regressionEquation
  );

  var rmse = calculateRMSE(dependentData, predictedValues);
  var formattedRMSE = rmse.toFixed(2);
  var regressionEquationWithRMSE = `${regressionEquation}, RMSE: ${formattedRMSE}`;

  return "Regression Equation is " + regressionEquationWithRMSE;
}

function calculateRMSE(actualValues, predictedValues) {
  var sumSquaredErrors = 0;
  for (var i = 0; i < actualValues.length; i++) {
    var squaredError = Math.pow(actualValues[i] - predictedValues[i], 2);
    sumSquaredErrors += squaredError;
  }

  var meanSquaredError = sumSquaredErrors / actualValues.length;
  var rmse = Math.sqrt(meanSquaredError);

  return rmse;
}

function calculatePredictedValues(xValues, beta0, beta1) {
  var predictedValues = [];
  for (var i = 0; i < xValues.length; i++) {
    var predictedValue = beta0 + beta1 * xValues[i];
    predictedValues.push(predictedValue.toFixed(2));
  }
  return predictedValues;
}

function regressionChart(
  xValues,
  xLabel,
  yLabel,
  predictedValues,
  regressionEquation
) {
  var ctx = document.getElementById("linearRegressionResultChart");
  ctx.width = 500;
  ctx.height = 500;
  // Check if a chart already exists on the canvas
  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "scatter",
    data: {
      labels: xValues.map((x) => x.toString()),
      datasets: [
        {
          label: "Predicted Line",
          data: predictedValues.map((value, index) => ({
            x: xValues[index],
            y: value,
          })),
          borderColor: "black",
          backgroundColor: "pink",
          pointStyle: "rectRounded",
          pointRadius: 1, // Set the pointRadius to make the circles smaller
          borderWidth: 1, // Set the borderWidth to make the line thinner
        },
        {
          label: "CSV Data",
          data: xValues.map((value, index) => ({ x: value, y: index })),
          borderColor: "black",
          backgroundColor: "lightblue",
          pointStyle: "rectRounded",
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: xLabel, // Use the label for the x-axis (first column name)
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: yLabel, // Use the label for the y-axis (second column name)
          },
        },
      },
      title: {
        display: true,
        text: regressionEquation,
      },
    },
  });
}

function callLinearRegression() {
  document
    .getElementById("linearRegressionButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("linearModal");
      modal.style.display = "block";
    });

  document
    .getElementById("processLinearRegressionButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("linearRegressionColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      if (
        selectedColumns.length > 2 ||
        selectedColumns.length === 1 ||
        selectedColumns.length < 1
      ) {
        var resultDiv = document.getElementById("linearRegressionResult");
        resultDiv.innerHTML =
          "Error: Linear Regression requires two columns only.";
        return;
      }

      var linearRegressionResult = computeLinearRegression(
        selectedColumns[0],
        selectedColumns[1]
      );

      var resultDiv = document.getElementById("linearRegressionResult");
      resultDiv.innerHTML = linearRegressionResult;


      logUserAction(sampleUserID, currentCSV, "Linear Regression", selectedColumns, linearRegressionResult);
    });

  document
    .getElementById("closeLinearRegressionButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("linearModal");
      modal.style.display = "none";
    });
  selectedColumns = [];
}
