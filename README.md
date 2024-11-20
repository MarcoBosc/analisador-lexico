# Analisador Léxico - Trabalho Final de Linguagens Formais
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/feerodgs/uTrackProject/blob/main/README.pt-br.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/feerodgs/uTrackProject/blob/main/README.md)



## Desenvolvido por
Marco Boschetti e Ricardo Dequi

Este projeto foi desenvolvido como parte do trabalho final da matéria de Linguagens Formais, utilizando as tecnologias: **JavaScript**, **HTML**, **CSS** e **Bootstrap**.

## Funcionalidade

O **Analisador Léxico** permite a validação de palavras em um alfabeto definido, criando e gerando um autômato com base nas palavras fornecidas. As palavras podem ser adicionadas manualmente ou geradas aleatoriamente.

### Adicionar Palavras

- **Campo de Adicionar Palavra**: Você pode digitar uma palavra no campo de adicionar palavra e apertar a tecla **espaço** para adicioná-la à lista de palavras. 
- **Gerar Palavra Aleatória**: Clicando no botão **"Gerar Palavra Aleatória"**, uma palavra de até 8 caracteres aleatórios será gerada e adicionada automaticamente à lista de palavras.

### Geração do Autômato

- A cada palavra adicionada à lista, uma função chamada **resizeTable** é acionada. Esta função gera automaticamente o autômato para todas as palavras presentes na lista.
- É possível **remover palavras** da lista e, ao fazer isso, o autômato será atualizado automaticamente, recalculando o autômato com as palavras restantes.

### Análise Léxica

- **Validação da Palavra**: O sistema permite validar se uma palavra pertence ao alfabeto atual. Para isso, basta digitar a palavra no campo de análise e pressionar **espaço**. O analisador irá percorrer o autômato, analisando letra por letra.
- Após pressionar espaço, o sistema irá informar se a palavra **pertence** ou **não pertence** ao alfabeto.

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
