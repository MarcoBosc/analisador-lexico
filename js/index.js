const wordInput = document.getElementById('wordInput');
const wordList = document.getElementById('wordList');
const randomWordBtn = document.getElementById('randomWordBtn');
const validateInput = document.getElementById('validateWord');
const validatedWords = document.getElementById('ValidatedWords');

// Lista de palavras
const words = [];
let mappedWords;

let currentState = "q0";

let invalidCharCount = 0;

let coloredStates = {}

// Adicionar palavra ao pressionar espaço
wordInput.addEventListener('keypress', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    const word = wordInput.value.trim();
    if (word) {
      addWord(word);
      wordInput.value = '';
    }
  }
});

// Função para gerar palavras aleatórias
function generateRandomWord() {
  const length = Math.floor(Math.random() * 8) + 1; // Comprimento entre 1 e 8
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let word = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    word += letters[randomIndex];
  }

  return word;
}

// Gerar palavra aleatória
randomWordBtn.addEventListener('click', () => {
  const randomWord = generateRandomWord();
  addWord(randomWord);
});

// Função para adicionar uma palavra
function addWord(word) {
  const hasNumbers = /\d/;

  if (!words.includes(word) && !hasNumbers.test(word)) {
    words.push(word);
    resizeTable(words);
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word-item';
    wordDiv.textContent = word.toUpperCase();

    // Botão para remover a palavra
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      wordList.removeChild(wordDiv);
      words.splice(words.indexOf(word), 1);
      resizeTable(words); // chama a function de dar resize no automato
    });

    wordDiv.appendChild(removeBtn);
    wordList.appendChild(wordDiv);
  }
}

// mapeia as palavras para adicionar elas e suas respectivas linhas
function mapWords(words) {
  let stateMapping = {};
  let currentState = 1;

  // Inicializa o estado q0
  stateMapping["q0"] = {};

  function addWordToMap(word) {
    let prevState = "q0";

    // Para cada letra da palavra
    for (let i = 0; i < word.length; i++) {
      let currentLetter = word[i].toUpperCase();

      // Verifica se já existe uma transição para a letra atual no estado anterior
      let nextState = Object.keys(stateMapping[prevState]).find(state => stateMapping[prevState][state] === currentLetter);

      // Se não existir, cria um novo estado
      if (!nextState) {
        nextState = `q${currentState}`;
        stateMapping[prevState][nextState] = currentLetter;
        stateMapping[nextState] = {};
        currentState++;
      }

      prevState = nextState;
    }
  }

  // Mapeando todas as palavras da lista words
  words.forEach(word => addWordToMap(word));
  console.log(stateMapping);
  return stateMapping;
}


