document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const resetButton = document.getElementById('reset-button');
    const clearScoreButton = document.getElementById('clear-score-button');
    const scoreBoardX = document.querySelector('.score-count[data-player="X"]');
    const scoreBoardO = document.querySelector('.score-count[data-player="O"]');
    const scorePlayerX = document.getElementById('score-X');
    const scorePlayerO = document.getElementById('score-O');

    // Modal Elements
    const modal = document.getElementById('victory-modal');
    const modalText = document.getElementById('modal-text');
    const modalNextRoundButton = document.getElementById('modal-next-round');
    const modalCloseButton = document.querySelector('.close-button');


    // Game State Variables
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let scores = { X: 0, O: 0 }; // Initialize scores

    // Winning Combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Utility Functions ---

    // Update the visual score board
    const updateScoresDisplay = () => {
        scoreBoardX.textContent = scores.X;
        scoreBoardO.textContent = scores.O;
    };

    // Toggle active player styling on the score board
    const updateActivePlayerDisplay = () => {
        if (currentPlayer === "X") {
            scorePlayerX.classList.add('active-turn');
            scorePlayerO.classList.remove('active-turn');
            statusMessage.style.color = "var(--neon-red)";
        } else {
            scorePlayerO.classList.add('active-turn');
            scorePlayerX.classList.remove('active-turn');
            statusMessage.style.color = "var(--neon-blue)";
        }
    };


    // --- Core Game Logic ---

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameBoard[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        // Place marker with a smooth visual effect
        setTimeout(() => {
            gameBoard[clickedCellIndex] = currentPlayer;
            clickedCell.textContent = currentPlayer;
            clickedCell.classList.add(currentPlayer);
            clickedCell.classList.add('taken');
            handleResultValidation();

            if (gameActive) {
                switchPlayer();
            }
        }, 50); // Small delay for effect
    };


    const handleResultValidation = () => {
        let roundWon = false;
        let winConditionIndices = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const [a, b, c] = winCondition.map(index => gameBoard[index]);

            if (a && a === b && b === c) {
                roundWon = true;
                winConditionIndices = winCondition;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            highlightWinningCells(winConditionIndices);
            
            // Update score and show modal
            scores[currentPlayer]++;
            updateScoresDisplay();
            showModal(`Player ${currentPlayer} Wins! 👑`);
            return;
        }

        // Check for a Draw
        let roundDraw = !gameBoard.includes("");
        if (roundDraw) {
            gameActive = false;
            showModal(`It's a Draw! 🤝`);
            return;
        }
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusMessage.textContent = `Player ${currentPlayer}'s Turn!`;
        updateActivePlayerDisplay();
    };


    // --- Reset and Clear Functions ---

    // Reset the board for a new round (does not clear scores)
    const handleResetRound = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        // Start next round with the loser/previous turn player (optional rule)
        // For simplicity, we keep the previous current player to start.
        statusMessage.textContent = `Player ${currentPlayer}'s Turn!`;
        updateActivePlayerDisplay();

        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('X', 'O', 'taken', 'winning-cell');
        });

        modal.style.display = "none"; // Hide modal if it's visible
    };

    // Clear all scores and start fresh
    const handleClearScores = () => {
        scores = { X: 0, O: 0 };
        updateScoresDisplay();
        handleResetRound(); // Reset the board as well
        // Force start with X after clearing scores
        currentPlayer = "X";
        statusMessage.textContent = `Player ${currentPlayer}'s Turn!`;
        updateActivePlayerDisplay();
    };


    // --- Visual/Modal Functions ---

    const highlightWinningCells = (winCondition) => {
        winCondition.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    };

    const showModal = (message) => {
        modalText.textContent = message;
        modal.style.display = "block";
    };


    // --- Event Listeners and Initial Setup ---

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Reset button will now call handleResetRound
    resetButton.addEventListener('click', handleResetRound);
    modalNextRoundButton.addEventListener('click', handleResetRound);
    modalCloseButton.addEventListener('click', () => { modal.style.display = "none"; });

    // New button to clear scores
    clearScoreButton.addEventListener('click', handleClearScores);

    // Close modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Initial setup
    updateScoresDisplay();
    updateActivePlayerDisplay();
});