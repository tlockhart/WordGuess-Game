/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */
// Step1: Create a reference variable to all the html output elements.
const songNameRef = document.getElementById('songNameOutput');
const imageNameRef = document.getElementById('imageNameOutput');
const winsCtrRef = document.getElementById('winsCtrOutput');
const hiddenBandNameRef = document.getElementById('hiddenBandNameOutput');
const remainingGuessesRef = document.getElementById('remainingGuessesOutput');
const userIncorrectGuessesRef = document.getElementById('userIncorrectGuessesOutput');
const instructionRef = document.getElementById('instructionOutput');
const states = {
  START: 'start',
  WIN: 'win',
  LOSS: 'loss', // user ran out of remainingGuesses
  END: 'end', // user got to the end of the bandNames, or score equals length of bandnames.
  DORMENT: 'dorment',
};

// Step2: Create Game Object
let gameObject = {
  bands: ['The Gap Band', 'War', 'The Jackson 5', 'Parliament', 'Ohio  Players', 'Lakeside', 'James Brown', 'Sly And The Family Stone', 'Kool And The Gang', 'Earth Wind And Fire'],
  songs: ['Party Train', 'Slippin Into Darkness', 'ABC', 'Flashlight', 'I Want To Be Free', 'Fantastic Voyage', 'The Payback', 'Sing A Simple Song', 'Get Down On It', 'Lets Groove Tonight'],
  /* bands :["The Gap Band", "War", "The Jackson 5"],
    songs : ["Party Train", "Slippin Into Darkness", "ABC"], */
  imageID: 'bandImage',
  defaultImageID: 'defaultImage',
  audioID: 'audioImage',
  bandNameIndex: 0,
  winMessage: "Correct!  Press 'Enter' to proceed.",
  lossMessage: 'You are out of guesses.  Press Enter to play again.',
  lossCompleteMessage: 'The game is over, you are out of guesses.  Press Enter to play again.',
  startMessage: 'Press a key to make a guess.',
  dormentMessage: 'Guess the band name. Press Enter to play.',
  endMessage: 'You completed the Game! Press Enter to play again.',
  winsCtr: 0,
  remainingGuesses: 12,
  currentBand: 'none',
  numOfDashes: 0,
  userIncorrectGuesses: [],
  audioName: [],
  isMediaAdded: false,
  hiddenBandName: [],
  hiddenBandNameString: 'none',
  doesBandNamesMatch: false,
  hasGameEnded() {
    return this.state === states.END || this.bandNameIndex === this.bands.length - 1;
  },
  hasUserLoss() {
    return this.state === states.LOSS;
  },
  wasGameStarted() {
    return this.state === states.START;
  },
  wasGameWon() {
    return this.state === states.WIN;
  },
  state: states.DORMENT,
  setState(state) {
    this.state = state;
  },
  isGameWon() {
    this.doesBandNamesMatch = this.hiddenBandNameString === this.currentBand;
    return this.doesBandNamesMatch && !this.hasGameEnded() && !this.hasUserLoss();
  },
  isGameDorment() {
    return gameObject.state === states.DORMENT;
  },
  addImageDisplay(Id) {
    const imageName = this.hiddenBandName.join('');
    const imageSource = `assets/images/${imageName.replace(/\s/g, '')}.jpg`;
    const img = document.createElement('IMG');
    img.className = 'img-fluid';
    img.src = imageSource;
    img.setAttribute('id', this.imageID);
    document.getElementById(Id).appendChild(img);
    return this.imageId;
  },
  addDefaultImageDisplay(Id) {
    const imageName = this.hiddenBandName.join('');
    const imageSource = 'assets/images/urban.png';
    const img = document.createElement('IMG');
    img.className = 'img-fluid';
    img.src = imageSource;
    img.setAttribute('id', this.defaultImageID);
    document.getElementById(Id).appendChild(img);
    return this.imageId;
  },
  removeDefaultImageDisplay() {
    const elementToBeRemoved = document.getElementById(this.defaultImageID);
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
  },
  removeImageDisplay() {
    const elementToBeRemoved = document.getElementById(this.imageID);
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
  },
  addAudioDisplay(Id) {
    this.audioName = this.songs[this.bandNameIndex];
    // console.log("AUDIO FILE NAME = "+this.audioName);
    const audioSource = `assets/audio/${this.audioName.replace(/\s/g, '')}.mp3`;
    // console.log("Audio File Name with ext = "+audioSource);
    const audio = document.createElement('audio');
    audio.src = audioSource;
    audio.setAttribute('id', this.audioID);
    document.getElementById(Id).appendChild(audio);
    audio.play();
    return this.audioId;
  },
  removeAudioDisplay() {
    const elementToBeRemoved = document.getElementById(this.audioID);
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
  },
  /** ********************************************** */
  // Increments the game to the next band in the array
  /** ********************************************** */
  incrementGame() {
    // Step3: increment BandNameIndex if game has NOT ENDED
    const isBandIndexLTLength = this.bandNameIndex < this.bands.length;
    if (isBandIndexLTLength && !this.hasGameEnded()) {
      this.bandNameIndex += 1;
      // console.log("Incrementing BandIndex NOT RESETTING WINCTR");
      // NOTE: Clear the userGuessesArray
      this.clearUserIncorrectGuessesValue();
    } else if (this.hasGameEnded()) {
      // this.bandNameIndex = 0;
      this.clearBandIndexValue();
      this.clearWinsCTRValue();
      // console.log("Resetting WINCTR");
      this.displayOutput(winsCtrRef, this.winsCtr);
      // Step4: clear the userGuessesArray
      // this.clearUserIncorrectGuessesValue();
    }
    this.clearSongNameDisplay();
    this.clearImageNameDisplay();
    this.clearHiddenBandNameValue();
    this.clearCurrentBandNameValue();
    this.setRemainingGuessesValue();
    // NOTE: If game state is LOSS or END, there is no media on the screen to remove
    if (!this.hasGameEnded()) {
      this.removeImageDisplay();
      this.removeAudioDisplay();
    }

    this.state = states.START;
    this.isMediaAdded = false;
  },
  // STEP3A - NOTE1: UPDATES HTML ELEMENTS AFTER KEYPRESSED AND SETS THE STATE FOR THE ENTER EVENTS
  updateHiddenBandNameRealTime(keyPressed) {
    // Step10a: Get all the indexes where the keypressed occurs
    const indexes = this.getAllIndexes(this.currentBand, keyPressed);

    // Setp10b: If keypressed is in array then update display
    this.updateHiddenBandName(keyPressed, indexes);
    this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

    // Step 10c: Check if game won
    // 9/01/2018:this.isGameWon();
    if (this.isGameWon()) {
      // console.log("GAME WON = "+this.isGameWon());
      this.setState(states.WIN);
      this.displayWinGameScreen(this.winMessage);
    } else if (this.hasGameEnded() && this.doesBandNamesMatch) {
      // console.log("GAMEEND-WON: WINCTR = "+this.winsCtr);
      this.setState(states.WIN);
      this.displayEndWinGameScreen(this.endMessage);
    }
  },
  // STEP3B-NOTE2: OVERLOADED FUNCTION TO HANDLE NO UPPER AND LOWER KEYS:
  // UPDATES HTML ELEMENTS AFTER KEYPRESSED AND SETS THE STATE FOR THE ENTER EVENTS
  updateHiddenBandNameRealTime(keyPressedUpper, keyPressedLower) {
    // Step10a: Get all the indexes where the keypressed occurs
    const indexesUpper = this.getAllIndexes(this.currentBand, keyPressedUpper);
    const indexesLower = this.getAllIndexes(this.currentBand, keyPressedLower);

    // Setp10b: If keypressed is in array then update display
    this.updateHiddenBandName(keyPressedUpper, indexesUpper);
    this.updateHiddenBandName(keyPressedLower, indexesLower);
    this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

    // Step 10c: Check if game won
    // 9/01/2018:this.isGameWon();
    // Catch Win Condition
    if (this.isGameWon()) {
      // console.log("GAME WON = "+this.isGameWon());
      this.setState(states.WIN);
      this.displayWinGameScreen(this.winMessage);
    } else if (this.hasGameEnded() && this.doesBandNamesMatch) {
      // console.log("GAMEEND-WON: WINCTR = "+this.winsCtr);
      this.setState(states.WIN);
      this.displayEndWinGameScreen(this.endMessage);
    } else if (this.hasUserLoss()
    && this.remainingGuesses < 1
    && this.bandNameIndex === this.bands.length - 1) {
      // console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
      this.setState(states.LOSS);
      this.displayEndLossGameScreen(this.lossCompleteMessage);
    } else if (this.hasUserLoss()
    && this.remainingGuesses < 1
    && !(this.bandNameIndex === this.bands.length - 1)) {
      // console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
      this.setState(states.LOSS);
      this.displayEndLossGameScreen(this.lossMessage);
    } else if (this.wasGameStarted()
    && this.remainingGuesses < 1
    && this.bandNameIndex === this.bands.length - 1) {
      // console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
      this.setState(states.LOSS);
      this.displayEndLossGameScreen(this.lossCompleteMessage);
    } else if (this.wasGameStarted()
    && this.remainingGuesses < 1
    && !(this.bandNameIndex === this.bands.length - 1)) {
      // console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
      this.setState(states.LOSS);
      this.displayEndLossGameScreen(this.lossMessage);
    }
  },
  decrementRemainingGuessesValue(keyPressed) {
    if (this.userIncorrectGuesses.indexOf(keyPressed) > -1) {
      // don't decrement remainingGuesses if key has already been clicked
    } else {
      this.remainingGuesses = this.remainingGuesses - 1;
    }
  },
  incrementBandNameIndexValue() {
    this.bandNameIndex += 1;
  },
  incrementWinCTR() {
    this.winsCtr += 1;
  },
  setRemainingGuessesValue() {
    this.remainingGuesses = 12;
  },
  clearBandIndexValue() {
    this.bandNameIndex = 0;
  },
  clearWinsCTRValue() {
    this.winsCtr = 0;
  },
  displayOutput(outputElement, value) {
    outputElement.textContent = value;
  },
  displayWinGameScreen(message) {
    // 1: display Song Name
    this.displayOutput(songNameRef, this.songs[this.bandNameIndex]);
    // 2: display Image Name
    this.displayOutput(imageNameRef, this.hiddenBandName.join(''));
    // 3: Display media
    // 9/03:Remove default image
    this.removeDefaultImageDisplay();

    if (!this.isMediaAdded) {
      this.addImageDisplay('imageOutput');
      this.addAudioDisplay('audioOutput');
      this.isMediaAdded = true;
    }
    // 4. Display instructions;
    this.displayOutput(instructionRef, message);

    // 5.Display wins ctr
    // console.log("displayWinGameScreen: winCTR = "+this.winsCtr);
    this.incrementWinCTR();
    this.displayOutput(winsCtrRef, this.winsCtr);

    // console.log("displayWinGameScreen: STATE = "+this.state);
  },
  displayNewGameScreen() {
    this.clearSongNameDisplay();
    this.clearCurrentBandNameValue();
    this.removeImageDisplay();

    // 9/03: Add Default Image
    this.addDefaultImageDisplay('imageOutput');

    this.removeAudioDisplay();
    // set added Media to false;
    this.isMediaAdded = false;
    this.clearHiddenBandNameValue();
    this.displayOutput(imageNameRef, '');
    this.displayOutput(instructionRef, this.startMessage);
    // NOTE: LEAVE WIN CTR ALONE
    // NOTE: Must repopulate the the hiddenBandName and post here
    this.incrementBandNameIndexValue();
    // console.log("DISPLAYNEWGAMESCREEN: BandIndex = "+this.bandNameIndex);
    this.fillHiddenBandName(this.bands[this.bandNameIndex]);
    this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

    // Reset Remaining Guesses
    this.setRemainingGuessesValue();
    this.displayOutput(remainingGuessesRef, this.remainingGuesses);
    this.clearUserIncorrectGuessesValue();
    this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
  },
  displayEndWinGameScreen() {
    // 1: display Song Name
    this.displayOutput(songNameRef, this.songs[this.bandNameIndex]);
    // 2: display Image Name
    this.displayOutput(imageNameRef, this.hiddenBandName.join(''));
    // 3: Add Media

    // 9/03:Remove Default Image
    this.removeDefaultImageDisplay();
    if (!this.isMediaAdded) {
      this.addImageDisplay('imageOutput');
      this.addAudioDisplay('imageOutput');
      this.isMediaAdded = true;
    }
    // 4: Display Instruction
    this.displayOutput(instructionRef, this.endMessage);

    // 5.Display wins ctr
    // console.log("displayWinGameScreen: winCTR = "+this.winsCtr);
    this.incrementWinCTR();
    this.displayOutput(winsCtrRef, this.winsCtr);

    // console.log("DISPLAYEND-WIN-GAMESCREEN: BandIndex = "+this.bandNameIndex);
  },
  displayEndLossGameScreen(msg) {
    this.clearHiddenBandNameValue();
    this.displayOutput(imageNameRef, '');
    this.displayOutput(instructionRef, msg);
    // console.log("DISPLAYEND-LOSS-GAMESCREEN: BandIndex = "+this.bandNameIndex);
  },
  displayEndGameScreen() {
    this.clearSongNameDisplay();
    this.clearCurrentBandNameValue();
    this.isMediaAdded = false;

    this.clearHiddenBandNameValue();
    this.displayOutput(imageNameRef, '');
    // 1. Change Instructions
    this.displayOutput(instructionRef, this.startMessage);
    // 2. Reset Win Counter
    this.clearWinsCTRValue();
    this.displayOutput(winsCtrRef, this.winsCtr);
    // 3. Reset BandName Index Value
    this.bandNameIndex = 0;
    // 4. Clear Hidden Band Name
    this.clearHiddenBandNameValue();
    this.clearCurrentBandNameValue();
    // 5. CREATE HIDDEN BAND DISPLAY
    this.fillHiddenBandName(this.bands[this.bandNameIndex]);
    this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

    // 6.Reset Remaining Guesses
    this.setRemainingGuessesValue();
    this.displayOutput(remainingGuessesRef, this.remainingGuesses);
    this.clearUserIncorrectGuessesValue();
    this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
  },
  displayBeginGameScreen() {
    this.isMediaAdded = false;
    this.clearHiddenBandNameValue();
    this.displayOutput(imageNameRef, '');
    // 1. Change Instructions
    this.displayOutput(instructionRef, this.startMessage);
    // 2. Reset Win Counter
    this.clearWinsCTRValue();
    this.displayOutput(winsCtrRef, this.winsCtr);
    // 3. Reset BandName Index Value
    this.bandNameIndex = 0;
    // 4. Clear Hidden Band Name
    this.clearHiddenBandNameValue();
    this.clearCurrentBandNameValue();
    // 5. CREATE HIDDEN BAND DISPLAY
    this.fillHiddenBandName(this.bands[this.bandNameIndex]);
    this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

    // 6.Reset Remaining Guesses
    this.setRemainingGuessesValue();
    this.displayOutput(remainingGuessesRef, this.remainingGuesses);
    this.clearUserIncorrectGuessesValue();
    this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
  },
  displayResetALLGameScreen() {
    this.clearSongNameDisplay();
    this.clearCurrentBandNameValue();
    this.removeImageDisplay();

    // 9/03 Add Default Image
    this.addDefaultImageDisplay('imageOutput');

    this.removeAudioDisplay();

    // set added Media to false;
    this.isMediaAdded = false;

    this.clearHiddenBandNameValue();
    this.displayOutput(imageNameRef, '');
    // 1. Change Instructions
    this.displayOutput(instructionRef, this.startMessage);
    // 2. Reset Win Counter
    this.clearWinsCTRValue();
    this.displayOutput(winsCtrRef, this.winsCtr);
    // 3. Reset BandName Index Value
    this.bandNameIndex = 0;
    // console.log("RESETALL-GAMESCREEN: GAME OBJECT RESET TO 0: BandIndex = "+this.bandNameIndex);
    // 4. Clear Hidden Band Name
    this.clearHiddenBandNameValue();
    this.clearCurrentBandNameValue();
    // 5. CREATE HIDDEN BAND DISPLAY
    this.fillHiddenBandName(this.bands[this.bandNameIndex]);
    this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

    // 6.Reset Remaining Guesses
    this.setRemainingGuessesValue();
    this.displayOutput(remainingGuessesRef, this.remainingGuesses);
    this.clearUserIncorrectGuessesValue();
    this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
  },
  /** *********************************************** */
  /* SETS THE HIDDEN BAND NAME AND DISPLAYS TO SCREEN */
  /** *********************************************** */
  fillHiddenBandName(currentBand) {
    // console.log("CurrentBand length = "+currentBand.length);
    for (let i = 0; i < currentBand.length; i += 1) {
      if (currentBand[i] === ' ') {
        this.hiddenBandName.push(' ');
        // console.log("Pushed a SPACE on the queue")
      } else {
        this.hiddenBandName.push('_');
        // console.log("Pushed a DASH on the queue")
      }
    }
    this.currentBand = currentBand;
    this.hiddenBandNameString = this.hiddenBandName.join('');
  },
  getAllIndexes(arr, val) {
    const indexes = []; let
      i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
    }
    return indexes;
  },
  /** ********************************************** */
  /* Updates the hiddenBandName with the keyPressed */
  /** ********************************************** */
  updateHiddenBandName(keyPressed, indexes) {
    for (let i = 0; i < indexes.length; i += 1) {
      this.hiddenBandName[indexes[i]] = keyPressed;
      // console.log("UPDATE: Hidden BAND NAME INDEX = "+indexes[i]);
      // console.log("UPDATE: key Pressed = "+keyPressed);
    }
    this.hiddenBandNameString = this.hiddenBandName.join('');
    // console.log("UPDATE: Hidden Band Name = "+this.hiddenBandName);
  },
  /** ********************************************** */
  /* Updates the RemainingGuesses in REAL TIME      */
  /** ********************************************** */
  updateRemainingGuessesRealTime(keyPressed) {
    if (this.remainingGuesses > 0) {
      this.decrementRemainingGuessesValue(keyPressed);
      // console.log("UPDATEREMAININGGUESSESREALTIME: Remaining guesses = "+this.remainingGuesses);
      // console.log("UPDATEREMAININGGUESSESREALTIME: GAME STATE = "+this.state);

      this.displayOutput(remainingGuessesRef, this.remainingGuesses);

      // NOTE: Only push new keys into the userGuesses array
      if (this.userIncorrectGuesses.indexOf(keyPressed) === -1) {
        this.userIncorrectGuesses.push(keyPressed);
      }
      this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses.toString());
    }// if
    // STEP4: If no more guesses remain set game state to loss;
    if (this.remainingGuesses === 0) {
      // gameObject.isGameEnded = false;
      this.setState(states.LOSS);
      // STEP5:Handle LOSS CONDITION FOR NO MORE REMAINING GUESSES
      if (this.hasUserLoss()
      && this.remainingGuesses < 1
      && (this.bandNameIndex === this.bands.length - 1)) {
        // console.log("GAMEEND-LOSS: WINCTR = " + this.winsCtr);
        this.setState(states.LOSS);
        this.displayEndLossGameScreen(this.lossCompleteMessage);
        this.setState(states.LOSS);
      } else if (this.hasUserLoss()
      && this.remainingGuesses < 1
      && !(this.bandNameIndex === this.bands.length - 1)) {
        // console.log("GAMEEND-LOSS: WINCTR = " + this.winsCtr);
        this.setState(states.LOSS);
        this.displayEndLossGameScreen(this.lossMessage);
        this.setState(states.LOSS);
      }
      // gameObject.resetGame();
    }// else
  },
  clearHiddenBandNameValue() {
    this.hiddenBandName = [];
  },
  clearUserIncorrectGuessesValue() {
    this.userIncorrectGuesses = [];
  },
  clearCurrentBandNameValue() {
    this.currentband = '';
  },
  clearSongNameDisplay() {
    this.displayOutput(songNameRef, ' ');
  },
  clearImageNameDisplay() {
    this.displayOutput(imageNameRef, ' ');
  },
  clearUserGuessesDisplay() {
    this.displayOutput(userIncorrectGuessesRef, ' ');
  },
};

