const wordInput = document.getElementById('wordInput');
const wordList = document.getElementById('wordList');
const randomWordBtn = document.getElementById('randomWordBtn');

// Lista de palavras
const words = [];

// Adicionar palavra ao pressionar espaço
wordInput.addEventListener('keypress', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    const word = wordInput.value.trim();
    if (word) {
      addWord(word);
      wordInput.value = '';
    }
  }
});

// Gerar palavra aleatória
randomWordBtn.addEventListener('click', () => {
  const randomWord = generateRandomWord();
  addWord(randomWord);
});

// Função para adicionar uma palavra
function addWord(word) {
  if (!words.includes(word)) {
    words.push(word);
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
