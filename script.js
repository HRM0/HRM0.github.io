/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.querySelector("#coffee_counter").innerText = coffeeQty
}

function clickCoffee(data) {
 data.coffee += 1
 updateCoffeeView(data.coffee)
 renderProducers(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.map(element => {
    if (element.price *.5 <= coffeeCount) {
      element.unlocked = true
    }
  })
}

function getUnlockedProducers(data) {
  return data.producers.filter(el => el.unlocked )
}

function makeDisplayNameFromId(id) {
  return id.split("_").map(el => el = el[0].toUpperCase()+el.slice(1).toLowerCase()).join(" ") 
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
    <button type="button" id="sell_${producer.id}">Sell</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  let prodCont = document.getElementById("producer_container")
  unlockProducers(data.producers,data.coffee)
  deleteAllChildNodes(prodCont)
  getUnlockedProducers(data).map(el => prodCont.appendChild(makeProducerDiv(el)))

}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.filter(el => el.id ===producerId)[0]
}

function canAffordProducer(data, producerId) {
  return data.coffee >= getProducerById(data, producerId).price
}

function updateCPSView(cps) {
  document.getElementById("cps").innerText = cps
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice*1.25)
}

function attemptToBuyProducer(data, producerId) {
  let canAfford = canAffordProducer(data, producerId)
  let producer = getProducerById(data, producerId)

  if (canAfford) {
    producer.qty += 1
    data.coffee -= producer.price
    producer.price = updatePrice(producer.price)
    data.totalCPS += producer.cps
  }

  return canAfford
}

function attemptToSellProducer(data, producerId) {
  let producer = getProducerById(data, producerId)
  let haveProducer = producer.qty>=1

  if (haveProducer) {
    producer.qty -= 1
    data.coffee += Math.ceil(producer.price*.5)
    producer.price = Math.ceil(producer.price/1.25)
    data.totalCPS -= producer.cps
  }

  return haveProducer
}

function buyButtonClick(event, data) {

  if(event.target.tagName != "BUTTON"||event.target.id[0] != "b"){
    return
  }

  let canAfford = canAffordProducer(data, event.target.id.slice(4))

  if(canAfford){
    attemptToBuyProducer(data, event.target.id.slice(4))
    renderProducers(data)
    updateCPSView(data.totalCPS)
    updateCoffeeView(data.coffee)
  } else {
    window.alert("Not enough coffee!")
  }
}

function sellButtonClick(event, data) {

  if(event.target.tagName != "BUTTON"){
    return
  }
  
  let producer = getProducerById(data, event.target.id.slice(5))

  console.log(producer)
  if(producer.qty>=1){
    attemptToSellProducer(data, event.target.id.slice(5))
    renderProducers(data)
    updateCPSView(data.totalCPS)
    updateCoffeeView(data.coffee)
  } else {
    window.alert("Nothing to Sell!")
  }
}

function tick(data) {
  data.coffee += data.totalCPS
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    
    if (event.target.id[0]== "b"){
      buyButtonClick(event, data);
    } else if(event.target.id[0]== "s"){
      sellButtonClick(event, data);
    }
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
