let deckId
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const info = document.getElementById('info');
const remaining = document.getElementById('remaining');
let computerScore = 0;
let myScore = 0;
const displayComputerScore = document.getElementById('computer-score');
const displayMyScore = document.getElementById('my-score');


async function handleClick() {
   
    const response = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/");
    const data = await response.json();
    deckId = data.deck_id
    remaining.textContent = `It remains ${data.remaining} cards`;
    if (drawCardBtn) disabledButton(data.remaining, drawCardBtn);
     

    //display button to play
    if (drawCardBtn) drawCardBtn.classList.remove('hidden');

    //reinitate the scores
    computerScore = 0
    myScore = 0

    //display texts
    displayComputerScore.textContent = `${computerScore}`;
    displayMyScore.textContent = `${myScore}`;
    remaining.textContent = `New deck!`;

}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", async () => {
    const response =  await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
    const data = await response.json()
    if (cardsContainer) {
           
        cardsContainer.children[0].innerHTML = `
            <img src=${data.cards[0].image} class="card" />
        `;
        cardsContainer.children[1].innerHTML = `
            <img src=${data.cards[1].image} class="card" />
        `;

        remaining.textContent = `It remains ${data.remaining} cards`;
        disabledButton(data.remaining, drawCardBtn);
        
       return determineCardWinner(data.cards[0], data.cards[1], data.remaining);
    
    };
       
});


function disabledButton(data, button) {
    if (data === 0) {
        button.setAttribute("disabled", "");
    }else{
        button.removeAttribute("disabled");
    }
};


function determineCardWinner(card1, card2, remaining) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    let winnerText = ''

    if(remaining > 0){
        if (card1ValueIndex > card2ValueIndex) {
            clear(info);
            computerScore ++
            winnerText = "Computer wins!";
        } else if (card1ValueIndex < card2ValueIndex) {
            clear(info);
            myScore ++
            winnerText = "You win!";
        } else {
            clear(info);
            winnerText = "War!";
        }
    }else {
        if(computerScore > myScore){
            winnerText = "Computer wins the battle!"
        }else if(computerScore < myScore){
            winnerText = "You win the battle!"
        }else{
            winnerText = "Both of you announce defaith"
        }
    }
    
    info.innerHTML = winnerText;
    displayComputerScore.innerHTML = `${computerScore}`;
    displayMyScore.innerHTML = `${myScore}`;
}

function clear(param1){
    param1.innerHTML = '';
}
