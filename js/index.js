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

let invalidChar = false;

let coloredStates = {}

let finalStates = []

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
        stateMapping[nextState] = {}; // Inicializa o novo estado
        currentState++;
      }
  
      prevState = nextState; // Atualiza o estado anterior para o atual
    }
  
    // Marca o estado final com "*"
    if (!stateMapping[prevState].final) {
      stateMapping[prevState].final = "*";
    }
  }
  

  // Mapeando todas as palavras da lista words
  words.forEach(word => addWordToMap(word));
  console.log(stateMapping);
  return stateMapping;
}

function adjustFinalStates(mappedWords) {
  let adjustedMap = {};
  let finalStateNames = new Set(); // Para rastrear os estados finais

  // Primeira passagem: identifica estados finais e cria o novo mapa
  Object.keys(mappedWords).forEach(key => {
    let isFinal = mappedWords[key].hasOwnProperty('final'); // Verifica se o estado é final
    let newKey = isFinal ? `${key}*` : key; // Adiciona o '*' ao nome do estado final

    if (isFinal) {
      finalStateNames.add(key); // Armazena o nome original do estado final
    }

    // Cria o novo estado sem o atributo 'final'
    adjustedMap[newKey] = { ...mappedWords[key] };
    if (isFinal) {
      delete adjustedMap[newKey].final; // Remove o atributo 'final'
    }
  });

  // Segunda passagem: ajusta as transições
  Object.keys(adjustedMap).forEach(key => {
    let updatedTransitions = {};

    Object.entries(adjustedMap[key]).forEach(([nextState, letter]) => {
      // Se o estado de destino for final, ajusta seu nome com '*'
      let updatedNextState = finalStateNames.has(nextState) ? `${nextState}*` : nextState;

      // Evita a transição para estados finais com o '*'
      if (finalStateNames.has(nextState)) {
        updatedNextState = nextState; // Remove o asterisco da transição
      }
      updatedTransitions[updatedNextState] = letter;
    });

    adjustedMap[key] = updatedTransitions;
  });

  return adjustedMap;
}

function getFinalStates(automaton) {
  automaton = adjustFinalStates(mappedWords);

  // Percorre todos os estados em mappedWords
  Object.keys(automaton).forEach(state => {
    // Se o estado contém um '*', significa que é um estado final
    if (state.includes('*') && !finalStates.includes(state)) {
      finalStates.push(state); // Adiciona à lista de estados finais se não for repetido
    }
  });

  return finalStates;
}


