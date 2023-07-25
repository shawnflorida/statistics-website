
function computeANOVA() {
  console.log("Column Data Arrays:", currentCSV);

  var columnDataArrays = columnNamesArray.map(function (columnName) {
    return currentCSV.map(function (data) {
      return parseFloat(data[columnName]);
    });
  });

  var numDataPoints = columnDataArrays[0].length;
  for (var i = 1; i < columnDataArrays.length; i++) {
    if (columnDataArrays[i].length !== numDataPoints) {
      return "Error: The number of data points in each column must be the same for ANOVA.";
    }
  }

  var overallMean =
    columnDataArrays.flat().reduce(function (sum, value) {
      return sum + value;
    }, 0) /
    (columnDataArrays.length * numDataPoints);

  var ssBetweenGroups = columnDataArrays.reduce(function (sum, columnData) {
    var mean =
      columnData.reduce(function (acc, value) {
        return acc + value;
      }, 0) / numDataPoints;
    return sum + numDataPoints * Math.pow(mean - overallMean, 2);
  }, 0);

  var ssWithinGroups = columnDataArrays.reduce(function (sum, columnData) {
    return (
      sum +
      columnData.reduce(function (acc, value) {
        return (
          acc +
          Math.pow(
            value -
              columnData.reduce(function (acc, value) {
                return acc + value;
              }, 0) /
                numDataPoints,
            2
          )
        );
      }, 0)
    );
  }, 0);

  var dfBetweenGroups = columnDataArrays.length - 1;
  var dfWithinGroups =
    numDataPoints * columnDataArrays.length - columnDataArrays.length;
  var msBetweenGroups = ssBetweenGroups / dfBetweenGroups;
  var msWithinGroups = ssWithinGroups / dfWithinGroups;

  var fStatistic = msBetweenGroups / msWithinGroups;

  var pValue = computePValueANOVA(fStatistic, dfBetweenGroups, dfWithinGroups);

  return (
    "F-Statistic: " + fStatistic.toFixed(2) + ", P-Value: " + pValue.toFixed(2)
  );
}
function computePValueANOVA(fStatistic, dfBetweenGroups, dfWithinGroups) {
  var pValue = 0.05;
  return pValue;
}


function computeTTest(sample1, sample2) {
  var sample1 = currentCSV.map((row) => parseFloat(row[sample1]));
  var sample2 = currentCSV.map((row) => parseFloat(row[sample2]));

  var mean1 = sample1.reduce((acc, value) => acc + value, 0) / sample1.length;
  var mean2 = sample2.reduce((acc, value) => acc + value, 0) / sample2.length;

  var variance1 =
    sample1.reduce((acc, value) => acc + Math.pow(value - mean1, 2), 0) /
    (sample1.length - 1);
  var variance2 =
    sample2.reduce((acc, value) => acc + Math.pow(value - mean2, 2), 0) /
    (sample2.length - 1);

  var standardError1 = Math.sqrt(variance1) / Math.sqrt(sample1.length);
  var standardError2 = Math.sqrt(variance2) / Math.sqrt(sample2.length);

  var tStatistic =
    (mean1 - mean2) /
    Math.sqrt(Math.pow(standardError1, 2) + Math.pow(standardError2, 2));

  var df = sample1.length + sample2.length - 2;

  var pValue = computePValueTtest(tStatistic, df);

  return (
    "T-Statistic: " + tStatistic.toFixed(2) + ", P-Value: " + pValue.toFixed(5)
  );
}

function computePValueTtest(tStatistic, df) {
  var pValue = 0.05;
  return pValue;
}

