 //Step2: Create a reference variable to all the html output elements.
 var songNameRef = document.getElementById('songNameOutput');
 var imageNameRef = document.getElementById('imageNameOutput');
/* var imageRef = document.getElementById('imageOutput');*/
 /*var audioRef = document.getElementById('audioOutput');*/
 var winsCtrRef = document.getElementById('winsCtrOutput');
 var hiddenBandNameRef = document.getElementById('hiddenBandNameOutput');
 var remainingGuessesRef = document.getElementById('remainingGuessesOutput');
 var userGuessesRef = document.getElementById('userGuessesOutput');
 var instructionRef = document.getElementById('instructionOutput');
 var states = {
    START : "start",
    WIN : "win",
    LOSE : "lose", //user ran out of remainingGuesses
    END: "end",  //user got to the end of the bandNames, or score equals length of bandnames.
    DORMENT : "dorment"
    };
    //var states = new enums.Enum("start", "lose", "end", "dorment");
 //var startKey;

 //Step3: Create Game Object
var gameObject = {
    //Push space on twice, so it seperates the words appropriately when displayed to screen after the .join
    bands :["The Gap Band", "War", "The Jackson 5", "Parliament", "Ohio  Players", "Lakeside", "james Brown", "Sly And The Family Stone", "Kool And The Gang", "Earth Wind And Fire"],
    songs : ["Party Train", "Slippin Into Darkness", "ABC", "Flashlight", "I Want To Be Free", "Fantastic Voyage", "The Payback", "Sing A Simple Song", "Get Down On It", "Lets Groove Tonight"],
    imageID : "bandImage",
    audioID: "audioImage",
    bandNameIndex : 0,
    winMessage : "You win!  Press Enter to play again.",
    loseMessage : "You loss!  Press Enter to play again.",
    startMessage: "Press a key to make a guess.",
    dormentMessage: "Guess the band name. Press Enter to play.",
    winsCtr : 0,
    gamesPlayed : 0,
    remainingGuesses : 12,
    currentBand : "none",
    numOfDashes : 0,
    userIncorrectGuesses : [],
    audioName : [],
    hiddenBandName : [],
    hiddenBandNameString : "none",
    //isGameEnded : false,
    isIndexFound : false,
    state : states.DORMENT,
    setState : function (state){
        this.state = state;
        switch(state) {
            case states.WIN:
                this.displayOutput(instructionRef, this.winMessage);
                break;
                //return "rot";
            case states.LOSE:
                this.displayOutput(instructionRef, this.loseMessage);
                break;
                //return "grün";
            case states.START:
                this.displayOutput(instructionRef, this.startMessage);
                break;
                //return "blau";
            case states.DORMENT:
                this.displayOutput(instructionRef, this.dormentMessage);
                break;
        }
    },
    isGameWon : function(){
        if(this.hiddenBandNameString === this.currentBand){
            console.log("*WIN CONDITION IS TURE*");
            this.setState(states.WIN);
            this.winsCtr++;
            this.displayOutput(winsCtrRef, this.winsCtr);
            this.displayOutput(songNameRef, this.songs[this.bandNameIndex]);
            this.displayImage("imageOutput");
            this.playAudio("audioOutput");
            //this.displayImage();

        }
    },
    /*displayImage : function(){
        var img = document.createElement('img');
        var imageName = this.hiddenBandName.join("");

        //Output Image to page
        this.displayOutput(imageNameRef, imageName);
            imageName = "assets/images/"+imageName.replace(/\s/g,'')+".jpg";
            console.log("IMAGE NAME = "+imageName);
        img.src = imageName;

        document.getElementById("imageOutput").appendChild(img);
        
    },*/
    //imageName : "assets/images/"+this.hiddenBandName.join("").replace(/\s/g,'')+".jpg",
    displayImage : function(Id) {
        //this.imageID = imageID;
        var imageName = this.hiddenBandName.join("");
        var imageSource = "assets/images/"+imageName.replace(/\s/g,'')+".jpg";
        var img = document.createElement("IMG");
        img.src = imageSource;
        img.setAttribute('id', this.imageID);
        document.getElementById(Id).appendChild(img);
        return this.imageId;
    },
    removeImage() {
        var elementToBeRemoved = document.getElementById(this.imageID);
        elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
    },
    playAudio : function(Id) {
        //this.imageID = imageID;
        this.audioName = this.songs[this.bandNameIndex];
        console.log("AUDIO FILE NAME = "+this.audioName);
        //var audioName = this.audioName.join("");
        var audioSource = "assets/audio/"+this.audioName.replace(/\s/g,'')+".mp3";
        console.log("Audio File Name with ext = "+audioSource);
        var audio = document.createElement("audio");
        audio.src = audioSource;
        audio.setAttribute('id', this.audioID);
        document.getElementById(Id).appendChild(audio);
        audio.play();
        return this.audioId;
    },
    removeAudio() {
        var elementToBeRemoved = document.getElementById(this.audioID);
        elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
    },
    //increment the game to the next band in the array
    /********************************************** */
    incrementGame : function(){

        //Step1: Reset guesses to 12
        //this.resetRemainingGuesses();

        //Step2: Clear HiddenBandName
        //this.clearCurrentBandName();

        //Step3: increment BandNameIndex
        if(this.bandNameIndex < 10){
            this.bandNameIndex++;
        }
        else{
            this.bandNameIndex = 0;
        }
        //Step4: clear the userGuessesArray
        this.clearUserIncorrectGuesses();
        this.clearSongName();
        this.clearImageName();
        this.clearHiddenBandName();
        this.clearCurrentBandName();
        this.resetRemainingGuesses();
        this.removeImage();
        this.removeAudio();
        this.state = states.START;
    },
    updateGameVariables : function(keyPressed){
        //Step10a: Get all the indexes where the keypressed occurs
        var indexes = this.getAllIndexes(this.currentBand , keyPressed);
           
        //console.log ("Is index in array "+this.isKeyPressedFound(indexes));
        
        //Setp10b: If keypressed is in array then update display
            this.updateHiddenBandName(keyPressed, indexes);
             this.displayOutput(hiddenBandNameRef, this.hiddenBandNameString);

             //Step 10c: Check if game won
             this.isGameWon();
    },
    decrementRemainingGuesses : function(keyPressed){
        if(this.userIncorrectGuesses.indexOf(keyPressed) > -1){
            //don't decrement remainingGuesses if key has already been clicked
        }
        else
        {
            this.remainingGuesses=this.remainingGuesses-1;
        }
    },
    resetRemainingGuesses : function(){
        this.remainingGuesses = 12;
    },
    displayOutput : function(outputElement, value){
        outputElement.textContent = value;
    },
    fillHiddenBandName : function(currentBand) {
       // this.clearCurrentBandName();
        //this.clearHiddenBandName();
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
        console.log("HIDDENBANDNAME Without Commas = "+this.hiddenBandNameString);
        
      },
      getAllIndexes : function(arr, val) {
        var indexes = [], i = -1;
            while ((i = arr.indexOf(val, i+1)) != -1){
                indexes.push(i);
            }
            return indexes;
        //}//if
        /*Removed while*/
    },
    /*isKeyPressedFound : function(indexes){
        if(indexes.length > 0){
            this.isIndexFound = true;
        }
        else this.isIndexFound = false;
        return this.isIndexFound;
    },*/
      updateHiddenBandName: function(keyPressed, indexes){
        for(var i = 0; i < indexes.length; i++){
            this.hiddenBandName[indexes[i]] = keyPressed;
            console.log("UPDATE: Hidden BAND NAME INDEX = "+indexes[i]);
            console.log("UPDATE: key Pressed = "+keyPressed);
        }
        this.hiddenBandNameString =  this.hiddenBandName.join("");
        console.log("UPDATE: Hidden Band Name = "+this.hiddenBandName);
      },
      clearHiddenBandName : function(){
        this.hiddenBandName  = [];
      },
      clearUserIncorrectGuesses : function(){
          this.userIncorrectGuesses = [];
          this.displayOutput(userGuessesRef, " ");
      },
      clearSongName : function(){
          this.displayOutput(songNameRef, " ");
      },
      clearImageName : function(){
          this.displayOutput(imageNameRef, " ");
      },
      clearAllBandNames : function(){
        this.displayOutput(hiddenBandNameRef, " ");
        this.hiddenBandNameString = " ";
        this.clearCurrentBandName();
        this.clearHiddenBandName();
      },
      clearCurrentBandName : function(){
          this.currentband = " ";
      },
      /*removeImage : function(id) {
        var imageToBeRemoved = document.getElementById(id);
        imageToBeRemoved.removeChild(imageToBeRemoved);
    }*/
    
    
};
 
