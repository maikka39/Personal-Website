+++
author = "Maik de Kruif"
title = "Challenge 0 - AdventOfCTF"
date = 2020-12-02T17:20:28+01:00
description = "Challenge 0 of AdventOfCTF."
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking"
]
categories = [
    "ctf",
    "hacking",
]
+++

- Points: 1

## Description

Do you remember the flag in the teaser website?

## Solution

Use the Wayback Machine to get the teaser page.
<https://web.archive.org/web/20201112020839/https://adventofctf.com/>

When taking a look at the source we find the following comment:

```html
<!-- Ceasar worked on this you know. Tk9WSXtIRVlfMVNfVGgxU19AX0ZsYTk/fQ== -->
```

If we then use `base64` to decode this string we get `NOVI{HEY_1S_Th1S_@_Fla9?}`.

```bash
> echo "Tk9WSXtIRVlfMVNfVGgxU19AX0ZsYTk/fQ==" | base64 -d
NOVI{HEY_1S_Th1S_@_Fla9?}
```

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#0-1).
