+++
author = "Maik de Kruif"
title = "The Source"
subtitle = "Challenge 1 - AdventOfCTF"
date = 2020-12-02T17:27:25+01:00
description = "A writeup for challenge 1 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/3f12301d8715a1371d2d776d25ea6ab6.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 100

## Description

All starts should be easy

Visit <https://01.adventofctf.com> to start the challenge.

## Solution

When opening the page, we're asked for Santa's password. Unfortunately, we don't know the password. Don't stop there though, mayby someone has hidden it in the source html.

Let's open the source by pressing `Ctrl + U` and take a look at it. Near the bottom we find the following comment:

```html
<!-- This is an odd encoded thing right? YWR2ZW50X29mX2N0Zl9pc19oZXJl -->
```

This looks like a `base64` encoded string so let's use the program `base64` with the `-d` decode flag to decode the text.

```bash
> echo "YWR2ZW50X29mX2N0Zl9pc19oZXJl" | base64 -d
advent_of_ctf_is_here
```

We get some plain text. If we enter it as Santa's password on the challenge page, it gives us the flag: `NOVI{L3T_7H3_M0NTH_0F_FUN_START}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#1-2).
