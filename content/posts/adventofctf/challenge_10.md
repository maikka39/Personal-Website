+++
author = "Maik de Kruif"
title = "Challenge 10 - AdventOfCTF"
date = 2020-12-11T22:12:42+01:00
description = "A writeup for challenge 10 of AdventOfCTF."
cover = "img/adventofctf/ba15475608ea3f8313825eec5dceac06.png"
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

- Points: 1000

## Description

When files are included things can get real messy. The flag is in flag.php.

Visit <https://10.adventofctf.com> to start the challenge.

## Finding the vulnerability

When opening the website we get some text but it is not really useful. So let's go to [`/flag.php`](https://10.adventofctf.com/flag.php) because the description told us the flag is there.

When opening `/flag.php` we get a message "You are on the right page, but you cannot see what you want yet. Go get promoted!". Hmm, let's take a look at the cookies.

We find one cookie: `zeroten=eyJwYWdlIjoibWFpbiIsInJvbGUiOiIxMmRlYTk2ZmVjMjA1OTM1NjZhYjc1NjkyYzk5NDk1OTY4MzNhZGM5In0%3D`. this looks base64 encoded, so let's try to decode it:

```bash
echo -n "eyJwYWdlIjoibWFpbiIsInJvbGUiOiIxMmRlYTk2ZmVjMjA1OTM1NjZhYjc1NjkyYzk5NDk1OTY4MzNhZGM5In0=" | base64 -d
```

```json
{ "page": "main", "role": "12dea96fec20593566ab75692c9949596833adc9" }
```

We see that we have a `page` and a `role`. Let's try to replace modify `page` to "flag".

```bash
echo -n '{"page":"flag","role":"12dea96fec20593566ab75692c9949596833adc9"}' | base64 -w 0
> eyJwYWdlIjoiZmxhZyIsInJvbGUiOiIxMmRlYTk2ZmVjMjA1OTM1NjZhYjc1NjkyYzk5NDk1OTY4MzNhZGM5In0=
```

We changing the cookie to the new value we get.. nothing... After going back to the home page, we get the text of `/flag.php` so this is probably Local File Inclusion. Let's take another look at the `role`. I don't recognize the format so let's try our friend Google.

It looks like it is the `SHA-1` hash of "user". We could try to replace the `role` with the `SHA-1` hash of "admin". We can use an online sha1 converter to do this. The output is `d033e22ae348aeb5660fc2140aec35850c4da997`. Now we base64 encode this and put it back into the cookie.

```bash
echo -n '{"page":"flag","role":"d033e22ae348aeb5660fc2140aec35850c4da997"}' | base64 -w 0
> eyJwYWdlIjoiZmxhZyIsInJvbGUiOiJkMDMzZTIyYWUzNDhhZWI1NjYwZmMyMTQwYWVjMzU4NTBjNGRhOTk3In0=
```

## Solution

If we now reload the home page, we're greeted with the flag: `NOVI{LFI_1s_ask1ng_f0r_tr0bl3}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#10-11).
