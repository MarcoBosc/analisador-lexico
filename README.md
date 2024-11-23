# Analisador Léxico - Trabalho Final de Linguagens Formais
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/MarcoBosc/analisador-lexico/blob/main/README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/MarcoBosc/analisador-lexico/blob/main/README.en.md)



## Desenvolvido por
Marco Boschetti e Ricardo Dequi

Este projeto foi desenvolvido como parte do trabalho final da matéria de Linguagens Formais, utilizando as tecnologias: **JavaScript**, **HTML**, **CSS** e **Bootstrap**.

## Funcionalidade

O **Analisador Léxico** permite a validação de palavras em um alfabeto definido, criando e gerando um autômato com base nas palavras fornecidas. As palavras podem ser adicionadas manualmente ou geradas aleatoriamente.

![Screenshot](https://github.com/MarcoBosc/analisador-lexico/blob/main/screenshot.png)

### Adicionar Palavras

- **Campo de Adicionar Palavra**: Você pode digitar uma palavra no campo de adicionar palavra e apertar a tecla **espaço** para adicioná-la à lista de palavras. 
- **Gerar Palavra Aleatória**: Clicando no botão **"Gerar Palavra Aleatória"**, uma palavra de até 8 caracteres aleatórios será gerada e adicionada automaticamente à lista de palavras.

### Geração do Autômato

- A cada palavra adicionada à lista, uma função chamada **resizeTable** é acionada. Esta função gera automaticamente o autômato para todas as palavras presentes na lista.
- É possível **remover palavras** da lista e, ao fazer isso, o autômato será atualizado automaticamente, recalculando o autômato com as palavras restantes.

### Análise Léxica

- **Validação da Palavra**: O sistema permite validar se uma palavra pertence ao alfabeto atual. Para isso, basta digitar a palavra no campo de análise e pressionar **espaço**. O analisador irá percorrer o autômato, analisando letra por letra.
- Após pressionar espaço, o sistema irá informar se a palavra **pertence** ou **não pertence** ao alfabeto.

---

- **Funcionamento**: Para o sistema validar se uma palavra existe, ele percorre o autômato mapeado no JSON chamado **mappedWords** e armazena o estado atual do autômato na variável **currentState**. Dessa maneira, a cada caractere digitado, o autômato avança uma posição do mapeamento. Quando a palavra que está sendo digitada leva o **currentState** para uma posição onde não existe mapeamento, significa que chegou ao final da palavra e a palavra digitada pertence ao alfabeto.

- O **mappedWords** é mapeado da seguinte maneira:

```
Observe que os estados q4, q7, q10 e q19 são estados finais.
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

- Para pintar o autômato, a lógica é similar ao mapeamento. Basicamente, o autômato mapeia os caracteres digitados e valida se eles são válidos ou inválidos, atribui uma cor a esses estados e os armazena na variável **coloredStates**. Depois, ele basicamente chama a **paintCells**, que é responsável por localizar cada um desses estados e pintá-los da cor mapeada. Caso o estado não tenha uma cor especificada, ele é pintado da cor padrão da tabela (isso ocorre quando o backspace é ativado).

- O **coloredStates** é mapeado da seguinte maneira:

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

- **Caracteres inválidos**: Sempre que um caractere inválido é digitado, ele soma 1 valor na variável **invalidCharCount**, e somente volta a percorrer o autômato quando ela é igual a zero.

---

## Como Usar

1. Digite ou gere palavras e adicione-as à lista.
2. O autômato será gerado automaticamente.
3. Valide uma palavra digitando-a no campo de análise e pressionando **espaço**.

## Tecnologias Utilizadas

- **JavaScript** (Lógica de validação e geração do autômato)
- **HTML/CSS** (Estrutura e estilo da página)
- **Bootstrap** (Design responsivo)
  
## Licença

Este projeto é de código aberto. Sinta-se à vontade para usá-lo, modificá-lo ou compartilhá-lo conforme necessário.
