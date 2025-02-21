// Track mouse state globally
let isDrawing = false;
document.addEventListener("mousedown", () => isDrawing = true);
document.addEventListener("mouseup", () => isDrawing = false);

function loadInitialImage(container, callback) {
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
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const pixels = imageData.data; // flat array of RGBA values

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      // store colors as RGBA strings
      colorArray.push(`rgba(${r},${g},${b},${a / 255})`);
    }

    createGrid(container, img.width, img.height, colorArray);

    if (callback) {
      callback(img.width, img.height);
    }
  };
}


function createGrid(container, w, h, initialColor = false) {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  for (let i = 0; i < h; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    grid.appendChild(row);
    for (let j = 0; j < w; j++) {
      const pixel = document.createElement("div");
      pixel.classList.add("pixel");
      if (initialColor) {
        pixel.style.backgroundColor = initialColor[w * i + j];
      }
      setupColoring(pixel, 'red');
      row.appendChild(pixel);
    }
  }
  container.appendChild(grid);
}

function setupColoring(elem, color) {
  elem.addEventListener("mousemove", function(event) {
    if (isDrawing) {
      event.target.style.backgroundColor = color;
    }
  });
}

function validSize(x) {
  return Number.isInteger(x) && x > 0 && x <= 100;
}

function changeSize(w, h, container, feedback) {
  if (validSize(w) && validSize(h)) {
    clearGrid(container);
    createGrid(container, w, h);
    feedback.textContent = `The grid was updated to ${w}x${h}`;
  }
  else {
    feedback.textContent = "Error: 0 < width, height <= 100 have to be integers.";
  }
  feedback.style.visibility = "visible";
}

function clearGrid(container) {
  let grid = container.firstElementChild;
  if (grid) {
    // Remove event listeners before removing the grid
    grid.querySelectorAll(".pixel").forEach(pixel => {
      pixel.replaceWith(pixel.cloneNode(true));
    });
    // Remove old grid
    container.removeChild(grid);
    grid = null;  // for garbage collection
  }
  else {
    console.error(`clearGrid: grid = ${grid}.`);
  }
}

function main() {
  // feedback field for changeSize(...)
  const feedback = document.querySelector("#feedback");
  feedback.style.visibility = "hidden";

  const container = document.querySelector("#grid-container");

  loadInitialImage(container, (width, height) => {
    // input fields for width and height
    const domWidth = document.querySelector("#width")
    domWidth.value = width;
    const domHeight = document.querySelector("#height")
    domHeight.value = height;

    // submit button
    const inputButton = document.querySelector("#input-button")
    inputButton.addEventListener("click", () => {
      const w = Number(domWidth.value);
      const h = Number(domHeight.value);
      changeSize(w, h, container, feedback);
    });
  });
}

main()
