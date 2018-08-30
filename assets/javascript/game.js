 //Step2: Create a reference variable to all the html output elements.
 var songNameRef = document.getElementById('songNameOutput');
 var imageNameRef = document.getElementById('imageNameOutput');
 var winsCtrRef = document.getElementById('winsCtrOutput');
 var hiddenBandNameRef = document.getElementById('hiddenBandNameOutput');
 var remainingGuessesRef = document.getElementById('remainingGuessesOutput');
 var userGuessesRef = document.getElementById('userGuessesOutput');
 var startKey;

 //Step3: Create Game Object
var gameObject = {
    //Push space on twice, so it seperates the words appropriately when displayed to screen after the .join
    bands :["The  Gap  Band", "War", "The  Jackson  5", "Parliament", "Ohio  Players", "Lakeside", "James  Brown"],
    songs : ["Party Train", "Slippin' Into Darkness", "ABC", "Flashlight", "I Want To Be Free", "Fantastic Voyage", "The Payback", "Sing A Simple Song", "Get Down On It", "Let's Groove Tonight"],
    gamesPlayed : 0,
    currentBand : "none",
    numOfDashes : 0,
    hiddenBandName : [],
   hiddenBandNameString : "none",
   //hiddenBandNameToDisplay : "none",
    isGameStarted : false,
    isGameEnded : false,
    fillHiddenBandName : function(currentBand) {
        this.clearCurrentBandName();
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
        //this.hiddenBandNameToDisplay = this.hiddenBandName.join(" ");
        this.hiddenBandNameString =  this.hiddenBandName.join(" ");
        //console.log("HIDDENBANDNAME Without Commas = "+this.hiddenBandNameToDisplay);
        console.log("HIDDENBANDNAME Without Commas = "+this.hiddenBandNameToString);
        //this.hiddenBandNameToDisplay = this.hiddenBandName.join(" ");
        this.hiddenBandNameToDisplay = this.hiddenBandNameString;
        
      },
      displayHiddenBandName : function(){
       hiddenBandNameRef.textContent = this.hiddenBandName.join(" ");

       console.log("DISPLAY: hiddenBandName ="+ this.hiddenBandName.join(" "));
      },
      getAllIndexes : function(arr, val) {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) != -1){
            indexes.push(i);
        }
        return indexes;
    },
      updateHiddenBandName: function(keyPressed, indexes){
        for(var i = 0; i < indexes.length; i++){
            this.hiddenBandName[indexes[i]] = keyPressed;
            console.log("UPDATE: Hidden BAND NAME INDEX = "+indexes[i]);
            console.log("UPDATE: key Pressed = "+keyPressed);
        }
        console.log("UPDATE: Hidden Band Name = "+this.hiddenBandName);
      },
      clearCurrentBandName : function(){
        this.hiddenBandName  = [];
      }
};
 
//Step4 start a listener for the enter key
document.onkeyup = function(event) {
    var keyCode = event.code.toLowerCase();
    var keyPressed = event.key.toLowerCase();
    var three = 3;
    //console.log("KeyCode = "+keyCode);
    if(keyCode === "enter") console.log("KeyCode Enter = "+keyCode);

    //Step5: Determine if game has started
    //if(keyCode === "enter") 

    //Step6: Initialize all game variables if the game just started
    if(keyCode === "enter" && !gameObject.isGameStarted){
        gameObject.isGameStarted = true;
        console.log("Game is started!");
        //Step7: Create an outter loop to cycle through the bandNames
        //for (var i = 0; i < 1/*gameObject.bands.length*/; i++) 
        var i = 0;

           // console.log("I = " + i);
            //Step6: Intialize all gameObject variables
            gameObject.gamesPlayed++;//Must reset when bands.length is 10
           // gameObject.currentBand = gameObject.bands[i].toLowerCase();
           gameObject.currentBand = gameObject.bands[i];
            console.log( "My current Band = "+gameObject.currentBand);
            gameObject.numOfDashes = gameObject.currentBand.length;
           //Set the hiddenBandName
           gameObject.fillHiddenBandName(gameObject.currentBand);
           //Display the hiddenBandName
           gameObject.displayHiddenBandName();
       // }//for
    }//if 
    //Step8: If game has already started and event.key is a letter or a number, then update the display
    else if(keyCode.substring(0,three) === "dig" || keyCode.substring(0,three)=== "key" && gameObject.isGameStarted)
    {
        console.log("keyCode = "+keyCode);
        console.log("keyPressed = "+keyPressed+ "; ToUpper = "+keyPressed.toUpperCase());
        console.log("CurrentBandName = "+gameObject.currentBand);

        var isUpperCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed.toUpperCase())!==-1;
        console.log("Is Key In Band Name? "+isUpperCaseKeyInBandName);

        var isLowerCaseKeyInBandName = gameObject.currentBand.indexOf(keyPressed)!==-1;
        //Step10: update uppercase and lowercase letters found
        if(isUpperCaseKeyInBandName)
        {
            //Step10a: Get all the indexes where the keypressed occurs
           var indexes = gameObject.getAllIndexes(gameObject.currentBand , keyPressed.toUpperCase());
           for(var i=0; i<indexes.length; i++){
               console.log("Key found at Index: "+indexes[i]);
           }
            gameObject.updateHiddenBandName(keyPressed.toUpperCase(), indexes);
            gameObject.displayHiddenBandName();
        }//if
        else if(isLowerCaseKeyInBandName)
        {
            //Step10a: Get all the indexes where the keypressed occurs
            var indexes = gameObject.getAllIndexes(gameObject.currentBand , keyPressed);
            for(var i=0; i<indexes.length; i++){
                console.log("Key found at Index: "+indexes[i]);
            }
            gameObject.updateHiddenBandName(keyPressed, indexes);
            gameObject.displayHiddenBandName();
        }//else if
    } //Outter Else if  
}//Onkey Event
    