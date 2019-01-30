---
---
---


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

