This is the getting started exercise for a react course nik frank is giving!

Just a silly example of dealing blackjack using my react-deck-o-cards npm module


Instructions for building from scratch:
---

create a boilerplate react application

`$ create-react-app blackjack`

if you don't have create-react-app, you'll need to have done

`$ yarn global add create-react-app` or `$ sudo npm i -g create-react-app`

or windows users in git bash: run as administrator, then `$ npm i -g create-react-app`

if you don't have yarn

`$ sudo npm i -g yarn` (again windows users: run as admin omitting `sudo`)

if you don't have npm, google [install node](https://google.com/?q=install+node)



then dev the whole thing

`$ emacs .`

`$ git add . && git commit -am built-the-app && git add remote origin https://github.com/me/blackjack && git push origin master`





# workshop

in [github.com/nikfrank/blackjack](https://github.com/nikfrank/blackjack), hit "fork"

`$ cd ~/code`
`$ git clone https://github.com/<MY_USERNAME_EH>/blackjack`
`$ cd blackjack`

you will now have the code cloned, and you are in the project directory from your bash instance

`$ yarn`
`$ yarn start`


you will now have the starting point of the workshop running in a browser @ [localhost:3000](http://localhost:3000)


## agenda

1. single hand game

- render different hands
- deal card "hit"
- calculate handStatus (live, bust, blackjack)
  - more to follow (standing, doubled-down, split (+ pointers to two new hands), insured)
  - until test
- use handStatus to block dealing cards to busted hand
  - remove the hit button on bust
- implement "stand" button
- deal card to dealer before player, and render
- after player stands, trigger dealer algorithm
- program dealer algorithm
- tabulate fortunes of player
- implement double-down button, block hitting after, double wager
- implementing insurance left as an exercise
- splitting to be covered in next section (multiple hands) 

2. multiple hands at table

- refactor a bunch of stuff to work with multiple hands
- implement split as pointers to two new hand instances spliced into state.hands
- tabulate per player, for all hands

3. testing everything

- install jest (already done?)
- mount a hand, test basic render properties
- import utility functions (handStatus, dealer algorithm) to unit test
- mount entire app, simulate user, mock dealt cards (no random in test), test output

4. publishing to heroku


## notes

### single hand game

load page dev loop


#### render different hands

`$ yarn add react-deck-o-cards`

write a JSON hand of cards

import { Hand } from 'react-deck-o-cards';

state = { cards: [{ rank: 1, suit: 3 }] }

<Hand cards={this.state.cards}/>


#### deal card "hit"

const newCard = ()=> ({ rank: Math.floor(Math.random()*13 + 1), suit: Math.floor(Math.random()*4) })

hit = ()=> this.setState(state=> ({ cards: state.cards.concat(newCard()) }) )

<button onClick={this.hit}>Hit me Jeeves</button>


#### calculate handStatus

`$ touch ./src/util.js `

export const handStatus = cards => {
  const hand = cards.reduce((p, c)=> ({ hasAce: p.hasAce || c.rank === 1, total: p.total + Math.min(10, c.rank) }), { total: 0 });
  return {
    total: hand.total + ((hand.hasAce && hand.total <= 11) ? 10 : 0) ,
    hasAce: hand.hasAce,
    status: ( hand.total > 21 ) ? 'bust' :
            ( hand.total === 11 && hand.hasAce ) ? 'blackjack' :
            'live',
  };
}


##### unit test

`$ mkdir tests`
`$ touch tests/util.test.js`

import { handStatus } frrom '../src/util';

it('should calculate bust blackjack or live hand status', ()=>{
  const blackjackCards = [ { rank: 1, suit: 0 }, { rank: 13, suit: 0 } ];

  expect( handStatus(blackjackCards).total ).toEqual( 21 );
  expect( handStatus(blackjackCards).status ).toEqual( 'blackjack' );

  // etc.
});


#### use handStatus to block dealing cards to busted hand

./src/App.js
```js
//...

import { handStatus } from './util';

//...

state = {
  cards: [],
  handStatus: 'live',
  handTotal: 0,
}

//...

hit = ()=> {
  if( this.state.handStatus === 'bust' ) console.log('should remove the button on bust');
  else if ( (this.state.handStatus === 'live') || (
            (this.state.handStatus === 'blackjack') && (confirm('hit with blackjack?')) ))
    this.dealCard();
}

dealCard = ()=>
  this.setState(state => {
    const nextCards = state.cards.concat(newCard());
    const nextHand = handStatus(nextCards);
    
    return ({
      cards: nextCards,
      handStatus: nextHand.status, // we'll use this in the next task
      handTotal: nextHand.total, // we can render this snp
    });
  })

//...
```

##### remove the hit button on bust

./src/App.js
```js
//...

{this.state.handStatus === 'bust' ? null : (
  <button onClick={this.hit}>Hit me Jeeves</button>
)}

//...
```


#### implement "stand" button

./src/App.js
```js
//...

stand = ()=> this.setState({ handStatus: 'stand' })

//...

{['bust', 'standing'}.includes(this.state.handStatus) ? null : [
  <button key='hit' onClick={this.hit}>Hit me Jeeves</button>,
  <button key='stand' onClick={this.stand}>Stand</button>,
]}

//...
```


#### deal card to dealer before player, and render

./src/App.js
```js
//...

state = {
  cards: [],
  handStatus: 'live',
  dealerHand: [ newCard() ],
}

//...

<Hand cards={this.state.dealerHand}/>

//...

```


#### after player stands, trigger dealer algorithm

./src/App.js
```js
componentDidUpdate(prevProps, prevState){
  if( ['bust', 'standing'].includes(this.state.handStatus) && !['bust', 'standing'].includes(this.state.handStatus) )
    this.runDealer();
}

runDealer = ()=> {
  const dealerHand = handStatus( this.state.dealerCards );
  // if bust, done
    (total > 21) ? 'bust' :
    (hasAce && (total === 21)) ? 'blackjack' :
    (hasAce && (total >= 18)) ? 'standing' : // dealer hits on soft 17 lol
    (!hasAce && (total >= 17)) ? 'standing' :
    'hitting';
}
```