
function computeTimeSeries(selectedColumns) {
    if (selectedColumns.length !== 2) {
      return "Error: Time Series requires exactly two columns.";
    }
  
    var timestamps = currentCSV.map((row) => row[selectedColumns[0]]);
    var dataPoints = currentCSV.map((row) => parseFloat(row[selectedColumns[1]]));
  
    console.log("Timestamps (xValues):", timestamps);
    console.log("Data Points (yValues):", dataPoints);
  
    // Convert date strings to JavaScript Date objects
    var dates = timestamps.map((timestamp) => new Date(timestamp));
  
    // Calculate mean and standard deviation
    var mean = calculateMean(dataPoints);
    var stdDev = calculateStandardDeviation(dataPoints);
  
    console.log("Mean:", mean);
    console.log("Standard Deviation:", stdDev);
  
    // Perform linear regression to predict future values
    var linearRegressionResult = performLinearRegression(dates, dataPoints);
  
    // Predict future values
    var futurePredictions = predictFutureValues(
      linearRegressionResult.beta0,
      linearRegressionResult.beta1,
      dates[dates.length - 1],
      60 // Number of future months to predict
    );
  
    // Extend timestamps array with future dates (converted to strings)
    var futureDates = futurePredictions.map((prediction) => prediction.date.toLocaleDateString());
    var allTimestamps = timestamps.concat(futureDates);
  
    // Concatenate actual values and predicted values
    var allDataPoints = dataPoints.concat(futurePredictions.map((prediction) => prediction.value));
  
    // Chart both actual and predicted values
    plotTimeSeriesChart(allTimestamps.slice(timestamps.length), allDataPoints);
  
    // Calculate MAPE
    var mape = calculateMAPE(dataPoints, allDataPoints.slice(0, dataPoints.length));
    var formattedMAPE = mape.toFixed(2);
  
    console.log(mape);
    // Return the result as a text
    return `Mean: `+ mean.toFixed(2) + " SD: " + stdDev.toFixed(2);
  }
function calculateMean(values) {
  var sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function calculateStandardDeviation(values) {
  var mean = calculateMean(values);
  var squaredDifferencesSum = values.reduce(
    (acc, value) => acc + Math.pow(value - mean, 2),
    0
  );
  return Math.sqrt(squaredDifferencesSum / values.length);
}

function performLinearRegression(xValues, yValues) {
    var xNumericValues = xValues.map((date) => date.getTime()); // Convert Date objects to numeric values
    var xMean = calculateMean(xNumericValues);
    var yMean = calculateMean(yValues);
  
    var numerator = 0;
    var denominator = 0;
    for (var i = 0; i < xNumericValues.length; i++) {
      numerator += (xNumericValues[i] - xMean) * (yValues[i] - yMean);
      denominator += Math.pow(xNumericValues[i] - xMean, 2);
    }
  
    var beta1 = numerator / denominator;
    var beta0 = yMean - beta1 * xMean;
  
    var predictedValues = calculatePredictedValues(xNumericValues, beta0, beta1);
    console.log(predictedValues);
    return {
      beta0: beta0,
      beta1: beta1,
      predictedValues: predictedValues,
    };
  }
function calculatePredictedValues(xValues, beta0, beta1) {
  var predictedValues = [];
  for (var i = 0; i < xValues.length; i++) {
    var predictedValue = beta0 + beta1 * xValues[i];
    predictedValues.push(predictedValue);
  }
  return predictedValues;
}

function calculateMAPE(actualValues, predictedValues) {
  var absolutePercentageErrors = [];
  for (var i = 0; i < actualValues.length; i++) {
    var absolutePercentageError = Math.abs(
      (actualValues[i] - predictedValues[i]) / actualValues[i]
    );
    absolutePercentageErrors.push(absolutePercentageError);
  }

  var sumAPE = absolutePercentageErrors.reduce((acc, value) => acc + value, 0);
  var mape = (sumAPE / actualValues.length) * 100;

  console.log(sumAPE,mape)
  return mape;
  
}

function predictFutureValues(beta0, beta1, lastDate, numMonths) {
    var futurePredictions = [];
    for (var i = 1; i <= numMonths; i++) {
      var futureDate = new Date(lastDate);
      futureDate.setMonth(lastDate.getMonth() + i);
      var predictedValue = beta0 + beta1 * futureDate.getTime();
      futurePredictions.push({ date: futureDate, value: predictedValue });
    }
    return futurePredictions;
  }

  function plotTimeSeriesChart(timestamps, predictedValues) {
    var ctx = document.getElementById("timeSeriesResultChart");
    ctx.width = 500;
    ctx.height = 450;
    // Check if a chart already exists on the canvas
    var existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    new Chart(ctx, {
      type: "line",
      data: {
        labels: timestamps,
        datasets: [
          {
            label: "Predicted Values",
            data: predictedValues,
            borderColor: "red",
            backgroundColor: "transparent",
            pointRadius: 1, // Set the pointRadius to make the circles smaller
            borderWidth: 1, // Set the borderWidth to make the line thinner
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "timeseries",
              time: {
                unit: "month",
                displayFormats: {
                  month: "MMM D, YYYY", // Change the date display format as needed
                },
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
  

function callTimeSeries() {
  document
    .getElementById("timeSeriesButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("timeSeriesModal");
      modal.style.display = "block";
    });

  document
    .getElementById("processTimeSeriesButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("timeSeriesColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      if (selectedColumns.length !== 2) {
        var resultDiv = document.getElementById("timeSeriesResult");
        resultDiv.innerHTML =
          "Error: Time Series requires exactly two columns.";
        return;
      }

      console.log(selectedColumns[0], selectedColumns[1]);

      var timeSeriesResult = computeTimeSeries(selectedColumns);

      console.log("Time Series Result:", timeSeriesResult);

      var resultDiv = document.getElementById("timeSeriesResult");
      resultDiv.innerHTML = timeSeriesResult;

      logUserAction(sampleUserID, csvName, "Time Series", selectedColumns, timeSeriesResult);

    });

  document
    .getElementById("closeTimeSeriesButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("timeSeriesModal");
      modal.style.display = "none";
    });

  selectedColumns = [];
}

function initializePredictionModal() {
  createColumnCheckboxes(
    columnNamesArray,
    "linarRegressionForm",
    "linearRegressionColumn"
  );
  createColumnCheckboxes(
    columnNamesArray,
    "randomForestForm",
    "randomForestColumn"
);

  createColumnCheckboxes(columnNamesArray, "knnForm", "knnColumn");
  createColumnCheckboxes(
    columnNamesArray,
    "timeSeriesForm",
    "timeSeriesColumn"
  );
  

  callLinearRegression();
  callRandomForest();

  callKNN();
  callTimeSeries();
}


