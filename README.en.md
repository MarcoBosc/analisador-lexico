# Lexical Analyzer - Final Project for Formal Languages Course

## Developed by
Marco Boschetti and Ricardo Dequi

This project was developed as part of the final assignment for the Formal Languages course, using the technologies: **JavaScript**, **HTML**, **CSS**, and **Bootstrap**.

## Functionality

The **Lexical Analyzer** allows the validation of words in a defined alphabet by creating and generating an automaton based on the given words. Words can be added manually or generated randomly.

### Add Words

- **Add Word Field**: You can type a word in the "Add Word" field and press the **space** key to add it to the list of words.
- **Generate Random Word**: By clicking the **"Generate Random Word"** button, a random word with up to 8 characters will be generated and automatically added to the list.

### Automaton Generation

- Each time a word is added to the list, a function called **resizeTable** is triggered. This function automatically generates the automaton for all words in the list.
- You can also **remove words** from the list, and when this happens, the automaton is updated automatically, recalculating the automaton with the remaining words.

### Lexical Analysis

- **Word Validation**: The system allows you to validate if a word belongs to the current alphabet. To do this, simply type the word in the analysis field and press **space**. The analyzer will traverse the automaton, analyzing each letter.
- After pressing space, the system will inform you if the word **belongs** or **does not belong** to the alphabet.

## How to Use

1. Type or generate words and add them to the list.
2. The automaton will be generated automatically.
3. Validate a word by typing it in the analysis field and pressing **space**.

## Technologies Used

- **JavaScript** (Logic for validation and automaton generation)
- **HTML/CSS** (Page structure and styling)
- **Bootstrap** (Responsive design)
  
## License

This project is open source. Feel free to use, modify, or share it as needed.
