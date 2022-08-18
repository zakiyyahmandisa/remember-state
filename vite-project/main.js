
import './style.css';
import {database} from "./database";

class Store {
  constructor(init) {
    const self = this;
    this.subscribers = [];
database.then(async(db) =>{
  this.db = db;
  const check = await db.get('comment', 'comment');
  if(check){
    this.set('comment', check)
  }
})

    this.state = new Proxy(init, {
    async set(state, key, value) {
        state[key] = value;
        if (self.db){
          await self.db.put("comment",value[value.length-1])}
      
        self.subscribers.forEach((subscriber) => subscriber(state));
  
      },
    });
    
  }

  

  subscribed(cb) {
    if (typeof cb !== "function") {
      throw new Error("You must subscribe with a function");
    }
    this.subscribers.push(cb);
  } 

  comment(state, val) {
    let newState = state.comments.push(val);
    this.state = Object.assign(this.state, state);
  }

  getComment() {
    return this.state.comments;
  }
}

const store = new Store({ comments: [] });

store.subscribed((state) => {
  let commentState = state.comments;
  commentState.forEach((stateComments) => document.body.appendChild(stateComments));
});

class Comment extends HTMLElement {
  constructor() {
    super();
    this.name = '';
    this.email = '';
    this.comment = '';
    this.date = Date.now();
  }

  static get observedAttributes() {
    return ['name', 'email', 'comment'];
  }

  // invoked when one of the custom element's attributes is added, removed, or changed
  attributeChangedCallback(attributeName, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }
    // bracket b/c we dont know exactly what attributename is name, email, comment
    this[attributeName] = newVal;
  }
 
  // connects to hmtl template
  connectedCallback() {
    this.innerHTML = `
    <p>Name: ${this.name} </p>
   <p> Email: ${this.email}</p>
  <p>  Comment: ${this.comment}</p>
  <p> ${new Date(this.date)} <button type="button">Delete</button></p>

  <p>------------------------------------------------</p>
  
    `;
    console.log(this.name);
  }
}
window.customElements.define('comment-component', Comment);

const button = document.getElementById('button').addEventListener('click', (e) => {
  e.preventDefault();
  // creating new comment each time(new instance of the component)
  const element = document.createElement('comment-component');
  
  let name = document.getElementById('name').value;
  console.log(name);
  let email = document.getElementById('email').value;
  let comment = document.getElementById('comment').value;
  let commentObject = {
    name: `${name}`,
    email: `${email}`,
    comment: `${comment}`
  }
  element.setAttribute('name', commentObject.name);
  element.setAttribute('email', commentObject.email);
  element.setAttribute('comment', commentObject.comment);
  document.body.appendChild(element);
  store.comment(store.state, commentObject);
  
});


// import './style.css';
// import {database} from "./database";

// class Store {
//   constructor(init) {
//     const self = this;
//     this.subscribers = [];
//     database.then(function (db) {
//       const tx = db.transaction('comment', 'readwrite');
//       const commentOS = tx.objectStore('comment');
//       console.log(commentOS)
     
//     let input = {};
//     input.name = this.commentObject.name;
//      input.email = this.commentObject.email;
//   input.comment = this.commentObject.comment;
  
//       commentOS.add(input);
      
//       return tx.complete;
      
     
//     })
//     .then(function () {
//       console.log('Added input to the store!');
//     })
  
//     this.state = new Proxy(init, {
//       set(state, key, value) {
//         state[key] = value;
//         // if (self.commentOS){commentOS.put("comment",value[value.length-1],  console.log(commentOS));}
      
//         self.subscribers.forEach((subscriber) => subscriber(state));
//       },
//     });
    
//   }

  

//   subscribed(cb) {
//     if (typeof cb !== "function") {
//       throw new Error("You must subscribe with a function");
//     }
//     this.subscribers.push(cb);
//   } 

//   comment(state, val) {
//     let newState = state.comments.push(val);
//     this.state = Object.assign(this.state, state);
//   }

//   getComment() {
//     return this.state.comments;
//   }
// }

// const store = new Store({ comments: [] });

// store.subscribed((state) => {
//   let commentState = state.comments;
//   commentState.forEach((stateComments) => document.body.appendChild(stateComments));
// });

// class Comment extends HTMLElement {
//   constructor() {
//     super();
//     this.name = '';
//     this.email = '';
//     this.comment = '';
//     this.date = Date.now();
//   }

//   static get observedAttributes() {
//     return ['name', 'email', 'comment'];
//   }

//   // invoked when one of the custom element's attributes is added, removed, or changed
//   attributeChangedCallback(attributeName, oldVal, newVal) {
//     if (oldVal === newVal) {
//       return;
//     }
//     // bracket b/c we dont know exactly what attributename is name, email, comment
//     this[attributeName] = newVal;
//   }
 
//   // connects to hmtl template
//   connectedCallback() {
//     this.innerHTML = `
//     <p>Name: ${this.name} </p>
//    <p> Email: ${this.email}</p>
//   <p>  Comment: ${this.comment}</p>
//   <p> ${new Date(this.date)} <button type="button">Delete</button></p>
//   <p>------------------------------------------------</p>
  
//     `;
//     console.log(this.name);
//   }
// }
// window.customElements.define('comment-component', Comment);

// const button = document.getElementById('button').addEventListener('click', (e) => {
//   e.preventDefault();
//   // creating new comment each time(new instance of the component)
//   const element = document.createElement('comment-component');
  
//   let name = document.getElementById('name').value;
//   console.log(name);
//   let email = document.getElementById('email').value;
//   let comment = document.getElementById('comment').value;
//   let commentObject = {
//     name: `${name}`,
//     email: `${email}`,
//     comment: `${comment}`
//   }
//   element.setAttribute('name', commentObject.name);
//   element.setAttribute('email', commentObject.email);
//   element.setAttribute('comment', commentObject.comment);
//   // document.body.appendChild(element);
//   store.comment(store.state, element);

  
// });