## Running locally

- Run `yarn` and then `yarn dev` locally.
- The Next.js API server is an in-memory local server, so the data is not actually persisted to disk. The posts that are stored or altered will be reset when the server restarts or when a file is saved and the server is recompiled.
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Why

This repo is for a demo to discuss an abstraction we made for generating friction modals when performing bulk actions on items in a table.
The modal's behavior is coupled with these actions we can perform on each item in the table. So he made a hook useItemActions that manages both the actions and the state of the modal. This has been working out ok so far.

However there are a few downsides of this approach.
The first one is, in order to use it, the user has to call `renderFrictionModal` method pulled out from the `useItemActions` hook. It is easy for people to forget to do that. Also it is not intuitive that a hook is also responsible for rendering a <Modal />. Ideally custom hooks are for reusable state logic, not really to render components.

The second problem is that, in some cases the users could be frustrated to find out that they have no control over the state of the modal half way through using our implementation of modal. e.g. when any errors occurs, our modal can either stay open or close. For errors that are non-retryable, our users might want the modal to stay open while displaying an inline alert inside of the modal. With the current implementation, our tenant have no control over that. So there is indeed limitation to flexibility for our users if they go with our modal.
