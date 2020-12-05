+++
author = "Maik de Kruif"
title = "Challenge 2 - AdventOfCTF"
date = 2020-12-02T17:30:25+01:00
description = "Challenge 2 of AdventOfCTF."
cover = "img/adventofctf/948b1eb046c96865a05808660ee99e10.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "cookies",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 200

## Description

For the 2nd challenge you will need to bypass the login mechanism.

Visit <https://02.adventofctf.com> to start the challenge.

## Solution

When opening the website we're provided with a login form. If we fill in the form with random data, we're greeted with some text that says a guest cannot access the flag.

After trying several things, I opened the devtools to have a look at the cookies. Here we find a cookie with the name `authenticated`:

```cookie
authenticated=eyJndWVzdCI6InRydWUiLCJhZG1pbiI6ImZhbHNlIn0%3D
```

The value of this cookie looks like a base64 encoded string so lets try to decode it:

_Note: in a url encoded string, the text `%3D` means a `=`._

```bash
> echo "eyJndWVzdCI6InRydWUiLCJhZG1pbiI6ImZhbHNlIn0=" | base64 -d
{"guest":"true","admin":"false"}%
```

The result is some JSON data which specifies whether we are a guest or an admin.

Normally, we can easily alter the string to say we're an admin, but this time there is some weird non-printable character at the end. This means we can't easily modify it while still having the correct response. To circumvent this, I'll use `sed` to replace the string while keeping the non-printable character:

```bash
> echo "eyJndWVzdCI6InRydWUiLCJhZG1pbiI6ImZhbHNlIn0=" | base64 -d | sed 's/"guest":"true"/"guest":"false"/g' | sed 's/"admin":"false"/"admin":"true"/g' | base64
eyJndWVzdCI6ImZhbHNlIiwiYWRtaW4iOiJ0cnVlIn0=
```

If we put this string back into the cookie and refresh the page we get the flag: `NOVI{cookies_are_bad_for_auth}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#2-3).
