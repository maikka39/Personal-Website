+++
author = "Maik de Kruif"
title = "Snowball Showdown"
subtitle = "Act 2 - SANS Holiday Hack Challenge 2024"
date = 2025-01-03T16:14:46+01:00
description = "In Snowball Showdown, we help Alabaster Snowball defeat Wombley Cube. For silver, we enable single-player mode and tweak game variables for an easy win. For gold, we discover and trigger a hidden command, unleashing the “mother-of-all-snow-bombs” for a decisive victory!"
cover = "img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/cover.png"
tags = [
    "Holiday Hack Challenge",
    "ctf",
    "hacking",
    "writeup",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

## Link

If you want to play the challenge yourself, you can find it here:

<https://2024.holidayhackchallenge.com/>

## Story line

Let's start off by talking to the elf:

> Hi there! I'm Dusty Giftwrap, back from the battlefield! I'm mostly here for the snowball fights!
>
> But I also don't want Santa angry at us, you wouldn't like him when he's angry. His face becomes as red as his hat! So I guess I'm rooting for Alabaster.
>
> Alabaster Snowball seems to be having quite a pickle with Wombley Cube. We need your wizardry.
>
> Take down Wombley the usual way with a friend, or try a different strategy by tweaking client-side values for an extra edge.
>
> Alternatively, we've got a secret weapon - a giant snow bomb - but we can't remember where we put it or how to launch it.
>
> Adjust the right elements and victory for Alabaster can be secured with more subtlety. Intriguing, right?
>
> Raring to go? Terrific! Here's a real brain tickler. Navigator of chaos or maestro of subtlety, which will you be? Either way, remember our objective: bring victory to Alabaster.
>
> Confidence! Wit! We've got what it takes. Team up with a friend or find a way to go solo - no matter how, let's end this conflict and take down Wombley!

## Hints

There are no hints available.

## Recon

After clicking on the challenge, a new tab opens with a game menu. If we chose option one or two, we get redirected to the game, where we se some instruction. Once two players join the room and click ready, the game starts.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/welcome-screen.png" title="Welcome screen" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/game-welcome.png" title="Game instruction" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/playing-the-game.png" title="Running game" >}}

## Silver

Let's start off by just playing the game. We can do this in multiple ways; joining match making, creating a private room and joining on another tab, or by looking into the url.

`https://hhc24-snowballshowdown.holidayhackchallenge.com/game.html?username=maikdev2&roomId=2101b77aa&roomType=private&id=[YOUR_ID]&dna=ATATATTAATATATATATATATGCATATATATCGATCGGCATATATATATATATATATATATATATATTATAATATCGTAATATATATATATTAATATATATATATATGCCGATATATTA&singlePlayer=false`

At the end of the url, we find the variable `singlePlayer` is set to `false`. If we change it to `true` though, and reload the page, it starts immediately upon clicking ready.

The game is not so easy though (at least for me), and I lost.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/defeated.png" title="Defeated" >}}

Although the game can be won by just playing better, let's explore the code behind the game, and see if we can make our lives easier.

From looking through the source, we find that it is made using the [Phaser](https://phaser.io/) framework, just like the previous games. The important file to look at is `js/phaser-snowball-game.js`, it contains all the game logic. Reading through that file, we find some interesting variables, like `this.snowBallBlastRadius = 24;` and `this.throwRateOfFire = 1000;`. Let's change their values to make things easier.

```js
const scene = game.scene.scenes[0];
scene.snowBallBlastRadius = 30;
scene.throwRateOfFire = 1;
```

_Note: ~~It's important to make the blast radius not too big, because then you'll get a message saying cheats have been detected.~~ Edit: it doesn't seem to matter._

We also find the following code in the `setupPlayerBindings` function.

```js
this.input.on("pointerup", (pointer) => {
    if (pointer.button === 0 && !this.player1.isKo) {
        this.calcSnowballTrajectory(pointer, this.player1);
    }
});
```

This runs every time the left mouse button is released, and sends off the snowball. We can also automate this part, so we don't have to keep clicking with the mouse.

```js
const t = setInterval(() => {
    scene.calcSnowballTrajectory(scene.input.mousePointer, scene.player1);
}, 10);
```

If we now click ready, move closer to the ice block a bit and wait, we'll get the medal!

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/silver.png" title="Silver medal" >}}

## Gold

### Continued story line

Let's first talk to the elf again, he'll tell us what we'll have to do for gold.

> Fantastic work! You've used your hacker skills to lead Alabaster’s forces to victory. That was some impressive strategy!
>
> Christmas is on the line! For a mischievous edge-up, dive into the game’s code - a few client-side tweaks to speed, movement, or power might shift the balance… or just help us find that secret weapon we misplaced!
>
> Excellent! With Wombley’s forces defeated, they’ll have no choice but to admit defeat and abandon their wild plans to hijack Christmas.

We also received some hints for another challenge which we cannot see yet.

### Solving

The elf hints at looking into the game's code. We already did that, but maybe we missed something. I we look further into the `calcSnowballTrajectory` function, we'll find that the game is sending a message on a websocket with the information about the snowball.

```js
let snowball = {
    type: "snowballp",
    x: snowBallPosition.x,
    y: snowBallPosition.y,
    owner: this.player1.playerId,
    isWomb: this.player1.isWomb,
    blastRadius: this.snowBallBlastRadius,
    velocityX: velocityX,
    velocityY: velocityY,
};
this.ws.sendMessage(snowball);
```

We can changes all the values of the snowball here, but no matter what we enter, we won't get the gold medal.

The elf is also talking about a secret weapon, maybe there is more than just snowballs. Let's search for `sendMessage(` to find other places where messages are being sent.

We find some init messages, a pixel map and player positions, but then, "moasb"?

```js
this.moasb = () => {
    this.ws.sendMessage({ type: "moasb" });
};
```

What is that? It looks kind of like [MOAB](https://en.wikipedia.org/wiki/GBU-43/B_MOAB), which is a bomb, so let's just call that method in game.

```js
const scene = game.scene.scenes[0];
scene.moasb();
```

Woah! A plane shows up with a massive bomb underneath it!

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/snowball-showdown/moasb.png" title="Deployment of mother-of-all-snow-bombs" >}}

Upon the bomb exploding, we also receive the gold medal!

## Final elf message

> Brilliant! You unravel the puzzle and launched the 'mother-of-all-snow-bombs' like a true mastermind. Wombley never saw it coming!