function computePearson(sample1, sample2) {
  var sample1Values = currentCSV.map((row) => parseFloat(row[sample1]));
  var sample2Values = currentCSV.map((row) => parseFloat(row[sample2]));

  var mean1 =
    sample1Values.reduce((acc, value) => acc + value, 0) / sample1Values.length;
  var mean2 =
    sample2Values.reduce((acc, value) => acc + value, 0) / sample2Values.length;

  var covariance =
    sample1Values.reduce(
      (acc, value, index) =>
        acc + (value - mean1) * (sample2Values[index] - mean2),
      0
    ) /
    (sample1Values.length - 1);

  var stdDev1 = Math.sqrt(
    sample1Values.reduce((acc, value) => acc + Math.pow(value - mean1, 2), 0) /
      (sample1Values.length - 1)
  );
  var stdDev2 = Math.sqrt(
    sample2Values.reduce((acc, value) => acc + Math.pow(value - mean2, 2), 0) /
      (sample2Values.length - 1)
  );

  var pearsonCoefficient = covariance / (stdDev1 * stdDev2);

  return "Pearson Correlation Coefficient: " + pearsonCoefficient.toFixed(5);
}
function computeSpearmanRho(sample1, sample2) {
  var sample1Values = currentCSV.map((row) => parseFloat(row[sample1]));
  var sample2Values = currentCSV.map((row) => parseFloat(row[sample2]));

  var sample1Ranks = rankData(sample1Values);
  var sample2Ranks = rankData(sample2Values);

  var rankDifferences = sample1Ranks.map(
    (rank1, index) => rank1 - sample2Ranks[index]
  );

  var sumSquaredRankDiff = rankDifferences.reduce(
    (acc, diff) => acc + Math.pow(diff, 2),
    0
  );

  var n = sample1Ranks.length;

  var numerator = 6 * sumSquaredRankDiff;
  var denominator = n * (Math.pow(n, 2) - 1);

  var spearmanRho = 1 - numerator / denominator;

  return (
    "Spearman Rank Correlation Coefficient (rho): " + spearmanRho.toFixed(5)
  );
}

function rankData(data) {
  var sortedData = data.slice().sort((a, b) => a - b);
  var ranks = data.map((value) => {
    var count = sortedData.indexOf(value) + 1;
    var tiedRanksSum = count + sortedData.lastIndexOf(value) + 1;
    var averageRank = tiedRanksSum / 2;
    return averageRank;
  });
  return ranks;
}

function computeChiSquare(columnNames) {
  var columnDataArrays = columnNames.map(function (columnName) {
    return currentCSV.map(function (row) {
      return row[columnName];
    });
  });

  var contingencyTable = {};

  for (var i = 0; i < columnDataArrays[0].length; i++) {
    var rowValues = columnDataArrays.map(function (columnData) {
      return columnData[i];
    });

    var rowKey = rowValues.join("-");

    if (!contingencyTable[rowKey]) {
      contingencyTable[rowKey] = 1;
    } else {
      contingencyTable[rowKey]++;
    }
  }

  var totalRows = columnDataArrays[0].length;
  var totalColumns = columnDataArrays.length;
  var expectedFrequencies = {};

  for (var key in contingencyTable) {
    var observedFrequency = contingencyTable[key];
    var expectedFrequency =
      (observedFrequency * totalRows) / (totalRows * totalColumns);
    expectedFrequencies[key] = expectedFrequency;
  }

  var chiSquare = 0;

  for (var key in contingencyTable) {
    var observedFrequency = contingencyTable[key];
    var expectedFrequency = expectedFrequencies[key];
    chiSquare +=
      Math.pow(observedFrequency - expectedFrequency, 2) / expectedFrequency;
  }

  var degreesOfFreedom =
    (Object.keys(contingencyTable).length - 1) * (totalColumns - 1);

  var pValue = chiSquarePValue(chiSquare, degreesOfFreedom);

  return (
    "Chi-Square: " + chiSquare.toFixed(5) + ", P-Value: " + pValue.toFixed(5)
  );
}

function chiSquarePValue(chiSquare, degreesOfFreedom) {

  var lookupTable = {
    1: 0.995,
    2: 0.975,
    3: 0.95,
    4: 0.9,
    5: 0.75,
    6: 0.6,
    7: 0.5,
    8: 0.4,
    9: 0.3,
    10: 0.2,
  };

  if (degreesOfFreedom <= 10) {
    return lookupTable[degreesOfFreedom];
  } else {
    return 0.05;
  }
}

function callANOVA() {
  document.getElementById("anovaButton").addEventListener("click", function () {
    var modal = document.getElementById("anovaModal");
    modal.style.display = "block";
  });

  document
    .getElementById("processANOVAButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("anovaColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      console.log(selectedColumns.length);

      if (selectedColumns.length < 3) {
        var resultDiv = document.getElementById("anovaResult");
        resultDiv.innerHTML =
          "Error: ANOVA requires at least 3 columns to be selected.";
        return;
      }

      var anovaResult = computeANOVA(selectedColumns);

      var resultDiv = document.getElementById("anovaResult");
      resultDiv.innerHTML = anovaResult;
      logUserAction(sampleUserID, csvName, "ANOVA", selectedColumns, anovaResult);

    });

  document
    .getElementById("closeANOVAButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("anovaModal");
      modal.style.display = "none";
    });
  selectedColumns = [];
}

