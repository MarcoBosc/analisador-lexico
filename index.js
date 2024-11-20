const wordInput = document.getElementById('wordInput');
const wordList = document.getElementById('wordList');
const randomWordBtn = document.getElementById('randomWordBtn');

// Lista de palavras
const words = [];


function biggestWord(words) {
  if (words.length === 0) return '';

  // Usa o método reduce para iterar sobre o array e encontrar a maior palavra
  return words.reduce((longest, current) => {
    return current.length > longest.length ? current : longest;
  }, '');
}


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
    wordDiv.textContent = word.toLowerCase();

    // Botão para remover a palavra
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      wordList.removeChild(wordDiv);
      words.splice(words.indexOf(word), 1);
    });

    wordDiv.appendChild(removeBtn);
    wordList.appendChild(wordDiv);
  }
}


function resizeTable(words) {
  let biggestString = biggestWord(words);

  mapWords(words);
  // Acesse o tbody da tabela
  let tbody = document.querySelector('tbody');

  // Limpa as linhas existentes (além da primeira)
  while (tbody.children.length > 1) {
    tbody.removeChild(tbody.lastChild);
  }

  // Para cada letra em 'q0', 'q1', ... até o comprimento da maior palavra
  for (let i = 0; i < biggestString.length; i++) {
    let tr = document.createElement('tr');

    let tdLabel = document.createElement('td');
    tdLabel.textContent = `q${i}`;
    tr.appendChild(tdLabel);
    for (let j = 0; j < 25; j++) {
      let td = document.createElement('td');
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}


// mapeia as palavras para adicionar elas e suas respectivas linhas
function mapWords(words) {
  let mappedWords = {};

  words.forEach(word => {
    for (let i = 0; i < word.length; i++) {
      // Se o array para o índice da letra ainda não existir, cria-lo
      if (!mappedWords[`q${i}`]) {
        mappedWords[`q${i}`] = [];
      }

      if (!mappedWords[`q${i}`].includes(word[i])) {
        mappedWords[`q${i}`].push(word[i]);
      }
    }
  });

  console.log(mappedWords);
  return mappedWords;
}



