function computeRandomForestRegression(selectedColumns, numTrees) {
  // Find the indices of the selected columns in the column names array
  var xValues = currentCSV.map((row) => parseFloat(row[selectedColumns[0]]));
  var yValues = currentCSV.map((row) => parseFloat(row[selectedColumns[1]]));

  // Define a single decision tree using the CART algorithm
  function decisionTree(xData, yData) {
    // Randomly select a subset of features for this tree
    var numFeatures = Math.floor(Math.sqrt(xData.length)); // Choose a subset size, e.g., the square root of the total features
    var selectedFeatures = new Set();
  
    while (selectedFeatures.size < numFeatures) {
      var randomIndex = Math.floor(Math.random() * xData.length + 40);
      selectedFeatures.add(randomIndex);
    }
  
    // Create arrays containing the selected x and y values based on the selected features
    var selectedX = xData.filter((_, index) => selectedFeatures.has(index));
    var selectedY = selectedX.map((x, index) => yData[index]);
  
    // Use the selected x and y values to build the decision tree
    return CART(selectedX, selectedY);
  }
  // CART algorithm to create decision tree
  function CART(xData, yData) {
    // Implement the CART algorithm here to create a decision tree
    // This involves recursively splitting the data and creating decision nodes
    // You can use various metrics (e.g., Gini impurity or mean squared error) to make the splits
    // For simplicity, I'll use the mean of the target values in this example

    var sumX = xData.reduce((acc, val) => acc + val, 0);
    var threshold = sumX / xData.length;

    var leftX = xData.filter((x) => x <= threshold);
    var leftY = yData.slice(0, leftX.length);

    var rightX = xData.filter((x) => x > threshold);
    var rightY = yData.slice(leftX.length);

    var leftNode = linearRegression(leftX, leftY);
    var rightNode = linearRegression(rightX, rightY);

    return { threshold: threshold, leftNode: leftNode, rightNode: rightNode };
  }

  // Function to perform linear regression
  function linearRegression(xData, yData) {
    var sumX = xData.reduce((acc, val) => acc + val, 0);
    var sumY = yData.reduce((acc, val) => acc + val, 0);
    var sumXY = xData.reduce((acc, val, index) => acc + val * yData[index], 0);
    var sumXSquare = xData.reduce((acc, val) => acc + val * val, 0);

    var n = xData.length;
    var slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;

    return { slope: slope, intercept: intercept };
  }

  // Generate multiple decision trees
  var trees = [];
  for (var i = 0; i < numTrees; i++) {
    // Randomly sample data points with replacement to create a bootstrap sample
    var bootstrapIndices = [];
    for (var j = 0; j < xValues.length; j++) {
      var randomIndex = Math.floor(Math.random() * xValues.length);
      bootstrapIndices.push(randomIndex);
    }

    var bootstrapX = bootstrapIndices.map((index) => xValues[index]);
    var bootstrapY = bootstrapIndices.map((index) => yValues[index]);

    // Create a decision tree and store it in the list
    var tree = decisionTree(bootstrapX, bootstrapY);
    trees.push(tree);
  }

  // Generate predicted values using the ensemble of decision trees
  var predictedValues = xValues.map((x) => {
    var predictions = trees.map((tree) => makePrediction(x, tree));
    return predictions.reduce((acc, val) => acc + val, 0) / numTrees;
  });

  randomForestChart(xValues, yValues, predictedValues);
  console.log(predictedValues);
  return "MSE: " + calculateMSE(yValues, predictedValues);
}

function makePrediction(x, tree) {
  if (x <= tree.threshold) {
    return tree.leftNode.slope * x + tree.leftNode.intercept;
  } else {
    return tree.rightNode.slope * x + tree.rightNode.intercept;
  }
}

function calculateMSE(actualValues, predictedValues) {
  if (actualValues.length !== predictedValues.length) {
    throw new Error("Actual and predicted values must have the same length.");
  }

  var sumSquaredErrors = 0;
  for (var i = 0; i < actualValues.length; i++) {
    var error = actualValues[i] - predictedValues[i];
    sumSquaredErrors += Math.pow(error, 2);
  }

  var mse = sumSquaredErrors / actualValues.length;
  return mse;
}


function randomForestChart(xValues, yValues, predictedValues) {
  var ctx = document.getElementById("randomForestResultChart");
  ctx.height = 300;
  ctx.width = 450;

  // Check if a chart already exists on the canvas
  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues.map((x) => x.toString()),
      datasets: [
        {
          label: "Predicted Line",
          data: predictedValues.map((value, index) => ({
            x: xValues[index],
            y: value,
          })),
          borderColor: "red",
          backgroundColor: "transparent",
        },
        {
          label: "CSV Data",
          data: yValues.map((value, index) => ({
            x: xValues[index],
            y: value,
          })),
          borderColor: "black",
          backgroundColor: "transparent",
          pointRadius: 1,
          borderWidth: 1, // Set the borderWidth to make the line thinner

        },
      ],
    },
    options: {
      scales: {
        x: {
          position: "bottom",
          scaleLabel: {
            display: true,
            labelString: "X Values",
          },
        },
        y: {
          type: "linear",
          scaleLabel: {
            display: true,
            labelString: "Y Values",
          },
        },
      },
      title: {
        display: true,
        text: "Random Forest Regression",
      },
    },
  });
}

function callRandomForest() {
  document
    .getElementById("randomForestButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("randomForestModal");
      modal.style.display = "block";
    });

  document
    .getElementById("processRandomForestButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("randomForestColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }
      var treeValue = parseInt(
        document.getElementById("treeValueNumber").value
      );
      console.log(treeValue);
      if (
        selectedColumns.length > 2 ||
        selectedColumns.length === 1 ||
        selectedColumns.length < 1
      ) {
        var resultDiv = document.getElementById("randomForestResult");
        resultDiv.innerHTML = "Error: Random Forest requires two columns only.";
        return;
      }

      var randomForestResult = computeRandomForestRegression(
        selectedColumns,
        treeValue
      );

      var resultDiv = document.getElementById("randomForestResult");
      resultDiv.innerHTML = randomForestResult;
      logUserAction(sampleUserID, csvName, "Random Forest", selectedColumns + ",Tree:" + treeValue, randomForestResult);

    });

  document
    .getElementById("closeRandomForestButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("randomForestModal");
      modal.style.display = "none";
    });
  selectedColumns = [];
}
