var slideshowButton = document.getElementById("prevButton");
var slideshowButton = document.getElementById("nextButton");

function showSlideshowHeader() {
  var slideshowHeader = document.querySelector(".slideshow-header");
  slideshowHeader.style.visibility = "visible";
  slideshowButton.classList.toggle("clicked");
}
function showSlideshowControls() {
  var controls = document.querySelector(".slideshow-controls");
  controls.style.visibility = "visible";
}

function showButtonContainer2() {
  var buttonContainer2 = document.querySelector(".button-container-2");
  var buttonContainer2Header = document.querySelector(
    ".button-container-2-header"
  );
  buttonContainer2.style.display = "flex";
  buttonContainer2Header.style.display = "flex";
}

var csvButton = document.getElementById("csvButton");
var prevButton = document.getElementById("prevButton");
var nextButton = document.getElementById("nextButton");

csvButton.addEventListener("click", function () {
  csvButton.classList.toggle("clicked"); 
});

var prevButton = document.getElementById("prevButton");
var nextButton = document.getElementById("nextButton");

nextButton.addEventListener("click", function () {
  nextButton.classList.toggle("clicked"); 
  prevButton.classList.remove("clicked"); 
});

prevButton.addEventListener("click", function () {
  prevButton.classList.toggle("clicked"); 
  nextButton.classList.remove("clicked"); 
});

function calculate(columnNames) {
  console.log("here")
  populateColumnSelect(columnNames);

  document.getElementById("columnSelect").addEventListener("change", function () {
    var columnName = this.value;

    calculateMode(columnName);
    calculateRange(columnName);
    calculateVariance(columnName);
  });
}