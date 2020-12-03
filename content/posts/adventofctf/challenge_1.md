+++
author = "Maik de Kruif"
title = "Challenge 1 - AdventOfCTF"
date = 2020-12-02T17:27:25+01:00
description = "Challenge 1 of AdventOfCTF."
tags = [
    "AdventOfCTF",
    "challenge",
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

- Points: 100

## Description

All starts should be easy

Visit <https://01.adventofctf.com> to start the challenge.

## Solution

When taking a look at the source we find the following comment:

```html
<!-- This is an odd encoded thing right? YWR2ZW50X29mX2N0Zl9pc19oZXJl -->
```

If we then use `base64` to decode this string we get `advent_of_ctf_is_here`.

```bash
> echo "YWR2ZW50X29mX2N0Zl9pc19oZXJl" | base64 -d
advent_of_ctf_is_here
```

We can then enter this string on the challenge website after which it will give us the flag: `NOVI{L3T_7H3_M0NTH_0F_FUN_START}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#1-2).
