# Gomoku
A simple board game where the winning objective is to have 5 pieces aligned in a straight line.

## Features
- Realtime game play
- ~~Pretty graphics~~
- Fantastic game logic
- Totally reliable server
- Engaging realtime chat

## Usage
- To run the game on a custom server
  - Set up with `npm install`
  - Run `index.js` with `node index.js` or `npm start`
- To use the my server, go to https://gomoku-server-zy.herokuapp.com/ with your browser

## Game Play
- **Start** by clicking on "**Start Game**" button
- Invite another player by sharing the url, which should have `?id=YOUR_GAME_ID` as its suffix
- Make sure to set the side you are playing as at the "**Player Details**" section on the right/bottom (Black/White)
- Press a spot on the grid shown (Should show a square indicator)
- After thinking about your decision thrice, press "**Play**"

### Others
- **Join** by clicking on "**Continue Game**" button
  - This is to join another game with a given id from the id field
- **Restart** by clicking on "**Restart Game**" button
  - This resets the current game, however it keeps the chat history

## Chat
- Chat simply by typing the _Chat Message_ field and either press `enter` or press "**Send**"
- Past chat history will appear in the black bordered box (scrollable)
- Editing the chat history is not possible of v0.0.3

## Open Source

You are welcomed to make a pull request and suggest any new features
