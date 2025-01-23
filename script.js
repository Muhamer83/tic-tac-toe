let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle'; // Start mit "circle"
let gameOver = false; // Status des Spiels

/**
 * Initialisiert das Spielfeld.
 */
function init() {
  fields.fill(null); // Leere das Spielfeld
  currentPlayer = 'circle'; // Setze Spieler zurück
  gameOver = false; // Spielstatus zurücksetzen
  render();
}

/**
 * Rendert das Tic Tac Toe Spielfeld basierend auf dem Array "fields".
 */
function render() {
  const contentDiv = document.getElementById('content');
  let tableHtml = '<table>';
  for (let i = 0; i < 3; i++) {
    tableHtml += '<tr>';
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = '';
      if (fields[index] === 'circle') {
        symbol = generateCircleSVG();
      } else if (fields[index] === 'cross') {
        symbol = generateCrossSVG();
      }
      tableHtml += `<td onclick="handleCellClick(${index}, this)" style="position: relative;">${symbol}</td>`;
    }
    tableHtml += '</tr>';
  }
  tableHtml += '</table>';
  contentDiv.innerHTML = tableHtml;
}

/**
 * Handhabt den Klick auf ein Feld.
 * @param {number} index - Der Index des angeklickten Feldes im Array "fields".
 * @param {HTMLElement} cell - Das angeklickte <td>-Element.
 */
function handleCellClick(index, cell) {
  if (!fields[index] && !gameOver) {
    fields[index] = currentPlayer;
    cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
    cell.removeAttribute('onclick');

    if (checkWin()) {
      gameOver = true;
      drawWinningLine();
      setTimeout(() => alert(`${currentPlayer === 'circle' ? 'Spieler 1' : 'Spieler 2'} hat gewonnen!`), 1000);
      return;
    }

    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
  }
}

/**
 * Überprüft, ob ein Spieler gewonnen hat.
 * @returns {boolean} True, wenn ein Spieler gewonnen hat.
 */
function checkWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
    [0, 4, 8], [2, 4, 6] // Diagonalen
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combination; // Gibt die Gewinnkombination zurück
    }
  }
  return null;
}

/**
 * Zeichnet eine Linie über die Gewinnkombination.
 */
function drawWinningLine() {
  const winningCombination = checkWin();
  if (!winningCombination) return;

  const contentDiv = document.getElementById('content');
  const table = contentDiv.querySelector('table');
  const cells = table.getElementsByTagName('td');
  const tableRect = table.getBoundingClientRect();

  const [startIndex, , endIndex] = winningCombination;
  const startCell = cells[startIndex].getBoundingClientRect();
  const endCell = cells[endIndex].getBoundingClientRect();

  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.backgroundColor = 'red';
  line.style.height = '5px';
  line.style.width = `${Math.sqrt((endCell.x - startCell.x) ** 2 + (endCell.y - startCell.y) ** 2)}px`;
  line.style.transformOrigin = '0 0';
  line.style.transform = `rotate(${Math.atan2(endCell.y - startCell.y, endCell.x - startCell.x)}rad)`;
  line.style.top = `${startCell.y + startCell.height / 2 - tableRect.top}px`;
  line.style.left = `${startCell.x + startCell.width / 2 - tableRect.left}px`;

  table.appendChild(line);
}

/**
 * Generiert den SVG HTML-Code für einen animierten Kreis.
 */
function generateCircleSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50" cy="50" r="45"
        stroke="#00B0EF" stroke-width="10" fill="none"
        stroke-dasharray="283" stroke-dashoffset="283">
        <animate attributeName="stroke-dashoffset" from="283" to="0" dur="0.5s" fill="freeze" />
      </circle>
    </svg>
  `;
}

/**
 * Generiert den SVG HTML-Code für ein animiertes Kreuz.
 */
function generateCrossSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="20" x2="80" y2="80"
        stroke="#FFC000" stroke-width="10"
        stroke-dasharray="85" stroke-dashoffset="85">
        <animate attributeName="stroke-dashoffset" from="85" to="0" dur="0.5s" fill="freeze" />
      </line>
      <line x1="80" y1="20" x2="20" y2="80"
        stroke="#FFC000" stroke-width="10"
        stroke-dasharray="85" stroke-dashoffset="85">
        <animate attributeName="stroke-dashoffset" from="85" to="0" dur="0.5s" fill="freeze" />
      </line>
    </svg>
  `;
}