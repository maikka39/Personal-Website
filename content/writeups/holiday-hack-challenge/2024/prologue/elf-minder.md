+++
author = "Maik de Kruif"
title = "Elf Minder"
subtitle = "Prologue - SANS Holiday Hack Challenge 2024"
date = 2024-11-21T15:18:53+01:00
description = ""
cover = "img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/cover.png"
tags = [
    "Holiday Hack Challenge",
    "Prologue",
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

Let's start off by talking to Poinsettia McMittens:

```txt
Center your mind, and become one with the island!

Relax...

This isn't working! I'm trying to play this game but the whole "moving back to the North Pole" thing completely threw me off.

Say, how about you give it a try. It's really simple. All you need to do is help the elf get to the exit.

The faster you get there, the better your score!

I've run into some weirdness with the springs though. If I had created this game it would've been a lot more stable, but I won't comment on that any further.


```

## Recon

Upon opening the challenge, we're greeted with yet another game. This time with twelve levels.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/levels.png" title="Welcome screen" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/game-help.png" title="Game help" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/game.png" title="Game screen" >}}

## Silver

Just like with the previous challenge, we can likely get silver here by just playing the game as described. They seem progressively more difficult, and near the end we'll have to get creative with some.

Here are some screenshots of how I solved them. Definitely didn't get on the leaderboard with them, but they're enough for silver.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level1.png" title="Sandy Start" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level2.png" title="Waves and Crates" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level3.png" title="Tidal Treasures" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level4.png" title="Dune Dash" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level5.png" title="Coral Cove" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level6.png" title="Shell Seekers" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level7.png" title="Palm Grove Shuffle" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level8.png" title="Tropical Tangle" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level9.png" title="Crate Caper" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level10.png" title="Shoreline Shuffle" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level11.png" title="Beachy Bounty" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level12.png" title="Driftwood Dunes" >}}

Once we finish them all, we get a silver medal and a popup message.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/silver.png" title="Silver Popup" >}}

Looking at the message, we'll probably have to dive into the game's code again.

## Gold

Looking at the last level, it seems impossible. It doesn't seem like there is any way to reach the flag.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level13-default.png" title="A Real Pickle" >}}

This is where we'll have to delve into the code, and see what's going on behind the scenes. In this process, I found there were multiple ways to reach the end flag, let's go over them one by one.

### Method 1 - Admin Tools

After opening the DevTools, we can immediately find something suspicious, a div with a class called `admin-controls`.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/admin-controls-devtool.png" title="Admin controls in DevTools" >}}

Let's double click on `hidden`, and remove it.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/admin-controls.png" title="Admin controls" >}}

Wooah, a nice toolbar shows up! In it, there are several options we can use. The one that can really help us is the "Clear Entities" button; it removes all the entities like rocks from the map. Without these entities, we can place tunnels on places which are normally already occupied.

Let's draw a route which goes by all the boxes, and end with a tunnel. Since the end flag is no longer there, we can put a tunnel there to end. Don't forget to also put a path here, so we can walk to the finish.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level13-clear.png" title="Cleared level" >}}

Once the map has been drawn, we can click "Go Home" on the top left, and then reopen the level again. Now, all the removed entities have been put back, and our route is still there.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level13.png" title="Finished level" >}}

Now we can click start, and let the elf walk to the finish. Don't forget to rotate the angled path towards the tunnel when the elf is on its way up.

We should now have received gold!

### Method 2 - Springs

From reading in the official Discord server, I learned there was another way using springs, so let's explore that option as well!

A good starting point would be to first figure out how the springs work.

{{< code language="js" title="guide.js (getSpringTarget)" isCollapsed="true" >}}

```js
getSpringTarget(springCell) {
    const journey = this.hero.journey;
    const dy = journey[1][1] - journey[0][1];
    const dx = journey[1][0] - journey[0][0];

    let nextPoint = [springCell[0], springCell[1]];
    let entityHere;
    let searchLimit = 15;
    let searchIndex = 0;
    let validTarget;

    do {
        searchIndex += 1;
        nextPoint = [nextPoint[0] + dx, nextPoint[1] + dy];

        entityHere = this.entities.find(
            (entity) =>
                ~[EntityTypes.PORTAL, EntityTypes.SPRING].indexOf(
                    entity[2]
                ) &&
                searchIndex &&
                entity[0] === nextPoint[0] &&
                entity[1] === nextPoint[1]
        );

        if (searchIndex >= searchLimit) {
            break;
        }

        validTarget = this.isPointInAnySegment(nextPoint) || entityHere;
    } while (!validTarget);

    if (this.isPointInAnySegment(nextPoint) || entityHere) {
        if (entityHere) return this.segments[0][0]; // fix this
        return nextPoint;
    } else {
        return;
    }
}
```