function resizeTable(words) {
  mappedWords = mapWords(words);

  // Identificando todos os índices qN usados, incluindo vazios
  let allIndexes = new Set();
  Object.keys(mappedWords).forEach(key => {
    allIndexes.add(key);  // Adiciona o índice atual
    Object.keys(mappedWords[key]).forEach(nextIndex => {
      allIndexes.add(nextIndex);  // Adiciona o próximo índice mapeado
    });
  });

  // Ordenar os índices de forma crescente
  allIndexes = Array.from(allIndexes).sort((a, b) => {
    let numA = parseInt(a.slice(1));  // Extrai o número do índice qN
    let numB = parseInt(b.slice(1));
    return numA - numB;
  });

  // Acesse o tbody da tabela
  let tbody = document.querySelector('tbody');

  // Limpa as linhas existentes (além da primeira)
  while (tbody.children.length > 1) {
    tbody.removeChild(tbody.lastChild);
  }

  // Para cada "q0", "q1", "q2" ... até o maior índice necessário
  allIndexes.forEach(index => {
    let tr = document.createElement('tr');

    // Cria a célula de label (q0, q1, q2...)
    let tdLabel = document.createElement('td');
    tdLabel.textContent = index;
    tr.appendChild(tdLabel);

    // Agora, para cada letra de A até Z, vamos criar a lógica de mapeamento
    let seenLetters = new Set(); // Usado para garantir que não mapeemos a mesma letra várias vezes

    for (let j = 0; j < 26; j++) {
      let td = document.createElement('td');
      let letter = String.fromCharCode(65 + j);  // Letras A até Z (ASCII 65 é 'A')

      // Verifica se a letra está presente no mapeamento
      if (mappedWords[index]) {
        Object.entries(mappedWords[index]).forEach(([nextIndex, letterValue]) => {
          if (letterValue === letter && !seenLetters.has(letter)) {
            // Adiciona a letra à lista de letras vistas
            seenLetters.add(letter);
            td.textContent = nextIndex;  // Mapeia para o próximo índice disponível
          }
        });
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}

function paintCells() {
  if (!coloredStates || typeof coloredStates !== 'object') {
    console.error('coloredStates não é válido:', coloredStates);
    return;
  }

  const rows = document.querySelectorAll('tbody tr'); // Seleciona todas as linhas da tabela

  // Itera sobre cada estado em coloredStates
  for (const [state, transitions] of Object.entries(coloredStates)) {
    const currentRow = Array.from(rows).find(row => row.firstChild.textContent === state);

    if (currentRow) {
      const cells = currentRow.querySelectorAll('td');

      // Se há transições, pinta as células correspondentes
      if (transitions.length > 0) {
        transitions.forEach(transition => {
          const index = parseInt(transition.character, 36) - 9; // Mapeia 'a', 'b'... para índices numéricos
          if (index >= 0 && index < cells.length) {
            const validCell = cells[index];
            validCell.style.backgroundColor = transition.color === 'green' ? 'green' : 'red'; // Verde ou vermelho
            validCell.style.color = '#FFF'; // Texto branco
          }
        });
      } else {
        // Se não há transições, restaura a cor padrão da linha
        cells.forEach(cell => {
          cell.style.backgroundColor = ''; // Fundo padrão
          cell.style.color = ''; // Texto padrão
        });
      }
    }
  }
}





function updateColoredStates(currentState, char, color) {
  if (!coloredStates[currentState]) {
    coloredStates[currentState] = [];
  }

  if (invalidCharCount === 0) {
    coloredStates[currentState].push({
      character: char,
      color: color
    });
    paintCells();
  }
  console.log(coloredStates);
}

function isValid(char) {
  const regex = /^[A-Za-z ]$/;
  const hasNumbers = /\d/;
  return regex.test(char) && !hasNumbers.test(char);
}

function isValidWord(char) {
  const regex = /^[A-Za-z]+$/;
  const hasNumbers = /\d/;
  return regex.test(char) && !hasNumbers.test(char);
}

function validateChar(char) {

  const stateMapping = mappedWords[currentState];

  if (!stateMapping) {
    console.log(`Estado inválido: ${currentState}`);
    return false;
  }

  const nextState = Object.keys(stateMapping).find(
    state => stateMapping[state] === char.toUpperCase()
  );

  if (nextState && invalidCharCount === 0) {
    updateColoredStates(currentState, char, "green");
    currentState = nextState;
    console.log(`Estado atual: ${currentState}`);
    console.log('char ' + char + ' é valido')
    return true;
  } else {
    updateColoredStates(currentState, char, "red");
    console.log(coloredStates);
    console.log(`Caractere inválido para o estado ${currentState} ` + char.toUpperCase());
    invalidChar = true;
    invalidCharCount ++;
    console.log(invalidChar)
    return false;
  }
}

function printWord(word, color) {
  const span = document.createElement('span');
  span.textContent = word;
  span.style.fontWeight = 'bold';
  span.style.color = color;
  validatedWords.appendChild(span);
}

function checkWordInAlphabet() {
  console.log(mappedWords[currentState])

  if (Object.keys(mappedWords[currentState]).length === 0 && invalidCharCount === 0 ) {
    printWord(validateInput.value, 'green');
    return true
  }
  printWord(validateInput.value, 'red');
  return false
}

function getPreviousState() {
  for (let prevState in mappedWords) {
      // Verifica se algum dos valores de 'prevState' é igual ao currentState
      if (mappedWords[prevState][currentState]) {
         console.log('Estado atual: ' + currentState + "estado anterior: "+ prevState)
          return prevState; // Retorna o último estado antes de 'currentState'
      }
  }
  return null; // Retorna null se não encontrar o estado anterior
}

// Palavras digitadas para validação
validateInput.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    coloredStates = {};
    resizeTable(words);
    const word = validateInput.value.trim();
    if (isValidWord(word)) {
      checkWordInAlphabet() == true ? alert(`A palavra ${validateInput.value} está presente no alfabeto :D`) : alert(`A palavra ${validateInput.value} não está presente no alfabeto ;(`);
    } else {
      alert("Essa palavra contém caracteres inválidos.");
    }
    validateInput.value = '';
    currentState = 'q0';
    invalidCharCount = 0;
  } else if (e.key === 'Backspace') {
    console.log('backspace')
    invalidCharCount <= 0 ? invalidCharCount = 0 : invalidCharCount--;
    console.log(coloredStates);
    console.log(currentState + "Estado atual apagado");
    if (invalidCharCount === 0 && Array.isArray(coloredStates[currentState]) && coloredStates[currentState].length > 0) {
      coloredStates[currentState].pop();
    } else {
      coloredStates[getPreviousState()].pop();
      if (invalidCharCount === 0) currentState = getPreviousState(); // volta o estado anterior
    }
    paintCells();
    console.log(invalidCharCount);
    console.log(coloredStates);
    console.log(currentState)
  } else {
    if (isValid(e.key) && validateChar(e.key)) {
      console.log(currentState)
    }
  }

});
