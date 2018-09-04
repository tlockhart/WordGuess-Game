# WordGuess-Game
This repo is a *Funk Version* of the classic hangman game.  It cycles through a list of 70's and 80's Funk bands and asks the user to guess the band name by clicking a key.  The game displays the following:
1. Instruction
1. Number of Wins
1. Letters Guessed
1. Incorrect Guesses
## Setup
In order to run the app, you will need to run the index.html file on a computer with a web browser and internet access.  After cloning the app, open the index.html file and follow the instructions on screen.
## Game Play
The user will be asked to click 'Enter' to start the game.  The band name will be displayed with underline characters initially.  Each time a user presses a key included in the band name, it will be revealed on screen.  If the letter is not in the band name it will display as an incorrect guess.  The user has 11 chances to make and incorrect guess before the game will end.  If the user guesses the band name without reaching the number of incorrect guesses *(12)*, the user wins the game and his score increases. The game will then display an image and play a song associated with the band to celebrate the user's victory.  The game will then ask the user to press 'Enter' to proceed to the next band.  Game play ends when all ten band names have been guessed.  
## Use
This repo is available for public non-commercial use only.
## Goal
The goal of this project was to create an interactive game that is dynamically updated by JavaScript.