{{< /code >}}

In one of the source files, `guide.js`, there is a function called `getSpringTarget`. This function, as the name suggests, returns the location where the elf should go after encountering a spring.

Let's go over the code. I have attached the original version above and below a version with comments added by me.

```js
getSpringTarget(springCell) {
    const journey = this.hero.journey; // This contains the last two positions of the elf
    const dy = journey[1][1] - journey[0][1]; // The vertical direction of the elf
    const dx = journey[1][0] - journey[0][0]; // The horizontal direction of the elf

    let nextPoint = [springCell[0], springCell[1]]; // Initialize the destination to the spring location
    let entityHere; // Initialize the variable, will later contain whether an entity has been found on the path
    let searchLimit = 15; // Set a limit after which to stop searching for a destination
    let searchIndex = 0; // Current offset from the spring
    let validTarget; // Initialize the variable, will contain whether the destination which is currently being checked is valid

    do {
        searchIndex += 1; // Up the offset from the spring
        nextPoint = [nextPoint[0] + dx, nextPoint[1] + dy]; // Up the destination by one in the direction of travel

        entityHere = this.entities.find( // Loop over the entities until the condition below is true
            (entity) =>
                ~[EntityTypes.PORTAL, EntityTypes.SPRING].indexOf( // Check if the entity is a tunnel of spring
                    entity[2] // entity[2] is the type of the entity
                ) &&
                searchIndex && // searchIndex should be bigger than 0, always true in this scenario
                entity[0] === nextPoint[0] && // Check if the entity is on the destination (horizontally)
                entity[1] === nextPoint[1] // Check if the entity is on the destination (vertically)
        );

        if (searchIndex >= searchLimit) { // If we gave gone too far from the spring
            break; // Stop the search
        }

        validTarget = this.isPointInAnySegment(nextPoint) || entityHere; // Check if there is a path at the current position, or that an entity has been found
    } while (!validTarget); // Keep going as long as there is no valid destination

    if (this.isPointInAnySegment(nextPoint) || entityHere) { // Same check as above
        if (entityHere) return this.segments[0][0]; // If an entity has been found, return the location of the very first path
        return nextPoint; // Return the destination we found
    } else {
        return; // If we ever end up here, something has gone very wrong
    }
}
```

The key line in the code is the following:

```js
if (entityHere) return this.segments[0][0]; // fix this
```

_Note: The comment here if from the original file._

What this line does, is that, if an entity has been found in the path of the spring, it directs the elf to the very first path we put down.

So, if we draw the very first path on the finish line, and make sure we end our path with two springs or a spring and a tunnel in a row, we can travel there.

To test this hypothesis, we can draw a route that follows these rules.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-minder/level13-spring-tp.png" title="Finished level" >}}

Afterwards, we hit start, and the elf reached the flag!

## Bonus

Here's some nice bonus content. In the level's grid, we can also place paths and entities on corners. Also, the amount of springs if not validated. Of course, we can't do this by hand, we'll have to do it in code.

Using this method we can create more optimized (or the opposite for evil boss mode) paths.

Try the following code for example to see how it works.

<!-- prettier-ignore-start -->
```js
game.segments = [
    [[10, 9], [11, 9]],
    [[1, 1], [2, 1]],
    [[9, 1], [9, 2]],
    [[9, 2], [9, 3]],
    [[9, 3], [8, 3]],
    [[6, 3], [5, 3]],
    [[5, 3], [5, 4]],
    [[5, 4], [5, 5]],
    [[5, 5], [6, 5]],
    [[6, 5], [7, 5]],
    [[7, 5], [7, 6]],
    [[7, 6], [7, 7]],
    [[7, 7], [6, 7]],
    [[4, 7], [3, 7]],
    [[3, 7], [2, 7]],
    [[2, 7], [2, 6]],
    [[2, 6], [2, 5]],
    [[2, 5], [2, 4]],
];

game.entities.push([2, 1, EntityTypes.SPRING]);
game.entities.push([8, 3, EntityTypes.SPRING]);
game.entities.push([6, 7, EntityTypes.SPRING]);
game.entities.push([2, 4, EntityTypes.SPRING]);

startBtn.classList.add("ready") // Makes sure the start button is clickable
```
<!-- prettier-ignore-end -->
