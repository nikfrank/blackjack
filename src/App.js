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

  dealNextCard = ()=> 0 // noop
  
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
