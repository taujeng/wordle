import list from "./list.js"

const data = list;

const chosenWord = data[Math.floor(Math.random()*data.length)].toLowerCase()
console.log(chosenWord)

let attempt = 1;



const Keyboard = {
  // keep track of classes: keyboard, keyboard__keys, the keys
  elements: {
    main: null, // main keyboard element
    keysContainer: null, // 
    keys: [] // arrays of the button for the keys
  },

  // fired off when kb gets input, or when kb is closed
  eventHandlers: {
    oninput: null,
  },

  properties: {
    value: "", // current value of the kb
  },

  init() {

    // Create main elements
    this.elements.main = document.createElement("div");
    // create a div, and store it virtually in js
    this.elements.keysContainer = document.createElement("div");

    // Set up main elements: adding some classes
    this.elements.main.classList.add("keyboard");
    this.elements.keysContainer.classList.add("keyboard__keys");
    // append the value of _createKeys() onto keysContainer
    this.elements.keysContainer.appendChild(this._createKeys());

    // Select all buttons with the class ".keyboard__keys" and store them as a nodelist/array in "keys"
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key")

    // Add to DOM
    // Create that parent child relationship. keyboard -> keyboard__keys
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use kb for elemetns with .use-keyboard-input
    // for ea area with a class of .use, we'll loop thru
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      // on focus, we open up kb
      element.addEventListener("focus", () => {
        // initial value = value in text area/input
        this.open(element.value, currentValue => {
          // value of the text area is set to the value in the kb
          element.value = currentValue
        })
      })
    })
  },

  _createKeys() {
    // will return a document fragment (virtual elements, that other elements can 
    // append to. then append the whole fragment to a diff element
    // gonna create a fragment, then return it, and then append to keysContainer
    // this will append all the keys in this fragment to the keysContainer
    const fragment = document.createDocumentFragment();
    const keyLayout = [
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "a", "s", "d", "f", "g", "h", "j", "k", "l",
        "done", "z", "x", "c", "v", "b", "n", "m", "backspace",
    ];
    // gonna loop thru keyLayout, and make a button out of ea one

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      // to make new rows in the kb:
      // if the key we're looping thru is the following, give true. otherwise false.
      // for indexOf, it returns -1 if it's NOT in the array.
      // so if true, we want to add a line break
      const insertLineBreak = ["p", "l"].indexOf(key) !== -1;
      
      // Add attributes/ classes
      //  <button type="button" (adding this part)
      keyElement.setAttribute("type", "button");
      // "keyboard__keys" is the main class all keys should have ( which is why we're
      // putting this in the loop)
      keyElement.classList.add("keyboard__key");

      //  Give ea key its own ID
      keyElement.setAttribute("id", key)

      // Figure out what key we're looping thru
      
      switch (key) {
        // if the current key is backspace
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          // for the spacebar, we need to clear the current value
          // this.properties.value = our keyboard constant.properties.value =""
          // look at structure of const keyboard at the top
          // this removes the last character from the current value
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);            // we let the kb know that the input has changed. so we need to trigger an event
            this._triggerEvent("oninput");
          })  
          
          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this._checkWord()
            this.properties.value = ""
            attempt += 1
          })  

          break;

          // if none of these cases are true (aka not a special key)
          default:
            keyElement.textContent = key.toLowerCase();

            keyElement.addEventListener("click", () => {
              this.properties.value += key.toLowerCase();
              this._triggerEvent("oninput");
            });

            break;
      }

      // the fragment is a lil container for all the keys.
      fragment.appendChild(keyElement);

      // if we need to insert a linebreak
      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    })

    // we've looked everything, created buttons(keys), and returned them as a document fragment
    return fragment;
  },

  // trigger eventHandler from above
  _triggerEvent(handlerName) {
    // if a fx is specified in one of the properties (oninput/onclose), do this
    if (typeof this.eventHandlers[handlerName] == "function") {
      // provide the current value to the code that is using the kb
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  // initialValue: if in your text box, there is already a word there, then kb
  // can spawn with that word
  open(initialValue, oninput) {
    // if initial value is provided, use it. if not, reset to empty
    this.properties.value = initialValue || "";
    // can specify function for oninput/onclose if you want.
    this.eventHandlers.oninput = oninput;
  },

  _checkWord() {
    let currentTry = this.properties.value.slice(0,5)
    for (let i = 1; i <= currentTry.length; i++) {
      if (currentTry[i-1] === chosenWord[i-1]) {
          document.getElementById(`row${attempt}_letter${i}`).classList.add("correct")
          document.getElementById(currentTry[i-1]).classList.add("correct")
        } else if (chosenWord.includes(currentTry[i-1])) {
          document.getElementById(`row${attempt}_letter${i}`).classList.add("almost")
          document.getElementById(currentTry[i-1]).classList.add("almost")
        }
    }
    if (currentTry === chosenWord) {
      console.log("you win")
      if (attempt === 1) {
        console.log("Cheater.")
      }
    } else {
      console.log("wrong")
    }
  }
};

  // once DOM(HTML structure) has been loaded on page, call init method.
window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  // example of how the system will be using the kb. thru the open method
  Keyboard.open("", function(currentValue) {
    if (attempt > 6) {
      console.log("Too many tries.")
    }
    console.log("value changed! here it is: " + currentValue);
    if (currentValue.length < 6 && attempt < 7) {
      // Loop runs 5 times no matter what. If I did currentValue.length instead of 5, backspace
      // wouldn't update correctly. 
      for (let i = 1; i <= 5; i++ ) {
        if (!currentValue[i-1]) {
          document.getElementById(`row${attempt}_letter${i}`).innerHTML = "";
        } else {
          document.getElementById(`row${attempt}_letter${i}`).innerHTML = currentValue[i-1];
        }
        console.log(currentValue[i-1], chosenWord[i-1]) 
      }
    }

  });
});
