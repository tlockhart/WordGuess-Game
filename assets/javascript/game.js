 //Step1: Create a reference variable to all the html output elements.
 var songNameRef = document.getElementById('songNameOutput');
 var imageNameRef = document.getElementById('imageNameOutput');
 var winsCtrRef = document.getElementById('winsCtrOutput');
 var hiddenBandNameRef = document.getElementById('hiddenBandNameOutput');
 var remainingGuessesRef = document.getElementById('remainingGuessesOutput');
 var userIncorrectGuessesRef = document.getElementById('userIncorrectGuessesOutput');
 var instructionRef = document.getElementById('instructionOutput');
 var states = {
    START : "start",
    WIN : "win",
    LOSS : "loss", //user ran out of remainingGuesses
    END: "end",  //user got to the end of the bandNames, or score equals length of bandnames.
    DORMENT : "dorment"
    };

 //Step2: Create Game Object
var gameObject = {
   /* bands :["The Gap Band", "War", "The Jackson 5", "Parliament", "Ohio  Players", "Lakeside", "James Brown", "Sly And The Family Stone", "Kool And The Gang", "Earth Wind And Fire"],
    songs : ["Party Train", "Slippin Into Darkness", "ABC", "Flashlight", "I Want To Be Free", "Fantastic Voyage", "The Payback", "Sing A Simple Song", "Get Down On It", "Lets Groove Tonight"],*/
    bands :["The Gap Band", "War", "The Jackson 5"],
    songs : ["Party Train", "Slippin Into Darkness", "ABC"],
    imageID : "bandImage",
    defaultImageID: "defaultImage",
    audioID: "audioImage",
    bandNameIndex : 0,
    winMessage : "Correct!  Press 'Enter' to proceed.",
    lossMessage : "You are out of guesses.  Press Enter to play again.",
    lossCompleteMessage : "The game is over, you are out of guesses.  Press Enter to play again.",
    startMessage: "Press a key to make a guess.",
    dormentMessage: "Guess the band name. Press Enter to play.",
    endMessage: "You completed the Game! Press Enter to play again.",
    winsCtr : 0,
    remainingGuesses : 12,
    currentBand : "none",
    numOfDashes : 0,
    userIncorrectGuesses : [],
    audioName : [],
    isMediaAdded : false,
    hiddenBandName : [],
    hiddenBandNameString : "none",
    doesBandNamesMatch : false,
    hasGameEnded : function(){
        return this.state === states.END || this.bandNameIndex === this.bands.length-1;
    },
    hasUserLoss : function(){
        return this.state === states.LOSS;
    },
    wasGameStarted : function(){
        return this.state === states.START;
    },
    wasGameWon : function(){
        return this.state === states.WIN;
    }, 
    state : states.DORMENT,
    setState : function (state){
        this.state = state;
    },
    isGameWon : function(){
        this.doesBandNamesMatch = this.hiddenBandNameString === this.currentBand;
        console.log("isGAMEWON: STATE = "+this.state+", Does Band Names Match = "+this.doesBandNamesMatch+"; Has GAME ENDED = "+this.hasGameEnded()+"; Has User Loss"+this.hasUserLoss());
        return  this.doesBandNamesMatch && !this.hasGameEnded() && !this.hasUserLoss();
    },
    isGameDorment : function(){
        return gameObject.state === states.DORMENT;
    },
    addImageDisplay : function(Id) {
        var imageName = this.hiddenBandName.join("");
        var imageSource = "assets/images/"+imageName.replace(/\s/g,'')+".jpg";
        var img = document.createElement("IMG");
        img.src = imageSource;
        img.setAttribute('id', this.imageID);
        document.getElementById(Id).appendChild(img);
        return this.imageId;
    },
    addDefaultImageDisplay : function(Id) {
        var imageName = this.hiddenBandName.join("");
        var imageSource = "assets/images/urban.png";
        var img = document.createElement("IMG");
        img.src = imageSource;
        img.setAttribute('id', this.defaultImageID);
        document.getElementById(Id).appendChild(img);
        return this.imageId;
    },
    removeDefaultImageDisplay() {
        var elementToBeRemoved = document.getElementById(this.defaultImageID);
        elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
    },
    removeImageDisplay() {
        var elementToBeRemoved = document.getElementById(this.imageID);
        elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
    },
    addAudioDisplay : function(Id) {
        this.audioName = this.songs[this.bandNameIndex];
        console.log("AUDIO FILE NAME = "+this.audioName);
        var audioSource = "assets/audio/"+this.audioName.replace(/\s/g,'')+".mp3";
        console.log("Audio File Name with ext = "+audioSource);
        var audio = document.createElement("audio");
        audio.src = audioSource;
        audio.setAttribute('id', this.audioID);
        document.getElementById(Id).appendChild(audio);
        audio.play();
        return this.audioId;
    },
    removeAudioDisplay() {
        var elementToBeRemoved = document.getElementById(this.audioID);
        elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
    },
    /*************************************************/
    //Increments the game to the next band in the array
    /*************************************************/
    incrementGame : function(){
        //Step3: increment BandNameIndex if game has NOT ENDED
        var isBandIndexLTLength = this.bandNameIndex < this.bands.length;
        console.log("bands Index = "+this.bandNameIndex+", bands length = "+(this.bands.length)+", Is Index LT Length = "+isBandIndexLTLength);
        if(isBandIndexLTLength && !this.hasGameEnded()){
            this.bandNameIndex++;
            console.log("Incrementing BandIndex NOT RESETTING WINCTR");
            //NOTE: Clear the userGuessesArray
            this.clearUserIncorrectGuessesValue();
        }
        //if game state has ENDED
        else if(this.hasGameEnded()){
           // this.bandNameIndex = 0;
           this.clearBandIndexValue();
            this.clearWinsCTRValue();
            console.log("Resetting WINCTR");
            this.displayOutput(winsCtrRef, this.winsCtr);
            //Step4: clear the userGuessesArray
           //this.clearUserIncorrectGuessesValue();
        }
        this.clearSongNameDisplay();
        this.clearImageNameDisplay();
        this.clearHiddenBandNameValue();
        this.clearCurrentBandNameValue();
        this.setRemainingGuessesValue();
        //NOTE: If game state is LOSS or END, there is no media on the screen to remove
        if(!this.hasGameEnded()){
            this.removeImageDisplay();
            this.removeAudioDisplay();
        }
        
        this.state = states.START;
        this.isMediaAdded = false;
    },
    //STEP3A - NOTE1: UPDATES HTML ELEMENTS AFTER KEYPRESSED AND SETS THE STATE FOR THE ENTER EVENTS
    updateHiddenBandNameRealTime : function(keyPressed){
        //Step10a: Get all the indexes where the keypressed occurs
        var indexes = this.getAllIndexes(this.currentBand , keyPressed);
           
        //console.log ("Is index in array "+this.isKeyPressedFound(indexes));
        
        //Setp10b: If keypressed is in array then update display
            this.updateHiddenBandName(keyPressed, indexes);
             this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

             //Step 10c: Check if game won
            // 9/01/2018:this.isGameWon();
            if(this.isGameWon()){
                console.log("GAME WON = "+this.isGameWon());
                this.setState(states.WIN);
                this.displayWinGameScreen(this.winMessage);
            }
            else if(this.hasGameEnded() && this.doesBandNamesMatch){
                console.log("GAMEEND-WON: WINCTR = "+this.winsCtr);
                this.setState(states.WIN)
                this.displayEndWinGameScreen(this.endMessage);
            }

    },
    //STEP3B-NOTE2: OVERLOADED FUNCTION TO HANDLE NO UPPER AND LOWER KEYS: UPDATES HTML ELEMENTS AFTER KEYPRESSED AND SETS THE STATE FOR THE ENTER EVENTS
    updateHiddenBandNameRealTime : function(keyPressedUpper, keyPressedLower){
        //Step10a: Get all the indexes where the keypressed occurs
        var indexesUpper = this.getAllIndexes(this.currentBand , keyPressedUpper);
        var indexesLower = this.getAllIndexes(this.currentBand , keyPressedLower); 
        //console.log ("Is index in array "+this.isKeyPressedFound(indexes));
        
        //Setp10b: If keypressed is in array then update display
            this.updateHiddenBandName(keyPressedUpper, indexesUpper);
            this.updateHiddenBandName(keyPressedLower, indexesLower);
             this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

             //Step 10c: Check if game won
            // 9/01/2018:this.isGameWon();
            //Catch Win Condition
            if(this.isGameWon()){
                console.log("GAME WON = "+this.isGameWon());
                this.setState(states.WIN);
                this.displayWinGameScreen(this.winMessage);
            }
            //Catch END-WIN Condition
            else if(this.hasGameEnded() && this.doesBandNamesMatch){
                console.log("GAMEEND-WON: WINCTR = "+this.winsCtr);
                this.setState(states.WIN)
                this.displayEndWinGameScreen(this.endMessage);
            }
            //Catch LOSS Condition and AND AT END OF GAME
           else if(this.hasUserLoss() && this.remainingGuesses < 1 &&  this.bandNameIndex === this.bands.length-1){
                console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
                this.setState(states.LOSS)
                this.displayEndLossGameScreen(this.lossCompleteMessage);
            }
            //Catch LOSS Condition
            else if(this.hasUserLoss() && this.remainingGuesses < 1 && !(this.bandNameIndex === this.bands.length-1)){
                console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
                this.setState(states.LOSS)
                this.displayEndLossGameScreen(this.lossMessage);
            }
            //NOT NECESSARY: CATCH START NO REMAINING GUESS CONDITION
            else if(this.wasGameStarted() && this.remainingGuesses <1 && this.bandNameIndex === this.bands.length-1){
                console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
                this.setState(states.LOSS)
                this.displayEndLossGameScreen(this.lossCompleteMessage);
            }
            else if(this.wasGameStarted() && this.remainingGuesses <1 && !(this.bandNameIndex === this.bands.length-1)){
                console.log("GAMEEND-LOSS: WINCTR = "+this.winsCtr);
                this.setState(states.LOSS)
                this.displayEndLossGameScreen(this.lossMessage);
            }
    },
    decrementRemainingGuessesValue : function(keyPressed){
        if(this.userIncorrectGuesses.indexOf(keyPressed) > -1){
            //don't decrement remainingGuesses if key has already been clicked
        }
        else
        {
            this.remainingGuesses=this.remainingGuesses-1;
        }
    },
    incrementBandNameIndexValue : function(){
        this.bandNameIndex++;
    },
    incrementWinCTR : function(){
        this.winsCtr++;
    },
    setRemainingGuessesValue : function(){
        this.remainingGuesses = 12;
    },
    clearBandIndexValue : function(){
        this.bandNameIndex = 0;
    },
    clearWinsCTRValue : function(){
        this.winsCtr = 0;
    },
    displayOutput : function(outputElement, value){
        outputElement.textContent = value;
    },
    displayWinGameScreen :function(message){
        //1: display Song Name
        this.displayOutput(songNameRef, this.songs[this.bandNameIndex]);
        //2: display Image Name
        this.displayOutput(imageNameRef, this.hiddenBandName.join(""));
        //3: Display media
        //9/03:Remove default image
        this.removeDefaultImageDisplay();

        if(!this.isMediaAdded){
            this.addImageDisplay("imageOutput");
            this.addAudioDisplay("audioOutput");
            this.isMediaAdded = true;
        }
        //4. Display instructions;
        this.displayOutput(instructionRef, message);
        
        //5.Display wins ctr
        console.log("displayWinGameScreen: winCTR = "+this.winsCtr);
        this.incrementWinCTR();
        this.displayOutput(winsCtrRef, this.winsCtr);

        console.log("displayWinGameScreen: STATE = "+this.state);
    },
    displayNewGameScreen : function(){
        this.clearSongNameDisplay();
        this.clearCurrentBandNameValue();
        this.removeImageDisplay();

        //9/03: Add Default Image
        this.addDefaultImageDisplay("imageOutput");

        this.removeAudioDisplay();
        //set added Media to false;
        this.isMediaAdded = false;
        this.clearHiddenBandNameValue();
        this.displayOutput(imageNameRef, "");
        this.displayOutput(instructionRef, this.startMessage);
        //NOTE: LEAVE WIN CTR ALONE
        //NOTE: Must repopulate the the hiddenBandName and post here
        this.incrementBandNameIndexValue();
        console.log("DISPLAYNEWGAMESCREEN: BandIndex = "+this.bandNameIndex);
        this.fillHiddenBandName(this.bands[this.bandNameIndex]);
        this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

        //Reset Remaining Guesses
        this.setRemainingGuessesValue();
        this.displayOutput(remainingGuessesRef, this.remainingGuesses);
        this.clearUserIncorrectGuessesValue();
        this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
    },
    displayEndWinGameScreen : function(){
          //1: display Song Name
          this.displayOutput(songNameRef, this.songs[this.bandNameIndex]);
          //2: display Image Name
          this.displayOutput(imageNameRef, this.hiddenBandName.join(""));
          //3: Add Media

          //9/03:Remove Default Image
          this.removeDefaultImageDisplay();
        if(!this.isMediaAdded)
        {
            this.addImageDisplay("imageOutput");
            this.addAudioDisplay("imageOutput");
            this.isMediaAdded = true;
        }
        //4: Display Instruction
        this.displayOutput(instructionRef, this.endMessage);

        //5.Display wins ctr
        console.log("displayWinGameScreen: winCTR = "+this.winsCtr);
        this.incrementWinCTR();
        this.displayOutput(winsCtrRef, this.winsCtr);

        console.log("DISPLAYEND-WIN-GAMESCREEN: BandIndex = "+this.bandNameIndex);
    },
    displayEndLossGameScreen : function(msg){
        this.clearHiddenBandNameValue();
        this.displayOutput(imageNameRef, "");
        this.displayOutput(instructionRef, msg);
        //9/03 DisplayDefault Image
        //this.addDefaultImageDisplay("imageOutput");
        console.log("DISPLAYEND-LOSS-GAMESCREEN: BandIndex = "+this.bandNameIndex);
    },
    displayEndGameScreen : function(){
        this.clearSongNameDisplay();
        this.clearCurrentBandNameValue();       
        this.isMediaAdded = false;

        //9/03:Display Default Image
        //this.addDefaultImageDisplay("imageOutput");

        this.clearHiddenBandNameValue();
        this.displayOutput(imageNameRef, "");
        //1. Change Instructions
        this.displayOutput(instructionRef, this.startMessage);
        //2. Reset Win Counter
        this.clearWinsCTRValue();
        this.displayOutput(winsCtrRef, this.winsCtr);
        //3. Reset BandName Index Value
        this.bandNameIndex = 0;
        console.log("DISPLAYEND-GAMESCREEN: GAME OBJECT RESET TO 0: BandIndex = "+this.bandNameIndex);
        //4. Clear Hidden Band Name
        this.clearHiddenBandNameValue();
        this.clearCurrentBandNameValue();
        //5. CREATE HIDDEN BAND DISPLAY
        this.fillHiddenBandName(this.bands[this.bandNameIndex]);
        this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

        //6.Reset Remaining Guesses
        this.setRemainingGuessesValue();
        this.displayOutput(remainingGuessesRef, this.remainingGuesses);
        this.clearUserIncorrectGuessesValue();
        this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
    },
    displayResetALLGameScreen : function(){
        this.clearSongNameDisplay();
        this.clearCurrentBandNameValue();
        this.removeImageDisplay();

        //9/03 Add Default Image
        this.addDefaultImageDisplay("imageOutput");

        this.removeAudioDisplay();

        //set added Media to false;
        this.isMediaAdded = false;

        this.clearHiddenBandNameValue();
        this.displayOutput(imageNameRef, "");
        //1. Change Instructions
        this.displayOutput(instructionRef, this.startMessage);
        //2. Reset Win Counter
        this.clearWinsCTRValue();
        this.displayOutput(winsCtrRef, this.winsCtr);
        //3. Reset BandName Index Value
        this.bandNameIndex = 0;
        console.log("RESETALL-GAMESCREEN: GAME OBJECT RESET TO 0: BandIndex = "+this.bandNameIndex);
        //4. Clear Hidden Band Name
        this.clearHiddenBandNameValue();
        this.clearCurrentBandNameValue();
        //5. CREATE HIDDEN BAND DISPLAY
        this.fillHiddenBandName(this.bands[this.bandNameIndex]);
        this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

        //6.Reset Remaining Guesses
        this.setRemainingGuessesValue();
        this.displayOutput(remainingGuessesRef, this.remainingGuesses);
        this.clearUserIncorrectGuessesValue();
        this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses);
    },
    /**************************************************/
    /*SETS THE HIDDEN BAND NAME AND DISPLAYS TO SCREEN*/
    /**************************************************/
    fillHiddenBandName : function(currentBand) {
        console.log("CurrentBand length = "+currentBand.length);
        for(var i = 0; i < currentBand.length; i++)
        {
            if(currentBand[i]  === " ")
            {
                this.hiddenBandName.push(" ");
                console.log("Pushed a SPACE on the queue")
            } 
            else{
                this.hiddenBandName.push("_");
                console.log("Pushed a DASH on the queue")
            } 
        }
        this.currentBand = currentBand;
        console.log("CURRENT BAND NAME = "+this.currentBand);
        console.log("HIDDENBANDNAME = "+this.hiddenBandName); 
        this.hiddenBandNameString =  this.hiddenBandName.join("");
        console.log("HIDDENBANDNAMESTRING Without Commas = "+this.hiddenBandNameString); 
      },
      getAllIndexes : function(arr, val) {
        var indexes = [], i = -1;
            while ((i = arr.indexOf(val, i+1)) != -1){
                indexes.push(i);
            }
            return indexes;
    },
    /*************************************************/
    /*Updates the hiddenBandName with the keyPressed*/
    /*************************************************/
      updateHiddenBandName: function(keyPressed, indexes){
        for(var i = 0; i < indexes.length; i++){
            this.hiddenBandName[indexes[i]] = keyPressed;
            console.log("UPDATE: Hidden BAND NAME INDEX = "+indexes[i]);
            console.log("UPDATE: key Pressed = "+keyPressed);
        }
        this.hiddenBandNameString =  this.hiddenBandName.join("");
        console.log("UPDATE: Hidden Band Name = "+this.hiddenBandName);
      },
      /*************************************************/
     /*Updates the RemainingGuesses in REAL TIME      */
    /*************************************************/
      updateRemainingGuessesRealTime : function(keyPressed){
        if(this.remainingGuesses > 0){
            this.decrementRemainingGuessesValue(keyPressed);
            console.log("UPDATEREMAININGGUESSESREALTIME: Remaining guesses = "+this.remainingGuesses);
            console.log("UPDATEREMAININGGUESSESREALTIME: GAME STATE = "+this.state);

            this.displayOutput(remainingGuessesRef, this.remainingGuesses);

            //NOTE: Only push new keys into the userGuesses array
            if(this.userIncorrectGuesses.indexOf(keyPressed) === -1){
                this.userIncorrectGuesses.push(keyPressed);
            }
            console.log("KEYPRESSED IS NOT IN THE BANDNAME, Pushing INTO USERGUESSES ARRAY: "+this.userIncorrectGuesses.toString());
            console.log("UPDATEREMAININGGUESSESREALTIME: GAME STATE = "+this.state);
            this.displayOutput(userIncorrectGuessesRef, this.userIncorrectGuesses.toString());    
       }//if
       //STEP4: If no more guesses remain set game state to loss;
       if(this.remainingGuesses === 0) {
           //gameObject.isGameEnded = false;
           this.setState(states.LOSS);
           console.log("UPDATEREMAININGGUESSESREALTIME: No remaining guesses GAME STATE = "+this.state);
            
           //STEP5:Handle LOSS CONDITION FOR NO MORE REMAINING GUESSES
           if (this.hasUserLoss() && this.remainingGuesses < 1 && (this.bandNameIndex === this.bands.length-1)) {
               console.log("GAMEEND-LOSS: WINCTR = " + this.winsCtr);
               this.setState(states.LOSS)
               this.displayEndLossGameScreen(this.lossCompleteMessage);
               this.setState(states.LOSS);
           }
           else if (this.hasUserLoss() && this.remainingGuesses < 1 && !(this.bandNameIndex === this.bands.length-1)) {
            console.log("GAMEEND-LOSS: WINCTR = " + this.winsCtr);
            this.setState(states.LOSS)
            this.displayEndLossGameScreen(this.lossMessage);
            this.setState(states.LOSS);
        }
           //gameObject.resetGame();
        }//else     
      },
      clearHiddenBandNameValue : function(){
        this.hiddenBandName  = [];
      },
      clearUserIncorrectGuessesValue : function(){
          this.userIncorrectGuesses = [];
      },
      clearCurrentBandNameValue : function(){
        this.currentband = "";
    },
      clearSongNameDisplay : function(){
          this.displayOutput(songNameRef, " ");
      },
      clearImageNameDisplay : function(){
          this.displayOutput(imageNameRef, " ");
      },
     clearUserGuessesDisplay(){
        this.displayOutput(userIncorrectGuessesRef, " ");
     }
}
 
