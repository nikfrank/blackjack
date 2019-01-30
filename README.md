This is the getting started exercise for a react course nik frank is giving!

Just a silly example of dealing blackjack using my react-deck-o-cards npm module


## agenda

1. single player game

- render different hands
- deal card "hit"
- calculate handStatus (live, bust, blackjack)
  - more to follow (standing, doubled-down, split (+ pointers to two new hands), insured)
  - until test
- use handStatus to block dealing cards to busted hand
  - remove the hit button on bust
- implement "stand" button
- deal card to dealer before player, and render
- program dealer algorithm
  - after player stands, trigger dealer algorithm
- tabulate fortunes of player
- next hand
- implement double-down button, block hitting after, double wager
- implementing insurance left as an exercise
- splitting to be covered in next section (multiple hands) 

2. multiple players at table

- refactor a bunch of stuff to work with multiple hands
- implement split as pointers to two new hand instances spliced into state.hands
- tabulate per player, for all hands
- **style hand and buttons inside sized box**

3. testing everything

- mount a hand, test basic render properties
- import utility functions (handStatus, dealer algorithm) to unit test
- mount entire app, simulate user, mock dealt cards (no random in test), test output

4. publishing to heroku


## notes

### single hand game

load page dev loop


#### render different hands

`$ yarn add react-deck-o-cards`

write a JSON hand of cards... `rank` is which number (1 = ace, 2 = 2, 13 = King),

suits are { 0: clubs, 1: diamonds, 2: hearts, 3: spades }


./src/App.js
```js
import { Hand } from 'react-deck-o-cards';

//... top of Component (state init)
state = { cards: [{ rank: 1, suit: 3 }] }

//... in render
<Hand cards={this.state.cards}/>
```


#### deal card "hit"


./src/App.js
```js
//... above Component (utility constants)
const newCard = ()=> ({ rank: Math.floor(Math.random()*13 + 1), suit: Math.floor(Math.random()*4) });

//... inside Component (instance methods)
hit = ()=> this.setState(state=> ({ cards: [...state.cards, newCard()] }) )
  
//... in render
<button onClick={this.hit}>Hit me Jeeves</button>
```


#### calculate handStatus

`$ touch ./src/util.js `

./src/util.js
```js
export const handStatus = cards => {
  const hand = cards.reduce((p, c)=> ({
    hasAce: p.hasAce || c.rank === 1,
    total: p.total + Math.min(10, c.rank),
  }), { total: 0 });
  
  return {
    total: hand.total + ((hand.hasAce && hand.total <= 11) ? 10 : 0) ,
    hasAce: hand.hasAce,
    status: ( hand.total > 21 ) ? 'bust' :
            ( hand.total === 11 && hand.hasAce ) ? 'blackjack' :
            'live',
  };
};
```

##### unit test

`$ touch ./src/util.test.js`

./src/util.test.js
```js
import { handStatus } frrom '../src/util';

it('should calculate bust blackjack or live hand status', ()=>{
  const blackjackCards = [ { rank: 1, suit: 0 }, { rank: 13, suit: 0 } ];

  expect( handStatus(blackjackCards).total ).toEqual( 21 );
  expect( handStatus(blackjackCards).status ).toEqual( 'blackjack' );

  // etc.
});
```

now to run the tests

`$ npm run test`

you can write some more `it` blocks to test more cases and get the output on the console



#### use handStatus to block dealing cards to busted hand

./src/App.js
```js
import { handStatus } from './util';

//... top of Component (state init)
state = {
  cards: [],
  handStatus: 'live',
  handTotal: 0,
}

//... inside Component (instance methods)
hit = ()=> {
  if( this.state.handStatus === 'bust' ) console.log('should remove the button on bust');
  else this.dealCard();
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


also let's style the hand a bit to make testing it easier

./src/App.css
```css
//...

.App .hand {
  height: 30vh;
}

.App .hand svg {
  height: 100%;
}
```

./src/App.js
```js
//... in render
<div className='hand'>
  <Hand cards={this.state.cards}/>
</div>
```




##### remove the hit button on bust

./src/App.js
```js
//... in render

{this.state.handStatus === 'bust' ? null : (
  <button onClick={this.hit}>Hit me Jeeves</button>
)}

//...
```


#### implement "stand" button

./src/App.js
```js
//... inside Component (instance methods)
stand = ()=> this.setState({ handStatus: 'standing' })

//... in render
{['bust', 'standing', 'blackjack'].includes(this.state.handStatus) ? null : [
  <button key='hit' onClick={this.hit}>Hit me Jeeves</button>,
  <button key='stand' onClick={this.stand}>Stand</button>,
]}

//...
```


#### deal card to dealer before player, and render

./src/App.js
```js
//... top of Component (state init)
state = {
  cards: [],
  handStatus: 'live',
  dealerHand: [ newCard() ],
}

