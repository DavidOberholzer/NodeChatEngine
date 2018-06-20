# NODE CHAT ENGINE

Hey there! This is my simple node based chat engine.

## Setup

Firstly this is an node project so start up NPM or yarn.

```
npm install
```
or just
```
yarn
```

Then you need a local postgres user and database with name, password and DBname of `nodechatengine`. Once you have a db ready, you can run the command:

```
yarn dbsetup
```

This will populate the DB with the correct tables. Then build both the admin and chat bundles with:

```
yarn build:admin
yarn build:chat
```

## Create User

To create a user you can run the node superuser js file:

```
node superuser
```

This will prompt you to enter a new user details and then you can use this user to login to the chat engine and admin.

# Start Chat App

```
npm run start
```

Test by making a websocket connection at `localhost:3000/echo`. What ever text you send to this websocket will echo back to you!

Now at `localhost:3000/chat` the chatbot engine lives!

## Chat UI

The Chat UI is hosted at `localhost:3000`. This has an instance of my React-Chat-UI creating a websocket connection to the chat engine.

## Admin

Located at `localhost:3000/admin`, the Admin is built with Admin on REST. The node chat engine supplies a simple rest API for the Admin to view/create/edit and delete database entries.

## Models

The chat engine works with 3 models.

_Workflows_: Workflows consist of many chat states.

_States_: Chat States are places where the user is at in a chat workflow. It consists of text to be shown to the user, buttons the user can use to move to other states, and an auto field which dictates that once the engine hits that state it will auto direct to a new state asn no input is required.

_Buttons_: Chat buttons are linked to a state and have button text and the state to which they will transition the user.

## Testing

Testing is done with Mocha and Chai. A test database called `test` with user `postgres` and no password is used for TravisCI tests on PR's.
To run the testing with the NODE_ENV variable set to `test` you can run the NodeChatEngine with the testdb settings `yarn start:testdb`.
Then you can run the tests using `yarn test:local`.

## TODOs

-   Create User model that will be created upon connection and retained.
-   Add permanent User data that can be stored.
