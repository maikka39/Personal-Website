+++
author = "Maik de Kruif"
title = "Elf Connect"
subtitle = "Prologue - SANS Holiday Hack Challenge 2024"
date = 2024-11-21T14:23:34+01:00
description = "Let's play our first game of the Holiday Hack Challenge. To win, we'll have to use the DevTools to read some code, and figure out how the scoring mechanism works."
cover = "img/writeups/holiday-hack-challenge/2024/prologue/elf-connect/cover.png"
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

Let's start off by talking to Angel Candysalt:

```txt
Welcome back, island adventurer! I'm Angel Candysalt — so happy to finally meet you!

I'm thrilled you're here because I could really use a hand with something.

Have you ever heard of a game called Connections?

It’s simple! All you need to do is find groups of four related words.

I've been stuck on it all day, and I'm sure someone as sharp as you will breeze through it.

Oh, and while you're at it, check out randomElf's score — they hit fifty thousand points, which seems… oddly suspicious.

Think they might have tampered with the game? Just a hunch!
```

## Recon

Upon opening the challenge, we're greeted with an explanation of the game:

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-connect/game-welcome.png" title="Game explanation" >}}

## Silver

The game seems simple enough, click four words that are connected and go through the rounds. Depending on your knowledge of Christmas terms, you may fly through this no problem. My knowledge about it is not so good, but I decided to play the game normally at first anyway. With some Googling I got through the challenge and got the silver medal.

There are, however, multiple ways to solve the game. And we'll need to exploit this to get the gold medal.

## Gold

For gold, we'll need to inspect the code behind the game.

We can open the DevTools, and under "Sources" we can find the iframe in which the game is running. Here we can see all the files that are being used.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-connect/sources.png" title="DevTools Sources" >}}

Looking through this code, we can actually find the correct word sets.

<!-- prettier-ignore-start -->
```js
const wordSets = {
    1: ["Tinsel", "Sleigh", "Belafonte", "Bag", "Comet", "Garland", "Jingle Bells", "Mittens", "Vixen", "Gifts", "Star", "Crosby", "White Christmas", "Prancer", "Lights", "Blitzen"],
    2: ["Nmap", "burp", "Frida", "OWASP Zap", "Metasploit", "netcat", "Cycript", "Nikto", "Cobalt Strike", "wfuzz", "Wireshark", "AppMon", "apktool", "HAVOC", "Nessus", "Empire"],
    3: ["AES", "WEP", "Symmetric", "WPA2", "Caesar", "RSA", "Asymmetric", "TKIP", "One-time Pad", "LEAP", "Blowfish", "hash", "hybrid", "Ottendorf", "3DES", "Scytale"],
    4: ["IGMP", "TLS", "Ethernet", "SSL", "HTTP", "IPX", "PPP", "IPSec", "FTP", "SSH", "IP", "IEEE 802.11", "ARP", "SMTP", "ICMP", "DNS"]
};
// ...
let correctSets = [
    [0, 5, 10, 14], // Set 1
    [1, 3, 7, 9],   // Set 2
    [2, 6, 11, 12], // Set 3
    [4, 8, 13, 15]  // Set 4
];
```
<!-- prettier-ignore-end -->

This means two things. Firstly, if your knowledge is as bad as mine, you can just write some code to get the correct combinations. But, secondly, and more importantly, if the correct set is here, the checks are also likely done client-side (meaning in your browser, and not on the server).

If you're wondering how to get the correct combinations, you can do it like this:

```js
Object.keys(wordSets).map((round) =>
    correctSets.map((correctSet) =>
        correctSet.map((index) => wordSets[round][index])
    )
);
```

This might look a little complicated, so let me explain it for you. We start by looping over `wordSets`, this contains all the words for a specific round. We then look at the correct sets, and map the four indices to the actual word in the list. If we execute this code, we get the following output:

{{< code language="json" title="Results" isCollapsed="true" >}}

```json
[
    [
        ["Tinsel", "Garland", "Star", "Lights"],
        ["Sleigh", "Bag", "Mittens", "Gifts"],
        ["Belafonte", "Jingle Bells", "Crosby", "White Christmas"],
        ["Comet", "Vixen", "Prancer", "Blitzen"]
    ],
    [
        ["Nmap", "netcat", "Wireshark", "Nessus"],
        ["burp", "OWASP Zap", "Nikto", "wfuzz"],
        ["Frida", "Cycript", "AppMon", "apktool"],
        ["Metasploit", "Cobalt Strike", "HAVOC", "Empire"]
    ],
    [
        ["AES", "RSA", "Blowfish", "3DES"],
        ["WEP", "WPA2", "TKIP", "LEAP"],
        ["Symmetric", "Asymmetric", "hash", "hybrid"],
        ["Caesar", "One-time Pad", "Ottendorf", "Scytale"]
    ],
    [
        ["IGMP", "IPX", "IP", "ICMP"],
        ["TLS", "SSL", "IPSec", "SSH"],
        ["Ethernet", "PPP", "IEEE 802.11", "ARP"],
        ["HTTP", "FTP", "SMTP", "DNS"]
    ]
]
```

{{< /code >}}

This just get us the correct answer though, and we'll need more for gold.

Scanning further through the code, we find the `checkSelectedSet` function with some logic in it:

```js
function checkSelectedSet(scene) {
    // ...
    if (isCorrectSet) {
        // ...
        // Update score by 100 points
        score += 100;
        scoreText.setText("Score: " + score);

        // Add high-score board
        if (score > 50000) {
            highScoreText.setText("High Score: " + score);
            emitter.explode(20);
            submitAction(2);
            displaySuccessMessage(
                "Great Job Hacker! Elf Connect Complete and Hacked!",
                function () {}
            );
        }
        // ...
    }
    // ...
}
```

In the code we can see that once a score of over 50000 has been achieved, it calls `submitAction(2)`. This looks suspicious. The only other place where the function is being called is on a normal win, in that case it passes `1` as the argument instead of `2`.

Let's execute this function on its own. To do this, we'll first need to attach our console to the iframe the game is running in. We can do so by clicking "top" in the top left corner of the DevTools, and selecting the iframe.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-connect/iframe-console.png" title="Attach console to iframe" >}}

We can then enter the code in the console, and..., we got the gold medal!

{{< figure src="/img/writeups/holiday-hack-challenge/2024/prologue/elf-connect/submitaction.png" title="Running the code" >}}