/** ******************************************
 * Step6: start a listener for the enter key
 * ***************************************** */
document.onkeyup = (event) => {
  const keyCode = event.code.toLowerCase();
  const keyPressed = event.key.toLowerCase();
  const three = 3;

  // console.log("HAS GAME ENDED = "+gameObject.hasGameEnded());
  // console.log("Key Pressed = "+keyPressed+", Key Code = "+keyCode+", State = "+gameObject.state);
  // console.log("IS GAME DORMENT "+gameObject.isGameDorment());
  // console.log("Has USER LOSS "+gameObject.hasUserLoss());

  // STEP6a: Handle ALL GAME SCENERIOS TO RESET THE SCREEN AFTER ENTER PRESSED
  // NOTE: REGARDLESS OF GAME STATE RECEIVED, THE GAME STATE MUST BE RETURNED
  // TO START IN ORDER FOR KEYPRESED EVENTS TO BE REGISTERED AGAIN
  if (keyCode === 'enter'
  && gameObject.isGameDorment()
  || keyCode === 'enter'
  && gameObject.wasGameWon()
  || keyCode === 'enter'
  && gameObject.hasGameEnded()
  || keyCode === 'enter'
  && gameObject.hasUserLoss()) {
    // HANDLE START OF GAME CONDITION
    if (gameObject.isGameDorment()) {
      // console.log("*GAME NOT ENDED AND NOT WON*: Starting Game");
      // 9/04/2018:
      gameObject.displayBeginGameScreen();
      // Step6b: Set game state to start
      gameObject.setState(states.START);
      // console.log("Game is started!");
    } else if (gameObject.wasGameWon() && !gameObject.hasGameEnded()) {
      // console.log("ENTER PRESSED: GAME WAS WON");
      gameObject.displayNewGameScreen();
      // console.log("LINE472: GAME STATE = "+gameObject.state);
      gameObject.setState(states.START);
    } else if (gameObject.hasGameEnded()
    && gameObject.doesBandNamesMatch
    && gameObject.remainingGuesses > 0
    && gameObject.bandNameIndex === gameObject.bands.length - 1) {
      // console.log("*GAME HAS ENDED*: Starting Game");
      // console.log("ENTERING IF2:RESETING ALL VARIABLE");
      gameObject.displayResetALLGameScreen();
      gameObject.setState(states.START);
    } else if (gameObject.hasGameEnded()
    && !gameObject.doesBandNamesMatch
    && gameObject.remainingGuesses < 1) {
      // console.log("*GAME HAS ENDED*: Starting Game");
      // console.log("ENTERING IF2:RESETING ALL VARIABLE");
      gameObject.displayEndGameScreen();
      gameObject.setState(states.START);
    } else if (gameObject.hasUserLoss()) {
      // console.log("*9/02/2018: USER HAS LOSS*: Starting Game");
      gameObject.displayEndGameScreen();
      gameObject.setState(states.START);
    }
  } else if (keyCode.substring(0, three) === 'dig'
  || keyCode.substring(0, three) === 'key'
  && gameObject.state === states.START) {
    const isUpperCaseKeyInBandName = gameObject.currentBand
      .indexOf(keyPressed.toUpperCase()) !== -1;
    const isLowerCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed) !== -1;

    // Step10 Check if Key is in bandName
    if (isUpperCaseKeyInBandName && !isLowerCaseKeyInBandName) {
      gameObject.updateHiddenBandNameRealTime(keyPressed.toUpperCase());
    } else if (isLowerCaseKeyInBandName && !isUpperCaseKeyInBandName) {
      gameObject.updateHiddenBandNameRealTime(keyPressed.toLowerCase());
    } else if (isLowerCaseKeyInBandName && isUpperCaseKeyInBandName) {
      gameObject.updateHiddenBandNameRealTime(keyPressed.toLowerCase(), keyPressed.toUpperCase());
      // gameObject.updateHiddenBandNameRealTime(keyPressed.toUpperCase());
    } else if (!isUpperCaseKeyInBandName && !isLowerCaseKeyInBandName) {
      // 11a: Decrement remaining guesses
      gameObject.updateRemainingGuessesRealTime(keyPressed);
    }// else
  } // Outter Else if
};// Onkey Event
