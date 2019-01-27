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
- use handStatus to block dealing cards to busted hand
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
