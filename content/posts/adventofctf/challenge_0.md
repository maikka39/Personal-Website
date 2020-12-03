+++
author = "Maik de Kruif"
title = "Challenge 0 - AdventOfCTF"
date = 2020-12-02T17:20:28+01:00
description = "Challenge 0 of AdventOfCTF."
cover = "img/adventofctf/f90b2bf3f08ee628c09505ff309018ed.png"
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

- Points: 1

## Description

Do you remember the flag in the teaser website?

## Solution

Sadly, the teaser website isn't online anymore. If only someone kept an archive of the internet. This is where the Wayback Machine on [archive.org](https://archive.org/) comes in handy.

So, let's use the Wayback Machine to get the teaser page. <https://web.archive.org/web/20201112020839/https://adventofctf.com/>

When we take a look at the source html of the page we find the following comment:

```html
<!-- Ceasar worked on this you know. Tk9WSXtIRVlfMVNfVGgxU19AX0ZsYTk/fQ== -->
```

It looks like some encoded string. If you've been doing CTFs for a while you'll probably recognize it's encoded in `base64`. We can use the program `base64` to decode this string.

```bash
> echo "Tk9WSXtIRVlfMVNfVGgxU19AX0ZsYTk/fQ==" | base64 -d
NOVI{HEY_1S_Th1S_@_Fla9?}
```

We found the flag! It's `NOVI{HEY_1S_Th1S_@_Fla9?}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#0-1).