function resizeTable(words) {
  mappedWords = adjustFinalStates(mapWords(words));
  // Identificando todos os índices qN usados, incluindo vazios
  let allIndexes = new Set();
  let finalStates = new Set(); // Para rastrear estados finais (com *)

  Object.keys(mappedWords).forEach(key => {
    if (key.includes('*')) {
      finalStates.add(key); // Adiciona os estados finais
    }
    let normalizedKey = key.replace('*', ''); // Normaliza removendo o '*'
    allIndexes.add(normalizedKey); // Adiciona sem duplicar
    Object.keys(mappedWords[key]).forEach(nextIndex => {
      let normalizedNextIndex = nextIndex.replace('*', '');
      allIndexes.add(normalizedNextIndex);
    });
  });

  // Ordenar os índices de forma crescente
  allIndexes = Array.from(allIndexes).sort((a, b) => {
    let numA = parseInt(a.slice(1)); // Extrai o número do índice qN
    let numB = parseInt(b.slice(1));
    return numA - numB;
  });

  // Acesse o tbody da tabela
  let tbody = document.querySelector('tbody');

  // Limpa as linhas existentes (além da primeira)
  while (tbody.children.length > 1) {
    tbody.removeChild(tbody.lastChild);
  }

  // Para cada índice (q0, q1, q2, ...)
  allIndexes.forEach(index => {
    let isFinal = finalStates.has(`${index}*`); // Verifica se o estado é final
    let tr = document.createElement('tr');

    // Cria a célula de label (q0, q1, q2...)
    let tdLabel = document.createElement('td');
    tdLabel.textContent = isFinal ? `${index}*` : index; // Adiciona o '*' se for final
    tr.appendChild(tdLabel);

    // Para cada letra de A até Z, cria as células
    let seenLetters = new Set(); // Usado para evitar mapeamentos duplicados

    for (let j = 0; j < 26; j++) {
      let td = document.createElement('td');
      let letter = String.fromCharCode(65 + j); // Letras A até Z

      // Verifica se a letra está presente no mapeamento
      if (mappedWords[`${index}${isFinal ? '*' : ''}`]) {
        Object.entries(mappedWords[`${index}${isFinal ? '*' : ''}`]).forEach(([nextIndex, letterValue]) => {
          if (letterValue === letter && !seenLetters.has(letter)) {
            seenLetters.add(letter);
            td.textContent = nextIndex; // Mapeia para o próximo índice
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
    let state;
    getFinalStates(mappedWords);
    state = finalStates.indexOf(currentState + '*') !== -1 ? currentState + '*' : currentState;

    coloredStates[state].push({
      character: char,
      color: color
    });
    paintCells();
  }
}

function isValidWord(char) {
  const regex = /^[A-Za-z]+$/;
  const hasNumbers = /\d/;
  return regex.test(char) && !hasNumbers.test(char);
}

function validateChar(char) {

  getFinalStates(mappedWords);
  state = finalStates.indexOf(currentState + '*') !== -1 ? currentState + '*' : currentState;

  const stateMapping = mappedWords[state];

  if (!stateMapping) {
    return false;
  }

  const nextState = Object.keys(stateMapping).find(
    state => stateMapping[state] === char.toUpperCase()
  );

  if (nextState && invalidCharCount === 0) {
    invalidChar = false;
    getFinalStates(mappedWords);
    state = finalStates.indexOf(currentState + '*') !== -1 ? currentState + '*' : currentState;
    updateColoredStates(state, char, "green");
    currentState = nextState;
    return true;
  } else {
    invalidChar = true;
    getFinalStates(mappedWords);
    state = finalStates.indexOf(state + '*') !== -1 ? currentState + '*' : currentState;
    updateColoredStates(currentState, char, "red");
    invalidCharCount++;
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
  if (Object.keys(finalStates.indexOf(mappedWords[currentState+'*'])) && invalidCharCount === 0 && !invalidChar) {
    printWord(validateInput.value, 'green');
    return true
  }
  printWord(validateInput.value, 'red');
  return false
}

function getNextState() {
  for (let nextState in mappedWords) {
    // Verifica se o valor de 'currentState' é um índice válido para o próximo estado
    if (mappedWords[nextState][currentState]) {
      return nextState; // Retorna o próximo estado após 'currentState'
    }
  }
  return null; // Retorna null se não encontrar o próximo estado
}

function getPreviousState() {
  for (let prevState in mappedWords) {
    // Verifica se algum dos valores de 'prevState' é igual ao currentState
    if (mappedWords[prevState][currentState]) {
      return prevState; // Retorna o último estado antes de 'currentState'
    }
  }
  return null; // Retorna null se não encontrar o estado anterior
}

// Palavras digitadas para validação
validateInput.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    coloredStates = {};
    resizeTable(words);
    getFinalStates(mappedWords);
    const word = validateInput.value.trim();
    if (isValidWord(word)) {
      checkWordInAlphabet() == true ? alert(`A palavra ${validateInput.value} está presente no alfabeto :D`) : alert(`A palavra ${validateInput.value} não está presente no alfabeto ;(`);
    } else {
      validateInput.value = '';
      currentState = 'q0';
      invalidCharCount = 0;
      alert("Essa palavra contém caracteres inválidos.");
    }
    validateInput.value = '';
    currentState = 'q0';
    invalidCharCount = 0;
  } else if (e.key === 'Backspace') {
    invalidCharCount <= 0 ? invalidCharCount = 0 : invalidCharCount--;
    if (invalidCharCount === 0 && Array.isArray(coloredStates[currentState]) && coloredStates[currentState].length > 0) {
      coloredStates[currentState].pop();
    } else {
      coloredStates[getPreviousState()].pop();
      if (invalidCharCount === 0) currentState = getPreviousState(); // volta o estado anterior
    }
    paintCells();
  } else if (e.key === "Shift" || e.key === "Alt" || e.key === "Control" || e.key === "CapsLock" || e.key === "ALTGRAPH"){
  } else {
    validateChar(e.key)
  }

});
