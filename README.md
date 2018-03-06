# NODE CHAT ENGINE

Hey there! This is my simple node based chat engine.

# Setup

Firstly this is an node project so start up NPM.

```
npm install
```

Then you need a local postgres user and database with name, password and DBname of `nodechatengine`.

# Start Chat App

```
npm run start
```

Test by making a websocket connection at `localhost:3000/echo`. What ever text you send to this websocket will echo back to you!

Now at `localhost:3000/chat` the chatbot engine lives!

## Chat UI

The Chat UI is hosted at `localhost:3000` and stills needs to be finished. It uses my React-Chat-UI code for this.

## Admin

Located at `localhost:3000/admin`, the Admin is built with Admin on REST. The node chat engine supplies a simple rest API for the Admin to view/create/edit and delete database entries.

## Models

The chat engine works with 3 models.

_Workflows_: Workflows consist of many chat states.

_States_: Chat States are places where the user is at in a chat workflow. It consists of text to be shown to the user, buttons the user can use to move to other states, and an auto field which dictates that once the engine hits that state it will auto direct to a new state asn no input is required.

_Buttons_: Chat buttons are linked to a state and have button text and the state to which they will transition the user.
