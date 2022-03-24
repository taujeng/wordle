import list from './list.js';

const data = list;

const chosenWord = data[Math.floor(Math.random() * data.length)].toLowerCase();
console.log(chosenWord);

let attempts = 1;

// Modals

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('.close-modal');
const overlay = document.querySelector('.overlay');

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // .datasets lets you access all "data" attributes as if they were js objects
    // button.dataset.modalTarget targets: data-modal-target  so we end up with "#modal"
    const modal = document.querySelector(button.dataset.modalTarget);
    modal.classList.add('active');
    overlay.classList.add('active');
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // grab the closest parent element w the class of modal
    // start at button, and start going upwards to the parents, checking if they have the modal class
    // and if so, that's what is returned
    const modal = button.closest('.modal');
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// Close Modal when Clicking on Overlay:
overlay.addEventListener('click', () => {
  // find all open modals
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach((modal) => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// Keeping track of Stats in Local Storage

function statTrack(winner, attempt, loss = 0, fail = false) {
  // brand new stats
  if (!localStorage.getItem('wordless')) {
    localStorage.setItem(
      'wordless',
      JSON.stringify({
        try: 0,
        win: 0,
        streak: 0,
        max: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      })
    );
  }
  let newData = JSON.parse(localStorage.getItem('wordless'));
  newData.win += winner;
  // If lose game, reset streak. Otherwise, + 1
  fail ? (newData.streak = 0) : (newData.streak += winner);

  if (newData.streak > newData.max) {
    newData.max = newData.streak;
  }
  newData.try += attempt;
  newData[`${attempts}`] += 1 + loss;

  localStorage.setItem('wordless', JSON.stringify(newData));

  //  Updating new Stats
  const topStat = document.getElementById('topStat');
  const playCount = document.getElementById('stats-play');
  const winStat = document.getElementById('stats-win');
  const currentStreak = document.getElementById('stats-currentStreak');
  const maxStreak = document.getElementById('stats-maxStreak');

  if (newData.try > 0) {
    topStat.innerHTML = (
      (newData[1] * 1 +
        newData[2] * 2 +
        newData[3] * 3 +
        newData[4] * 4 +
        newData[5] * 5 +
        newData[6] * 6) /
      newData.win
    ).toFixed(2);
    winStat.innerHTML = `${((newData.win / newData.try) * 100).toFixed(2)}%`;
  }

  playCount.innerHTML = newData.try;
  currentStreak.innerHTML = newData.streak;
  maxStreak.innerHTML = newData.max;

  document.getElementById(
    'stats-1attempt'
  ).innerHTML = `1 attempts: ${newData[1]}`;
  document.getElementById(
    'stats-2attempt'
  ).innerHTML = `2 attempts: ${newData[2]}`;
  document.getElementById(
    'stats-3attempt'
  ).innerHTML = `3 attempts: ${newData[3]}`;
  document.getElementById(
    'stats-4attempt'
  ).innerHTML = `4 attempts: ${newData[4]}`;
  document.getElementById(
    'stats-5attempt'
  ).innerHTML = `5 attempts: ${newData[5]}`;
  document.getElementById(
    'stats-6attempt'
  ).innerHTML = `6 attempts: ${newData[6]}`;
}

statTrack(0, 0, -1);

const Keyboard = {
  elements: {
    main: null, // main keyboard element
    keysContainer: null, //
    keys: [], // arrays of the button for the keys
  },

  // fired off when kb gets input
  eventHandlers: {
    oninput: null,
  },

  properties: {
    value: '', // current value of the kb
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    // create a div, and store it virtually in js
    this.elements.keysContainer = document.createElement('div');

    // Set up main elements: adding some classes
    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    // append the value of _createKeys() onto keysContainer
    this.elements.keysContainer.appendChild(this._createKeys());

    // Select all buttons with the class ".keyboard__keys" and store them as a nodelist/array in "keys"
    this.elements.keys =
      this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          // value of the text area is set to the value in the kb
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    // will return a document fragment (virtual elements, that other elements can
    // append to. then append the whole fragment to a diff element
    // gonna create a fragment, then return it, and then append to keysContainer
    // this will append all the keys in this fragment to the keysContainer
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'done',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      'backspace',
    ];
    // gonna loop thru keyLayout, and make a button out of ea one

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      // to make new rows in the kb:
      // if the key we're looping thru is the following, give true. otherwise false.
      // for indexOf, it returns -1 if it's NOT in the array.
      // so if true, we want to add a line break
      const insertLineBreak = ['p', 'l'].indexOf(key) !== -1;

      // Add attributes/ classes
      //  <button type="button" (adding this part)
      keyElement.setAttribute('type', 'button');
      // "keyboard__keys" is the main class all keys should have ( which is why we're
      // putting this in the loop)
      keyElement.classList.add('keyboard__key');

      //  Give ea key its own ID
      keyElement.setAttribute('id', key);

      // Figure out what key we're looping thru

      switch (key) {
        // if the current key is backspace
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          // for the spacebar, we need to clear the current value
          // this.properties.value = our keyboard constant.properties.value =""
          // look at structure of const keyboard at the top
          // this removes the last character from the current value
          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            ); // we let the kb know that the input has changed. so we need to trigger an event
            this._triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--dark'
          );
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this._checkWord();
            this.properties.value = '';
            attempts += 1;
          });

          break;

        // if none of these cases are true (aka not a special key)
        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += key.toLowerCase();
            this._triggerEvent('oninput');
          });

          break;
      }

      // the fragment is a lil container for all the keys.
      fragment.appendChild(keyElement);

      // if we need to insert a linebreak
      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    // we've looked everything, created buttons(keys), and returned them as a document fragment
    return fragment;
  },

  // trigger eventHandler from above
  _triggerEvent(handlerName) {
    // if a fx is specified in one of the properties (oninput/onclose), do this
    if (typeof this.eventHandlers[handlerName] == 'function') {
      // provide the current value to the code that is using the kb
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  // initialValue: if in your text box, there is already a word there, then kb
  // can spawn with that word
  open(initialValue, oninput) {
    // if initial value is provided, use it. if not, reset to empty
    this.properties.value = initialValue || '';
    // can specify function for oninput/onclose if you want.
    this.eventHandlers.oninput = oninput;
  },

  _checkWord() {
    let currentTry = this.properties.value.slice(0, 5);
    for (let i = 1; i <= currentTry.length; i++) {
      if (currentTry[i - 1] === chosenWord[i - 1]) {
        document
          .getElementById(`row${attempts}_letter${i}`)
          .classList.add('correct');
        document.getElementById(currentTry[i - 1]).classList.add('correct');
      } else if (chosenWord.includes(currentTry[i - 1])) {
        document
          .getElementById(`row${attempts}_letter${i}`)
          .classList.add('almost');
        document.getElementById(currentTry[i - 1]).classList.add('almost');
      } else {
        document
          .getElementById(`row${attempts}_letter${i}`)
          .classList.add('wrong');
        document.getElementById(currentTry[i - 1]).classList.add('wrong');
      }
    }
    if (currentTry === chosenWord) {
      console.log('you win');
      statTrack(1, 1);

      if (attempts === 1) {
        console.log('Cheater.');
      }
      // Upon failure/Lose Game
    } else if (attempts === 6 && currentTry != chosenWord) {
      statTrack(0, 1, -1, true);
    } else {
      console.log('wrong');
    }
  },
};

// once DOM(HTML structure) has been loaded on page, call init method.
window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
  // example of how the system will be using the kb. thru the open method
  Keyboard.open('', function (currentValue) {
    if (attempts > 6) {
      console.log('Too many tries.');
    }
    // console.log('value changed! here it is: ' + currentValue);
    if (currentValue.length < 6 && attempts < 7) {
      // Loop runs 5 times no matter what. If I did currentValue.length instead of 5, backspace
      // wouldn't update correctly.
      for (let i = 1; i <= 5; i++) {
        if (!currentValue[i - 1]) {
          document.getElementById(`row${attempts}_letter${i}`).innerHTML = '';
        } else {
          document.getElementById(`row${attempts}_letter${i}`).innerHTML =
            currentValue[i - 1];
        }
        // console.log(currentValue[i - 1], chosenWord[i - 1]);
      }
    }
  });
});
