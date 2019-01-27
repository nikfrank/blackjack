import React from 'react';
import { Hand } from 'react-deck-o-cards';

const handStatus = ({
  cards,
  hasAce = !!cards.find(({ rank })=> rank === 1),
  total = cards.reduce((p, { rank })=> p + Math.min(10, rank), 0),
})=>
  (total > 21) ? 'bust' :
  (total >= 17) ? 'standing' :
  (hasAce && (total === 11)) ? 'blackjack' :
  (hasAce && (total >= 8) && (total < 11)) ? 'standing' :
  'hitting';


export default ({
  cards, player,
  deal, doubleDown, split,
  width = '33vw', height = '34vh',
  status = handStatus({ cards }),
  event = cards.reduce((e, { event })=> (e || event), ''),
})=> (
  <div className='BlackjackHand'>
    {player === 'dealer' ? (<h1>{status}</h1>) : status === 'bust' ? 'BUST' : null}
    <Hand cards={cards}
          onClick={(...a)=>console.log(a)}
          style={{ padding: 0,
                   maxWidth: width, minWidth: width,
                   maxHeight: height, minHeight: height }}/>
    {deal && (status !== 'bust') && (event !== 'doubleDown')? [
       <button id={player} key='deal'
               onClick={({ target: { id } })=> deal.card(id)}>
         Deal Card
       </button>,
       (cards.length === 2 && cards[0].rank === cards[1].rank) ? (
         <button id={player} key='split'
                 onClick={({ target: { id } })=> deal.split(id)}>
           Split
         </button>
       ) : null,
       (cards.length === 2) ? (
         <button id={player} key='doubleDown'
                 onClick={({ target: { id } })=> deal.doubleDown(id)}>
           Double Down
         </button>
       ) : null,
    ]: null}
  </div>
);
