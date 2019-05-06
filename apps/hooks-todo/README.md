# Hooks Todos


## Are React hooks going to kill Redux

That's the big question.  It might end up killing React itself the way way Angular 2 killed of Angular usage in general.  I hope Stencil is the next big thing.


Anyhow, here are some notes on the [debate](https://www.reddit.com/r/reactjs/comments/9tto1x/are_react_hooks_going_to_kill_redux/).

Redux version 6 will change the internals to use createContext. See [PR #1000](https://github.com/reduxjs/react-redux/pull/1000) for details.

[Redux Starter Kit](https://github.com/reduxjs/redux-starter-kit) is a simple set of tools to make using Redux easier.

[Introducing hooks](https://reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand)
*In many cases it’s not possible to break these components into smaller ones because the stateful logic is all over the place. It’s also difficult to test them. This is one of the reasons many people prefer to combine React with a separate state management library. However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult.*


Pro for Redux, Con against.

Pro: if you start using a lot more useState and useContext, that may mean you don't have as much need for Redux (or MobX, or... ).

Con: Redux brought order to chaos, and if we lose Redux, does the chaos return?

Pro: Although there cay be some benefit to creating one big pot of global state as Redux does, there are well-documented drawbacks as well. Why shouldn't some state be allowed to reside inside components when no other component needs it?

Con: I don’t really see that being a risk, any more than local state competing with shared state. you could use React classes now to handle state entirely, but it would be painful. Hooks just seems like a less classy version? The api seems a little side-effecty/magical for something supposedly aligned with functional techniques.  My personal problem with the React app ecosystem is that, like jQuery before, it’s gobbling up the language rather than restricting itself to being a rendering engine. I think a lot of the problems in modern JS stacks could be mitigated by using DI/registries, but we end up using an unholy mix of router plugins, connect, react context and now hooks. It would be nice to see a more opinionated Redux architecture, maybe based around Ports & Adapters, but we spend our effort reinventing the same wheel over and over, strapping different libraries du jour together. I appreciate it allows for innovation and internal optimisations but it plays out like a rats nest of wiring at scale. By the time one team adopts a pattern, a new API comes out and soon enough your app starts looking like an archaeological dig with deprecated patterns co-existing with newer ones.

Pro: It's not a specific use case being ill served by the libraries, it's more a case that they have unchecked power, and it's too easy to wield it irresponsibly. What all the effect libraries seem to want - not just allow, want - is a separation of application logic depending on whether it's sync or async.  The sync stuff with reducers and pure functions is golden. For async, with multiple developers on a complex app, we have reached the situation where no-one wants to touch anyone elses sagas because they're not totally straightforward, so for any new functionality, developers spin more and ever more generators - sagas are forking and spawning like it's mating season. This spaghettification of application logic has made it hard to work out who is dispatching what, and why.  I guess I feel like there should somehow be a more encompassing connection between the explicit mutation of the reducer and the implicit mutation through async dispatching side effects. Redux Loop, for all its flaws, makes that connection explicit by declaring effects in the reducer.

Pro: If anything could kill redux, it’s the new Context API.  While it may reduce redux usage, you still need to keep data logic somewhere, and redux really helps to manage all that.

Pro: hooks could "replace" the manner in which you're using redux but that's all.

Pro: none of the supposed Redux killers even attempt to tackle the core purpose of Redux - managing a single source of truth, through read-only state using pure functions.

Con: React encourages you to componentize your UI AND state (with hooks, your logic and side effects) to make it reusable/composable. This means distributing your state where possible and only lifting up what is truly app level. So hooks help you do that. But again, you dont have to use it if you simply don't work that way.

Con: Redux is a lot more than just basic state management — it’s an entire design pattern that allows for complex transformations with things like higher order reducers. I see redux’s real “competition” is with things like GraphQL

Pro:  At its core, it's just a middleware chain with a reducer at the end.

Pro: Redux is for global state... hooks are for local state.... you use them both.

Context + hooks + the upcoming suspense fetching/caching stuff (if it's good enough to replace Redux thunks/sagas with) may be enough to get me to drop it personally. We'll wait and see though.
