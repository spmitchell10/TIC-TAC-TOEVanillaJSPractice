(function Game() {
    // Naming All of our elements
    let game = document.getElementById('game');
    let boxes = document.querySelectorAll('li');
    let resetGame = document.getElementById('reset-game');
    let turnDisplay = document.getElementById('whos-turn');
    let gameMessages = document.getElementById('game-messages');
    let playerOneScoreCard = document.getElementById('player-one-score');
    let playerTwoScoreCard = document.getElementById('player-two-score');
    
    // Defining our letiables and creating our empty array
    let context = { 'player1' : 'x', 'player2' : 'o' };
    let board = []; //creating our empty array
    
    let playerOneScore = 0; //setting things to 0
    let playerTwoScore = 0;
    
    let turns;
    let currentContext;
    
    // //Building our constructor
    let init = function() {
        turns = 0;
        
        // Get our current context (or state of the game)
        currentContext = computeContext();
        
        // Setup 3 x 3 board 
        board[0] = new Array(3);
        board[1] = new Array(3);
        board[2] = new Array(3);
        
        //Bind our events together with an event listener
        // this defines i / when i is pushed ++ is an increment that adds 1 to i
        for(let i = 0; i < boxes.length; i++) {
            boxes[i].addEventListener('click', clickHandler, false);
        }
        
        resetGame.addEventListener('click', resetGameHandler, false);
    }
    
    //We need to keep track of peoples turns!
    let computeContext = function() {
        return (turns % 2 == 0) ? context.player1 : context.player2;
    }
    
    // We need to bind the DOM elements to the click callback
    let clickHandler = function() {
        this.removeEventListener('click', clickHandler);
        
        this.className = currentContext;
        this.innerHTML = currentContext;
        
        let pos = this.getAttribute('data-pos').split(',');
        board[pos[0]][pos[1]] = computeContext() == 'x' ? 1 : 0;
        
        if(checkStatus()) {
            gameWon();
        }
        
        turns++;
        currentContext = computeContext();
        turnDisplay.className = currentContext;
    }
    
    
    //Now we need to see if a player has won and how they have won
    let checkStatus = function() {
        let used_boxes = 0;
        
        for(let rows = 0; rows < board.length; rows++ ) { //this sets the board empty and on event listener fills a row for the win
            let row_total = 0;
            let column_total = 0; //basically we are setting up the board as empty
            
            for(let columns = 0; columns < board[rows].length; columns++) {
                row_total += board[rows][columns]; //+= adds the strings together
                column_total += board[columns][rows];
                
                if(typeof board[rows][columns] !== "undefined") {
                    used_boxes++;
                }
            }
            
            //What is the winning combination though? It's [0,4,8], [2,4,6], etc.
            //This is the winning scenario for diagonal
            //Only way to win is if the total is 0 or if the total is 3
            //X are worth 1 point and O is worth 0 points
            let diagonal_tl_br = board[0][0] + board[1][1] + board[2][2]; // diagonal top left to bottom right
            let diagonal_tr_bl = board[0][2] + board[1][1] + board[2][0]; // diagonal top right bottom left
            
            if(diagonal_tl_br == 0 || diagonal_tr_bl == 0 || diagonal_tl_br == 3 || diagonal_tr_bl == 3) {
                return true;
            }
            
            // Winning combination for row [0,1,2], [3,4,5], [6,7,8]
            // Winning combination for column [0,3,6], [1,4,7], [2,5,8]
            // Only way to win is if the total is 0 or if the total is 3. X are worth 1 point and O are worth 0 points
            if(row_total == 0 || column_total == 0 || row_total == 3 || column_total == 3) {
                return true;
            }
            
            //What is all boxes are full and there is no winner?!?
            //Then the used boxes wourl equal 9 and that would be a draw
            if(used_boxes == 9) {
                gameDraw();
            }
        }
    }
    let gameWon = function() {
        clearEvents();
        
        // show game won message
        gameMessages.className = 'player-' + computeContext() + '-win';
        
        // update the player score
        switch(computeContext()) {
            case 'x':
                playerOneScoreCard.innerHTML = ++playerOneScore;
                break;
            case 'o':
                playerTwoScoreCard.innerHTML = ++playerTwoScore;
        }
    }
    // Now we have to tell the user when the game is a draw
    let gameDraw = function() {
        gameMessages.className = 'draw';
        clearEvents();
    }
    
    // But what if the game is a draw even before all of the boxes are clicked
    // This stops the user from clicking empty cells after the game is over or a draw
    let clearEvents = function() {
        for(let i = 0; i < boxes.length; i++) {
            boxes[i].removeEventListener('click', clickHandler);
        }
    }
    //Now we need to clear out the game array and reset to play again
    let resetGameHandler = function() {
        clearEvents();
        init();
        
        // Go over all the li nodes and remove className of either x,o
        // clear out innerHTML
        for(let i = 0; i < boxes.length; i++) {
            boxes[i].className = '';
            boxes[i].innerHTML = '';
        }
        
        // Change Who's turn class back to player1
        turnDisplay.className = currentContext;
        gameMessages.className = '';
    }
    
    game && init();
    
})();