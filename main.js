const container = document.querySelector(".container");
const feedback = document.querySelector("#feedback");
feedback.style.visibility = "hidden";
let grid = document.querySelector(".grid");

let isDrawing = false;
// Track mouse state globally
document.addEventListener("mousedown", () => isDrawing = true);
document.addEventListener("mouseup", () => isDrawing = false);

const img = new Image();
img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAACi0lEQVRIibWXX0hTURzHP1' +
  'cGgqyHzDCwSUhCw9AFLpAcA8U2H+whoRfXemlGL/YiVBRDIuglough8r5VLwUGFpFDDMaSPSg4JVlRSLgEJVovIQTBenDn7v7/o/' +
  'V92fmd8z2/z/2de87hTsK9Kg7jkpskbkxOIE/5nAxeYK5y2g3uBuaY12pgLzDb3J6B5dykJm6MjHqC1u0FZtVnJzPgv5Th4fUlm1' +
  'bnpgqbpZUsAzNg25FuTbz41Ji4+3ztgda+LroGWla3vzdF4so6APlXw8w/OquMn7r8kp4zUwA8e9DKz/eyvloN0PM7vB/fBKDe36' +
  'SJ3conGqM9JwCYzC8ZTKeDEaXdK6eVdr2/id6RNA9TI1UfPJeTtkDNkgqoGux124NhA5kuaUVABEjA5+feeILp/IaD71MHC5//MH' +
  '7xGp+AgegByC8xNDHN6+p4a+AwAPWNAWXO73IJgPXSNwCGJqYtYaKzImBChZVZtpYLNHeFuHfjKsWPK24LJHisU+83HAvl3aWeLA' +
  'AQbvdxO32H5q4QAKu5DJmZd46wWLyPjkgMgK3lArPZH2SzdzVQzbGQk2HkZBiAm7euK/0dkRixeJ9rmFBirJ9odBxUZ7wOIBhoIB' +
  'ho0OeQUsODjlU5KTHWr01a/dXfMkq/PPXWkGQ1l1Ha+qpSw4OIOaHOAaU/3O7TJLaS6XW3VjyntNuCL0wnik0oXhHsHDtHYEv8Eg' +
  'cPtTjYavq+ucHGzGOgdpbVQMe71AtM55fEJaLeIz7zadb6spjl14c5JfYf7+dod9TKLk3mlyrka7FnYBUmqeLKyX1ljaegg6oDR+' +
  'CF7YwmLhgtO1XYQDwBi6VtJ4stQK///RFl0G7+W7iuxkx/AYbbx/11abQdAAAAAElFTkSuQmCC';
let colorArray = [];
img.onload = function() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  width = img.width;
  height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const pixels = imageData.data; // Flat array of RGBA values

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];  // alpha will not be used

    colorArray.push(`rgba(${r},${g},${b},${a / 255})`); // Store colors as objects
  }

  createGrid(img.width, img.height, colorArray);
};


function createGrid(gridWidth, gridHeight, initialColor = false) {
  for (let i = 0; i < gridHeight; i++) {
    const row = document.createElement("div");
    grid.appendChild(row);
    row.classList.add("row");
    for (let j = 0; j < gridWidth; j++) {
      const pixel = document.createElement("div");
      pixel.classList.add("pixel");
      if (initialColor) {
        pixel.style.backgroundColor = initialColor[gridWidth * (i + 1) + j];
      }
      row.appendChild(pixel);
      setupColoring(pixel, 'rgba(255, 0, 0, 1)');
    }
  }
}

function setupColoring(elem, color) {
  elem.addEventListener("mousemove", function(event) {
    if (isDrawing) {
      event.target.style.backgroundColor = color;
    }
  });
}

function changeSize() {
  const numWidth = Number(inputWidth.value)
  const numHeight = Number(inputHeight.value)
  if (!isNaN(numWidth) && !isNaN(numHeight)) {
    width = numWidth;
    height = numHeight;
    clearGrid();
    createGrid(width, height);
    feedback.textContent = `The grid was updated to ${width}x${height}`;
  }
  else {
    feedback.textContent = "Error: input is not a number.";
  }
  feedback.style.visibility = "visible";
}

function clearGrid() {
  if (grid) {
    // Remove event listeners before removing the grid
    grid.querySelectorAll(".pixel").forEach(pixel => {
      pixel.replaceWith(pixel.cloneNode(true)); // Removes event listeners
    });

    container.removeChild(grid); // Remove old grid

    // Create a new grid
    grid = document.createElement("div");
    grid.classList.add("grid");
    container.appendChild(grid);
  }
}

let width = img.width;
let height = img.height;

const inputWidth = document.querySelector("#width")
inputWidth.value = img.width;
const inputHeight = document.querySelector("#height")
inputHeight.value = img.height;
const inputButton = document.querySelector("#btn-wh")

inputButton.addEventListener("click", () => { changeSize(); });
