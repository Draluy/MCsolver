# wordbrainsolver

A quick and dirty WordBrain Solver.

Copy the grid of the app on the screen, tweak the minimum length of words, and click on solve.
A dropdown will appear with all the solutions. Selecting one will highlight the first word.

# FAQ

. It doesnt work

Dictionnary is hardcoded in french. Why am I writing this in english.

. The progress bar doesn't work

It would if everything wasn't on the graphics/dom thread. It's dirty.

. The browser is frozen

It freezes the browser while it searches all solutions. If the number of minimum letters is low and the grid is 5*5, give it a couple minutes.



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