/********************************************
 * Step6: start a listener for the enter key
 * ******************************************/
document.onkeyup = function(event) {
    var keyCode = event.code.toLowerCase();
    var keyPressed = event.key.toLowerCase();
    var three = 3;

    console.log("HAS GAME ENDED = "+gameObject.hasGameEnded());
    console.log("Key Pressed = "+keyPressed+", Key Code = "+keyCode+", State = "+gameObject.state);
    console.log("IS GAME DORMENT "+gameObject.isGameDorment());
    console.log("Has USER LOSS "+gameObject.hasUserLoss());

    //STEP6a: Handle ALL GAME SCENERIOS TO RESET THE SCREEN AFTER ENTER PRESSED
    //NOTE: REGARDLESS OF GAME STATE RECEIVED, THE GAME STATE MUST BE RETURNED TO START IN ORDER FOR KEYPRESED EVENTS TO BE REGISTERED AGAIN
    if(keyCode === "enter" && gameObject.isGameDorment() || keyCode === "enter" && gameObject.wasGameWon() || keyCode === "enter" && gameObject.hasGameEnded() || keyCode === "enter" && gameObject.hasUserLoss()){
       // console.log("--made it inside loop: STATE IS DORMENT?" + gameObject.isGameDorment());

       //HANDLE START OF GAME CONDITION
       if(gameObject.isGameDorment())
       {
           console.log("*GAME NOT ENDED AND NOT WON*: Starting Game");
           //Step6b: Set game state to start
            gameObject.setState(states.START);
            console.log("Game is started!");

          gameObject.currentBand = gameObject.bands[gameObject.bandNameIndex];
           console.log( "My current Band = "+gameObject.currentBand);
           gameObject.numOfDashes = gameObject.currentBand.length;

          //Set the hiddenBandName
          gameObject.fillHiddenBandName(gameObject.currentBand);

          //Display the hiddenBandName
         gameObject.displayOutput(hiddenBandNameRef, gameObject.hiddenBandNameString);

          //Display Remaining Guesses
          gameObject.displayOutput(remainingGuessesRef, gameObject.remainingGuesses);
       }
       //Handles Winning Condition only, not END OF GAME
       else if(gameObject.wasGameWon() && !gameObject.hasGameEnded()){
            console.log("ENTER PRESSED: GAME WAS WON");
            gameObject.displayNewGameScreen();
            console.log("LINE472: GAME STATE = "+gameObject.state);
            gameObject.setState(states.START);
            //9/01/2018: gameObject.incrementGame();
            //gameObject.displayWinGameScreen();
        }
        //Step6b: If Game ENDED Due to End of band ARRAY, No Winner: Reset all variables to 0 (winCtr=0, bandNameIndex =0, reminingGuesses= 12 , userIncorrectGuesses =[], hiddenBandName=[], but don't display them, until the START STATE condition.
        else if(gameObject.hasGameEnded() && gameObject.doesBandNamesMatch && gameObject.remainingGuesses > 0 && gameObject.bandNameIndex === gameObject.bands.length-1){
            console.log("*GAME HAS ENDED*: Starting Game");
            console.log("ENTERING IF2:RESETING ALL VARIABLE");
           //gameObject.displayResetALLGameScreen();
           gameObject.displayResetALLGameScreen();
           gameObject.setState(states.START);

        }
        else if(gameObject.hasGameEnded() && !gameObject.doesBandNamesMatch && gameObject.remainingGuesses < 1){
            console.log("*GAME HAS ENDED*: Starting Game");
            console.log("ENTERING IF2:RESETING ALL VARIABLE");
           gameObject.displayEndGameScreen();
           gameObject.setState(states.START);

        }
        //If game state is LOST, due to RemainingGuesses == 0, reset all variables, but don't display them until start condition (winCtr =0, remainingGuesses=12, userIncorrectGuesses =[], hiddenBandName=[])
        else if(gameObject.hasUserLoss()){
            console.log("*9/02/2018: USER HAS LOSS*: Starting Game");
            gameObject.displayEndGameScreen();
           gameObject.setState(states.START);
        }         
    }//if 
    /**************************************************************************************************************
    *Step7: If game state is START: And event.key is a letter or a number, then update the display in realtime
    ***************************************************************************************************************/
    else if(keyCode.substring(0,three) === "dig" || keyCode.substring(0,three)=== "key" && gameObject.state === states.START)
    {
        console.log("keyCode = "+keyCode);
        console.log("keyPressed = "+keyPressed+ "; ToUpper = "+keyPressed.toUpperCase());
        console.log("CurrentBandName = "+gameObject.currentBand);

        var isUpperCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed.toUpperCase())!==-1;
        console.log("Is Key In Band Name? "+isUpperCaseKeyInBandName);

        var isLowerCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed)!==-1;

        //Step10 Check if Key is in bandName
        if(isUpperCaseKeyInBandName && !isLowerCaseKeyInBandName){
            gameObject.updateHiddenBandNameRealTime(keyPressed.toUpperCase());
        }
        else if(isLowerCaseKeyInBandName && !isUpperCaseKeyInBandName){
            gameObject.updateHiddenBandNameRealTime(keyPressed.toLowerCase());
        }
        else if(isLowerCaseKeyInBandName && isUpperCaseKeyInBandName){
            gameObject.updateHiddenBandNameRealTime(keyPressed.toLowerCase(), keyPressed.toUpperCase());
            //gameObject.updateHiddenBandNameRealTime(keyPressed.toUpperCase());
        }
        //Step11: If key not in band name decrement remaining guesses, until there are no more guesses remaining
        else if(!isUpperCaseKeyInBandName && !isLowerCaseKeyInBandName){
            //11a: Decrement remaining guesses
           gameObject.updateRemainingGuessesRealTime(keyPressed);
        }//else
    } //Outter Else if 
}//Onkey Event
    