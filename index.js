const wordInput = document.getElementById('wordInput');
const wordList = document.getElementById('wordList');
const randomWordBtn = document.getElementById('randomWordBtn');

// Lista de palavras
const words = [];


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


function resizeTable(words) {
  let mappedWords = mapWords(words);

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



