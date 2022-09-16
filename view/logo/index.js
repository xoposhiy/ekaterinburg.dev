const logo = document.querySelector('[data-id="logo"]');
const mondrian = document.querySelector('[data-id="mondrian"]');
const mondrianButton = document.querySelector('[data-id="mondrian-button"]');

renderMondrian();

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

logo.addEventListener('touchstart', (event) => {
  touchstartX = event.screenX;
  touchstartY = event.screenY;
}, false);

logo.addEventListener('touchend', (event) =>  {
  touchendX = event.screenX;
  touchendY = event.screenY;
  renderMondrian();
}, false); 

mondrianButton.addEventListener("click", () => {
  renderMondrian();
});

mondrianButton.addEventListener("mouseover", () => {
  renderMondrian();
});


function renderMondrian() {
  while (mondrian.firstChild) {
    mondrian.firstChild.remove();
  }

  for (let cell of generateMondrianItems()) {
    mondrian.appendChild(cell);
  }
}


function generateMondrianItems() {
  let colors = ["black", "green", "blue", "yellow", "black", "black", "blue"];
  let cells = [];

  let random = (min, max) => Math.floor(Math.random() * (max - min) + min);
  
  for (let i = 0; i < 100; i++) {
    let span = random(1, 5);
    let row = random(1, 12);
    let colorIndex = random(1, colors.length);
    const cell = document.createElement("div");
    cell.style.gridColumn = `span ${span}`;
    cell.style.gridRow = `span ${row}`;
    cell.classList.add("logo__mondrian-item");
    cell.classList.add(`logo__mondrian-item_${colors[colorIndex]}`);
    cells.push(cell);
  }
  return cells;
}