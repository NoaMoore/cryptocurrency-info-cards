"use strict";

// This is the main function that receives the data and the other functions:
let data=[]
async function init() {
    data = await getAllCoins();
    homePage(data);
    openModal(data);
    removeSixCoin(data);
};
init();

// This is the function that contains the home page:
function homePage(arr) {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = '';
    cardContainer.addEventListener('click', e => {
        const { target } = e;
        if (target.matches('button.btnInfo')) {  
        }
    });

    arr.forEach(coin => {
        if(coin.id.includes(" ")){
            let x = (coin.id).replaceAll(' ', '');
            let index=  data.findIndex( (element) => element.id === coin.id);  
            data[index].id = x
            }
        if(coin.id.includes("[")){
            let x = (coin.id).replaceAll('[', '');
            let index=     data.findIndex( (element) => element.id === coin.id);      
            data[index].id = x
            }
        if(coin.id.includes("]")){
            let x = (coin.id).replaceAll(']', '');
            let index=     data.findIndex( (element) => element.id === coin.id);          
            data[index].id = x
            }

        var card = getHtmlCard(coin);
        cardContainer.appendChild(card);        
    });

    document.querySelector('form[class="d-flex"]').addEventListener('submit', clickHandlerSearch);
};

// This is the function that manages the search:
function clickHandlerSearch() {
    const searchField = document.querySelector('input[type="search"]');
    const searchSymbol = searchField.value.toLowerCase();
    if (searchSymbol !== "") {
        const filteredCoins = data.filter(coin => coin.symbol.toLowerCase() === searchSymbol);
        homePage(filteredCoins);
    }
    else
        homePage(data);
};

// This is the function that generates all the cards:
function getHtmlCard(coin) {
    const cardDiv = document.createElement("div")
    cardDiv.classList.add("col-12", "col-md-6", "col-lg-4");
    cardDiv.innerHTML = `
    <div class="card" id="card1" style="width: 350px;">
    <div class="card-body">
        <div class="checkboxDiv">
            <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" name:"selectedCard" role="switch" id="flexSwitchCheckChecked${coin.id}" change="openModal()" unchecked>
            </div>
        </div>
        <h5 class="card-title">${coin.symbol}</h5>
        <p>${coin.name}</p>
        <p class="d-inline-flex gap-1">
            <button class="btn btn-primary btnInfo" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseExample${coin.id}" aria-expanded="false"
                aria-controls="collapseExample${coin.id}">More Info</button>
        </p>
        <div class="collapse" id="collapseExample${coin.id}">
            <div class="card card-body">
                <p>Market Price (USD): <span id="priceUSD${coin.id}">Loading...</span></p>
                <p>Market Price (EUR): <span id="priceEUR${coin.id}">Loading...</span></p>
                <p>Market Price (ILS): <span id="priceILS${coin.id}">Loading...</span></p>
                <div>Image: <span id="image${coin.id}"></span></div>
            </div>
        </div>
        
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                    <div class="modal-title fs-5" id="exampleModalLabel"> You can only select 5 coins to display</div>
                    </div>
                    <div>Remove one coin:</div>
                
                    <div class="modal-body">
                    <div id="selectedCoins">

                    </div>

                    </div>
                
                
                    <div class="modal-footer">
                        <button type="button" id="cancel" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" id="save" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
`;

//   Here the information of each currency will appear by clicking on the more info button:
    cardDiv.querySelector(`#collapseExample${coin.id}`).addEventListener('show.bs.collapse', async function () {
        const coinInfo = await getInfoCoins(coin.id);
        if (coinInfo) {
            document.getElementById(`priceUSD${coin.id}`).innerHTML = coinInfo.market_data.current_price.usd + '$';
            document.getElementById('priceEUR' + coin.id).innerHTML = coinInfo.market_data.current_price.eur + '€';
            document.getElementById('priceILS' + coin.id).innerHTML = coinInfo.market_data.current_price.ils + '₪';
            document.getElementById('image' + coin.id).innerHTML = '';
            const image = document.createElement('img');
            image.src = coinInfo.image.small;
            document.getElementById(`image` + coin.id).appendChild(image);
        }

    });
    return cardDiv;
};

// This is the function that opens the model window by clicking on the sixth checkbox:
const selectedCoins = [];
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
function openModal(arr) {

    for (let coin of arr) {
        let checkbox1 = document.getElementById(`flexSwitchCheckChecked${coin.id}`);
        checkbox1.addEventListener('change', function () {
            removeSelectedCoin(arr)
        });
    }
};

// This is the function that is performed by pressing the button: cancel:
function removeSixCoin(arr) {
    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener('click', function () {
        const selectedCoins = [];
        for (let coin of arr) {
            let checkbox = document.getElementById(`flexSwitchCheckChecked${coin.id}`);
            if (checkbox.checked) {
                selectedCoins.push(coin);
                if (selectedCoins.length >= 6) {
                        checkbox.checked = false;
                    break;
                }
            }
        }
        myModal.hide();
    });
};

// This is the function where one coin is removed in the model window:
function removeSelectedCoin(arr) {

    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    const selectedCoins = [];
    for (let coin of arr) {
        let checkbox = document.getElementById(`flexSwitchCheckChecked${coin.id}`);
        if (checkbox.checked) {
            selectedCoins.push(coin);
            if (selectedCoins.length >= 6) {
             
                myModal.show();
                break;
            }
        }
    }

    // Here the radio buttons will be created with the names of the selected coins:
    const selectedCoinsDiv = document.getElementById('selectedCoins');
    selectedCoinsDiv.innerHTML = '';
    selectedCoins.forEach((coin, index) => {
        const radioDiv = document.createElement('div');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'selectedCoin';
        radioInput.value = coin.id;
        radioInput.classList = "radio"

        const label = document.createElement('label');
        label.textContent = coin.symbol;

        selectedCoinsDiv.appendChild(radioInput);
        selectedCoinsDiv.appendChild(label)
        selectedCoinsDiv.appendChild(radioDiv);
    });

    // This is the function that is performed by pressing the button: save change:
    const saveButton = document.getElementById("save");
    saveButton.addEventListener('click', function () {
    const selectedCoinRadio = document.querySelector('input[name="selectedCoin"]:checked');
        if (selectedCoinRadio) {
            const coinId = selectedCoinRadio.value;
            const checkbox = document.getElementById(`flexSwitchCheckChecked${coinId}`);
            if(checkbox){
            checkbox.checked = false;
            }
            myModal.hide();
        }
    });
};












    


    






