//... in render
<div className='hand dealer'>
  <Hand cards={this.state.dealerHand}/>
</div>
```

./src/App.css
```css
.dealer {
  background-color: green;
}
```


#### program dealer algorithm

./src/util.js
```js
//...

export const dealerStatus = cards=>{
  const hasAce = !!cards.find(c => c.rank === 1);
  const cardTotal = cards.reduce((p, c)=> p+ Math.min(10, c.rank), 0);
  const total = hasAce && cardTotal <= 11 ? cardTotal + 10 : cardTotal;
        
  return {
    total, 
    status: (total > 21) ? 'bust' :
            (total === 21 && cardTotal === 11) ? 'blackjack' :
            (total >= 18) ? 'standing' :
            (cardTotal >= 17) ? 'standing' :
            'hitting',
  };
}
```

./src/util.test.js
```js
//...

it('should calculate the correct dealer action', ()=>{
  const softSeventeen = [ { rank: 1, suit: 3 }, { rank: 6, suit: 2 } ];

  expect( dealerStatus( softSeventeen ).total ).toEqual( 17 );
  expect( dealerStatus( softSeventeen ).status ).toEqual( 'hitting' );
});
```


#### after player stands, trigger dealer algorithm

./src/App.js
```js
import { handStatus, dealerStatus } from './util';

//... inside Component (lifecycle) ... this is a side-effect (not pure)
componentDidUpdate(prevProps, prevState){
  if( ['bust', 'standing', 'blackjack'].includes(this.state.handStatus) &&
     !['bust', 'standing', 'blackjack'].includes(prevState.handStatus) )
    this.runDealer();
}

//... inside Component (instance methods)
runDealer = ()=> {
  const dealer = dealerStatus( this.state.dealerHand );
  
  if( dealer.status === 'bust' ){
    // player not bust wins
    
  } else if( dealer.status === 'standing' ){
    // check player hand total v dealer hand total => win/lose/push
    
  } else if( dealer.status === 'blackjack' ){
    // player not blackjack loses, unless you code insurance
    
  } else if( dealer.status === 'hitting' ){
    this.setState(state => ({ dealerHand: state.dealerCards.concat( newCard() ) }), this.runDealer);
    
  }
}

//...
```


#### tabulate fortunes of player

let's start by implementing `state.money` and `state.wager`, rendering them to the user

./src/App.js
```js
//... top of Component (state init)
state = {
  //...
  money: 10000,
  wager: 100,
}

//... in render

<div className="PlayerMoney">Bank: ${this.state.money}</div>
<div className="PlayerWager">betting: ${this.state.wager}</div>
```

now we can fill in the missing code in the `runDealer` instance method

./src/App.js
```js
//... inside Component (instance methods)
runDealer = ()=> {
  const dealer = dealerStatus( this.state.dealerHand );

  if( dealer.status === 'bust' ){
    if( this.state.handStatus === 'blackjack' ) this.setState(state=> ({ money: state.money + 1.5 * state.wager })); 
    else if( this.state.handStatus === 'bust' ) this.setState(state=> ({ money: state.money - state.wager }));
    else if( this.state.handTotal < 21 ) this.setState(state=> ({ money: state.money + state.wager }));
    
  } else if( dealer.status === 'standing' ){
    if( this.state.handStatus === 'blackjack' ) this.setState(state=> ({ money: state.money + 1.5 * state.wager }));
    else if( this.state.handStatus === 'bust' ) this.setState(state=> ({ money: state.money - state.wager }));
    else if( this.state.handTotal > dealer.total ) this.setState(state=> ({ money: state.money + state.wager }));
    else if( this.state.handTotal < dealer.total ) this.setState(state=> ({ money: state.money - state.wager }));
    
  } else if( dealer.status === 'blackjack' ){
    //  unless you code insurance
    this.setState(state=> ({ money: state.money - state.wager }));
    
  } else if( dealer.status === 'hitting' ){
    this.setState(state => ({ dealerHand: state.dealerHand.concat( newCard() ) }), this.runDealer);
    
  }
}
```

this is a bit primitive code-wise... anyone who wants to refactor this is invited to do so in front of the group!


#### next hand

here we'll call setState twice to make sure our componentDidUpdate is triggered correctly

once to clear the previous hand

once to deal the next one

./src/App.js
```js
//... in Component (instance methods)

nextHand = ()=> {
  this.setState({
    handStatus: 'live',
    handTotal: 0,
    
  }, ()=> {
    const cards = [ newCard(), newCard() ];
    const hand = handStatus( cards );
    
    this.setState({
      cards,
      handStatus: hand.status,
      handTotal: hand.total,
      dealerHand: [ newCard() ],
    })
  })
}
//... in render

