# Lexical Analyzer - Final Project for Formal Languages Course
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/MarcoBosc/analisador-lexico/blob/main/README.en.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/MarcoBosc/analisador-lexico/blob/main/README.md)


## Developed by
Marco Boschetti and Ricardo Dequi

This project was developed as part of the final assignment for the Formal Languages course, using the technologies: **JavaScript**, **HTML**, **CSS**, and **Bootstrap**.

## Functionality

The **Lexical Analyzer** allows the validation of words in a defined alphabet by creating and generating an automaton based on the given words. Words can be added manually or generated randomly.

![Screenshot](https://github.com/MarcoBosc/analisador-lexico/blob/main/screenshot.png)

### Add Words

- **Add Word Field**: You can type a word in the "Add Word" field and press the **space** key to add it to the list of words.
- **Generate Random Word**: By clicking the **"Generate Random Word"** button, a random word with up to 8 characters will be generated and automatically added to the list.

### Automaton Generation

- Each time a word is added to the list, a function called **resizeTable** is triggered. This function automatically generates the automaton for all words in the list.
- You can also **remove words** from the list, and when this happens, the automaton is updated automatically, recalculating the automaton with the remaining words.

### Lexical Analysis

- **Word Validation**: The system allows you to validate if a word belongs to the current alphabet. To do this, simply type the word in the analysis field and press **space**. The analyzer will traverse the automaton, analyzing each letter.
- After pressing space, the system will inform you if the word **belongs** or **does not belong** to the alphabet.

---

- **Operation**: To validate whether a word exists, the system traverses the automaton mapped in the JSON called **mappedWords** and stores the current state of the automaton in the **currentState** variable. This way, with each typed character, the automaton moves one position forward in the mapping. When the word being typed leads the **currentState** to a position where no mapping exists, it means that the end of the word has been reached and the typed word belongs to the alphabet.

- The **mappedWords** is mapped as follows:

```
Note that states q4, q7, q10, and q19 are final states.
{
    "q0": {
        "q1": "M"
    },
    "q1": {
        "q2": "O"
    },
    "q2": {
        "q3": "U"
    },
    "q3": {
        "q4": "S"
    },
    "q4": {
        "q5": "E"
    },
    "q5": {
        "final": "*",
        "q6": "P"
    },
    "q6": {
        "q7": "A"
    },
    "q7": {
        "q8": "D"
    },
    "q8": {
        "final": "*"
    }
}
```

- To paint the automaton, the logic is similar to the mapping. Basically, the automaton maps the typed characters and validates whether they are valid or invalid, assigns a color to these states, and stores them in the **coloredStates** variable. Then, it calls **paintCells**, which is responsible for locating each of these states and painting them with the mapped color. If the state doesn't have a specified color, it is painted with the default table color (this happens when backspace is activated).

- The **coloredStates** is mapped as follows:

```
{
    "q0": [
        {
            "character": "a",
            "color": "green"
        }
    ],
    "q1": [
        {
            "character": "g",
            "color": "green"
        }
    ],
    "q2": [
        {
            "character": "u",
            "color": "green"
        }
    ],
    "q3": [
        {
            "character": "h",
            "color": "red"
        }
    ]
}
```

- **Invalid characters**: Whenever an invalid character is typed, it adds 1 value to the **invalidCharCount** variable, and the automaton only starts traversing again when this variable equals zero.

---

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