function callTtest() {
  document.getElementById("tTestButton").addEventListener("click", function () {
    var modal = document.getElementById("tTestModal");
    modal.style.display = "block";

  });

  document
    .getElementById("processTTestButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("tTestColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      console.log(selectedColumns.length);

      if (
        selectedColumns.length > 2 ||
        selectedColumns.length === 1 ||
        selectedColumns.length < 1
      ) {
        var resultDiv = document.getElementById("tTestResult");
        resultDiv.innerHTML = "Error: T-Test requires two columns only.";
        return;
      }
      console.log(selectedColumns[0], selectedColumns[1]);

      var tTestResult = computeTTest(selectedColumns[0], selectedColumns[1]);

      var resultDiv = document.getElementById("tTestResult");
      resultDiv.innerHTML = tTestResult;
      logUserAction(sampleUserID, csvName, "T-Test", selectedColumns, tTestResult);

    });

  document
    .getElementById("closeTTestButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("tTestModal");
      modal.style.display = "none";
    });
}

function callPearson() {
  document
    .getElementById("pearsonButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("pearsonModal");
      modal.style.display = "block";

    });

  document
    .getElementById("processPearsonButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("pearsonColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      console.log(selectedColumns.length);

      if (
        selectedColumns.length > 2 ||
        selectedColumns.length === 1 ||
        selectedColumns.length < 1
      ) {
        var resultDiv = document.getElementById("pearsonResult");
        resultDiv.innerHTML = "Error: Pearson requires two columns only.";
        return;
      }
      console.log(selectedColumns[0], selectedColumns[1]);

      var pearsonResult = computePearson(
        selectedColumns[0],
        selectedColumns[1]
      );

      var resultDiv = document.getElementById("pearsonResult");
      resultDiv.innerHTML = pearsonResult;

      logUserAction(sampleUserID, csvName, "Pearson Correlation", selectedColumns, pearsonResult);

    });

  document
    .getElementById("closePearsonButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("pearsonModal");
      modal.style.display = "none";
    });
}

function callSpearman() {
  document
    .getElementById("spearmanButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("spearmanModal");
      modal.style.display = "block";
    });

  document
    .getElementById("processSpearmanButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("spearmanColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      console.log(selectedColumns.length);

      if (
        selectedColumns.length > 2 ||
        selectedColumns.length === 1 ||
        selectedColumns.length < 1
      ) {
        var resultDiv = document.getElementById("spearmanResult");
        resultDiv.innerHTML = "Error: Spearman requires two columns only.";
        return;
      }
      console.log(selectedColumns[0], selectedColumns[1]);

      var spearmanResult = computeSpearmanRho(
        selectedColumns[0],
        selectedColumns[1]
      );

      var resultDiv = document.getElementById("spearmanResult");
      resultDiv.innerHTML = spearmanResult;


      logUserAction(sampleUserID, csvName, "Spearman Rho", selectedColumns, spearmanResult);

    });

  document
    .getElementById("closeSpearmanButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("spearmanModal");
      modal.style.display = "none";
    });
}

function callChi() {
  document
    .getElementById("chiSquareButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("chiModal");
      modal.style.display = "block";
    });

  document
    .getElementById("processChiButton")
    .addEventListener("click", function () {
      var selectedColumns = [];
      var checkboxes = document.getElementsByName("chiColumn");
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedColumns.push(checkboxes[i].value);
        }
      }

      console.log(selectedColumns.length);

      var chiResult = computeChiSquare(selectedColumns);

      var resultDiv = document.getElementById("chiResult");
      resultDiv.innerHTML = chiResult;
      logUserAction(sampleUserID, csvName, "Chi Square", selectedColumns, chiResult);

    });

  document
    .getElementById("closeChiButton")
    .addEventListener("click", function () {
      var modal = document.getElementById("chiModal");
      modal.style.display = "none";
    });
}

function initializeStatisticsModal() {
  createColumnCheckboxes(columnNamesArray, "chiForm", "chiColumn");
  createColumnCheckboxes(columnNamesArray, "spearmanForm", "spearmanColumn");
  createColumnCheckboxes(columnNamesArray, "pearsonForm", "pearsonColumn");
  createColumnCheckboxes(columnNamesArray, "tTestForm", "tTestColumn");
  createColumnCheckboxes(columnNamesArray, "anovaForm", "anovaColumn");

  callANOVA();
  callTtest();
  callPearson();
  callSpearman();
  callChi();
}
