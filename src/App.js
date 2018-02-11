import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Hand } from 'react-deck-o-cards';

const defHandStyle = {
  maxHeight:'34vh',
  minHeight:'34vh',
  
  maxWidth:'100vw',
  padding: 0,
};

class App extends Component {
  state = {
    cards: [
      { rank: 1, suit: 3 },
      { rank: 13, suit: 3 },
    ],

    handStatus: 'blackjack',
  }

  dealNextCard = ()=> this.setState(({ cards, handStatus })=> ({
    cards: (handStatus === 'hitting') ?
           cards.concat( newCard() ) :
           [ newCard(), newCard() ]
    
  }), ({
    hasAce = !!cards.find(({ rank })=> rank === 1),
    total = cards.reduce((p, { rank })=> p + Math.min(10, rank), 0),
    
  })=> this.setState(({ cards })=> ({
    handStatus: (total > 21) ? 'bust' :
                (total >= 17) ? 'standing' :
                (hasAce && (total === 11)) ? 'blackjack' :
                (hasAce && (total >= 8) && (total < 11)) ? 'standing' :
                'hitting'
  }) )
  )

  render() {
    const { cards, handStatus } = this.state;
    
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        
        <div className='Game'>
          <h1>{handStatus}</h1>
          <Hand cards={cards} style={defHandStyle}/>
          <button onClick={this.dealNextCard}>Next Card/Hand</button>
        </div>
      </div>
    );
  }
}

export default App;