{['bust', 'standing', 'blackjack'].includes(this.state.handStatus) ? (
   <button onClick={this.nextHand}>Next</button>
) : [
   <button key='hit' onClick={this.hit}>Hit me Jeeves</button>,
   <button key='stand' onClick={this.stand}>Stand</button>,
]}
```


and to render correctly the first time through

./src/App.js
```js
//... in Component (lifecycle)
componentDidMount(){
  this.nextHand();
}
```

#### implement double-down button, block hitting after, double wager

./src/App.js
```js
//... in Component (lifecycle)
componentDidUpdate(prevProps, prevState){
  if(( ['bust', 'standing', 'blackjack'].includes(this.state.handStatus) &&
       !['bust', 'standing', 'blackjack'].includes(prevState.handStatus)
  ) || (
    ( this.state.doubledDown && !prevState.doubledDown )
  ))
    this.runDealer();
}

//... in Component (instance methods)
doubleDown = ()=>{
  if( this.state.handStatus === 'bust' ) console.log('should remove the button on bust');
  else this.setState(state => ({ wager: state.wager * 2, doubledDown: true }), this.dealCard);
}

//... in render
{['bust', 'standing', 'blackjack'].includes(this.state.handStatus) || this.state.doubledDown ? (
   <button onClick={this.nextHand}>Next</button>
) : [
   <button key='hit' onClick={this.hit}>Hit me Jeeves</button>,
   <button key='stand' onClick={this.stand}>Stand</button>,
   this.state.cards.length === 2 ? (
     <button key='double-down' onClick={this.doubleDown}>Double Down</button>
   ) : null,
]}
```

now we can block hitting after a doubleDown

```js
//... in Component (instance methods)
hit = ()=> {
  if( this.state.handStatus === 'bust' ) console.log('should remove the button on bust');
  else if( this.state.doubledDown ) console.log('no hitting after doubleDown');
  else this.dealCard();
}
```

and in `nextHand` don't forget to reset the wager to 100 and doubledDown to false

```js
//... in Component (instance methods)
nextHand = ()=> {
  this.setState({
    wager: 100,
    doubledDown: false,
    handStatus: 'live',
    handTotal: 0,
    
  }, ()=> {
    const cards = [ newCard(), newCard() ];
    const hand = handStatus( cards );
    
    this.setState({
      cards,
      handStatus: hand.status,
      handTotal: hand.total,
      dealerHand: [ newCard() ],
    })
  })
}
```



great!

it's a bit wonky (the dealer plays out his hand even when we land a blackjack)

and it could use some animations when we win money


but, it is a working blackjack game!




that's the end of the first blackjack workshop

I'll be updating this course with multihand (splitting) multiplayer (online) and animations later.






2. multihand (rough notes)

#### style hand and buttons inside sized box

in order to style different angles onto the hands based on how many hands there are currently dealt, we can use this nifty pseudoselector trick 

```css
li:nth-last-of-type(3):nth-of-type(1) {
  background-color:red;
}

```

to only select an `<li/>` when it is one of 3 in the `<ul/>` currently

unfortunately, it only works for one at a time, so we need to duplicate it a bunch

```css
li:nth-last-of-type(3):nth-of-type(1),
li:nth-last-of-type(2):nth-of-type(2),
li:nth-last-of-type(1):nth-of-type(3) {
  background-color:red;
}
```

(you can test in the browser now and see that the `<li/>`s get the `background-color` when you make three of them)

generating these selectors is tedious (especially when you want to change the underlying selector from just `li`, which is a terrible selector and shouldn't pass a Pull Request.

Let's look into SASS to see if there's a better way to generate them:

https://www.google.com/search?q=sass+selector+generation

`$ yarn add node-sass`
`$ touch ./src/App.scss`

./src/App.scss
```scss
$maxChildren: 12;

@mixin of-n-siblings {
  @for $n from 1 through $maxChildren {
    @for $j from 1 through $n {
      &:nth-of-type(#{$j}):nth-last-of-type(#{$n - $j + 1}) {
        width: (100% / $n);
        background-color: rgb( 128 * ($n % 3),
                               128 * (($n+1) % 3),
                               128 * (($n+2) % 3));
      }
    }
  }
}

li{ @include of-n-siblings; }
```

this will colour the backgground differently based on how many hands there are. Let's place the hands around a circle instead

and only apply the style to `<li/>`s which represent hands

```scss
$maxChildren: 12;

@mixin of-n-siblings {
  @for $n from 1 through $maxChildren {
    @for $j from 1 through $n {
      &:nth-of-type(#{$j}):nth-last-of-type(#{$n - $j + 1}) {
        width: (100% / $n);
        transform: rotate( #{$j*30deg - $n*15deg} )
      }
    }
  }
}

li.blackjackHand{ @include of-n-siblings; }
```






####


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

