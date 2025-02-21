const container = document.querySelector(".container");

for (let i = 0; i < 16; i++) {
  const row = document.createElement("div");
  container.appendChild(row);
  row.classList.add("row");
  for (let j = 0; j < 16; j++) {
    const col = document.createElement("div");
    col.textContent = "c";
    col.classList.add("col");
    row.appendChild(col);
  }
}
