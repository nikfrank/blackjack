import React, { Component } from 'react';
import './App.css';

import BlackjackHand from './BlackjackHand';

const newCard = ()=> ({
  rank: Math.floor( Math.random() * 13 + 1 ),
  suit: Math.floor( Math.random() * 4 ),
});

class App extends Component {
  state = {
    table: [],
    hands: {},
    dealer: [{ rank:1, suit:1 }],
  }

  addPlayer = ()=> this.setState(({ table, hands, playerId=Math.random() })=> ({
    table: table.concat(playerId), hands: {...hands, [playerId]: [newCard(), newCard()]}
  }))

  dealerCard = ()=> this.setState(({ dealer })=> ({ dealer: dealer.concat(newCard()) }))
    
  deal = {
    card: player=> this.setState(({ table, hands })=> ({
      hands: {...hands, [player]: hands[player].concat( newCard() ) },
    })),

    split: player=> this.setState({}),

    doubleDown: player=> this.setState(({ table, hands })=> ({
      hands: {...hands, [player]: hands[player].concat([newCard(), { event: 'doubleDown' }]) },
    })),
  }

  render() {
    const { table, hands, dealer } = this.state;

    return (
      <div className='App'>
        <header className='Dealer'>
          <BlackjackHand cards={dealer} player='dealer' height='25vh'/>
        </header>
        
        <div className='Game'>
          <button onClick={this.addPlayer}>+</button>
          <ul>
            {table.map(pid=> (
              <li key={pid}>
                <BlackjackHand cards={hands[pid]} player={pid} deal={this.deal}/>
              </li>
            ) )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