//Step4 start a listener for the enter key
document.onkeyup = function(event) {
    var keyCode = event.code.toLowerCase();
    var keyPressed = event.key.toLowerCase();
    var three = 3;
    //console.log("KeyCode = "+keyCode);
    if(keyCode !== "enter") {
        //console.log("KeyCode Enter = "+keyCode);
        //console.log("State = "+gameObject.state);

        //Step4a: Set game state
        if(gameObject.state === states.DORMENT)
        {
            console.log("STATE CHECK IS DORMENT");
            gameObject.setState(gameObject.state);
        }
    }
    //Step5: Determine if game has started
    //if(keyCode === "enter") 

    //Step6: Initialize all game variables if the game just started
    var wasLastGameWon =  gameObject.state === states.WIN;
    if(keyCode === "enter" && gameObject.state === states.DORMENT || keyCode === "enter" && wasLastGameWon){

        if(wasLastGameWon)
        {
            gameObject.incrementGame();
        }
        //Step6a: Set game state to start
        gameObject.setState(states.START);
        console.log("Game is started!");
        //Step7: Create an outter loop to cycle through the bandNames
        //for (var i = 0; i < 1/*gameObject.bands.length*/; i++) 
        //var i = 0;

           // console.log("I = " + i);
            //Step6: Intialize all gameObject variables
            gameObject.gamesPlayed++;//Must reset when bands.length is 10
           // gameObject.currentBand = gameObject.bands[i].toLowerCase();
           gameObject.currentBand = gameObject.bands[gameObject.bandNameIndex];
            console.log( "My current Band = "+gameObject.currentBand);
            gameObject.numOfDashes = gameObject.currentBand.length;

           //Set the hiddenBandName
           gameObject.fillHiddenBandName(gameObject.currentBand);

           //Display the hiddenBandName
          // gameObject.displayHiddenBandName();
          gameObject.displayOutput(hiddenBandNameRef, gameObject.hiddenBandNameString);

           //Display Remaining Guesses
           gameObject.displayOutput(remainingGuessesRef, gameObject.remainingGuesses);
       // }//for
    }//if 
    //Step8: If game has already started and event.key is a letter or a number, then update the display
    else if(keyCode.substring(0,three) === "dig" || keyCode.substring(0,three)=== "key" && gameObject.state === states.START)
    {
        console.log("keyCode = "+keyCode);
        console.log("keyPressed = "+keyPressed+ "; ToUpper = "+keyPressed.toUpperCase());
        console.log("CurrentBandName = "+gameObject.currentBand);

        var isUpperCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed.toUpperCase())!==-1;
        console.log("Is Key In Band Name? "+isUpperCaseKeyInBandName);

        var isLowerCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed)!==-1;

        //Step10 Check if Key is in bandName
        if(isUpperCaseKeyInBandName){
            gameObject.updateGameVariables(keyPressed.toUpperCase());
        }
        else if(isLowerCaseKeyInBandName){
            gameObject.updateGameVariables(keyPressed.toLowerCase());
        }
        //Step11: If key not in band name decrement remaining guesses, until there are no more guesses remaining
        else{
            //11a: Decrement remaining guesses
            if(gameObject.remainingGuesses > 0){
                gameObject.decrementRemainingGuesses(keyPressed);
                console.log("Remaining guesses = "+gameObject.remainingGuesses);
                gameObject.displayOutput(remainingGuessesRef, gameObject.remainingGuesses);

                //12b: Only push new keys into the userGuesses array
                if(gameObject.userIncorrectGuesses.indexOf(keyPressed) === -1){
                    gameObject.userIncorrectGuesses.push(keyPressed);
                }
                console.log("KEYPRESSED IS NOT IN THE BANDNAME, Pushing INTO USERGUESSES ARRAY: "+gameObject.userIncorrectGuesses.toString());
                gameObject.displayOutput(userGuessesRef, gameObject.userIncorrectGuesses.toString());    
           }//if
           //11b: If no more guesses remain game is over resetGame;
           else {
               //gameObject.isGameEnded = false;
               gameObject.setState(states.LOSE);
               //gameObject.resetGame();
            }//else     
        }//else
    } //Outter Else if  
}//Onkey Event
    