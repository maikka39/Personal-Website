+++
author = "Maik de Kruif"
title = "Challenge 24 - AdventOfCTF"
date = 2021-09-22T12:12:12+01:00
description = "A writeup for challenge 24 of AdventOfCTF."
cover = "img/adventofctf/b915cb528c4b3d6fc4644f73ba8b829d.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "python",
    "serialization",
    "blockchain",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 2400

## Description

The final battle! The elves want revenge for their lost game! They have enhanced the tic-tac-toe game with blockchain technology. Cyber Security on the Blockchain will revolutionize everything, but most importantly ensure they will win this time. No cheating Santa!

Visit <https://24.adventofctf.com> to start the challenge.

## Recon

When opening the page, we're greeted with what looks like the same screen as we had on [challenge 20]({{< ref "challenge_20.md" >}}). The only noticeable difference is the addition of `blockchain? True` in the footer.

If we take a look at the source, we also find a comment with the following python code:

```py
# <!-- Development notes: Do not let santa see!

def hash_string(string):
    return hashlib.md5(string.encode('utf-8')).hexdigest()

def hash_row(row):
    conv = lambda i : i or ' '
    res = [conv(i) for i in row]
    return hash_string(' '.join(res))

def hash_board(board):
    acc = ""
    for row in board:
        acc += hash_row(row)
    return acc

def verify_chain(game):
    board=game["board"]
    chain = game["chain"]

    if len(chain) > 0:
        if board != chain[-1]["board"]:
            return False

    for i in range(len(chain)):
        block=chain[i]
        h = hash_board(block["board"])
        h = hash_string(h + block["prev"])
        if h != block["hash"]:
            return False
    return True

# -->
```

Just like in challenge 20, we alse find a game cookie:

```text
game=gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhoBGgGaAZlZVgEAAAAdHVybnEIaAZYCAAAAGZpbmlzaGVkcQmJWAYAAAB3aW5uZXJxClgAAAAAcQtYBAAAAHNhbmVxDIhYCgAAAGJsb2NrY2hhaW5xDYhYBQAAAGNoYWlucQ5dcQ8ofXEQKGgBXXERKF1xEihOTk5lXXETKE5OTmVdcRQoTk5oBmVlWAQAAABwcmV2cRVYIAAAAGNlZjIxNWM1YmU4Y2Y2M2ZjZjNkNDNlY2YyNTEwYjMzcRZYBAAAAGhhc2hxF1ggAAAAZTdkYzhlMWY3YTY3ODhiYzBjYjY4NDE1MzhiMjE2ZThxGHV9cRkoaAFdcRooXXEbKGgETk5lXXEcKE5OTmVdcR0oTk5oBmVlaBVoGGgXWCAAAABmYzkzMjM2YjVlZWE1ZjFkNTVlMmI1YjMwOGQ2NzM5MHEedX1xHyhoAV1xIChdcSEoaAROTmVdcSIoTmgGTmVdcSMoTk5oBmVlaBVoHmgXWCAAAABhOGRjMGQzZGEyOTBkMWU4OTRlYWFmZmNiOTgzOThjOXEkdX1xJShoAV1xJihdcScoaARoBE5lXXEoKE5oBk5lXXEpKE5OaAZlZWgVaCRoF1ggAAAAZTc0ZjViMjJmNTIxM2JhNGMyNDQ5NzU5Y2U5MWMyYWFxKnV9cSsoaAFdcSwoXXEtKGgEaAROZV1xLihOaAZoBmVdcS8oTk5oBmVlaBVoKmgXWCAAAABlZjI1NTE0ZGZmYmY4MjQ3Y2ZmNjA2M2JlOTBmMmQ1NHEwdX1xMShoAV1xMihdcTMoaARoBE5lXXE0KGgEaAZoBmVdcTUoTk5oBmVlaBVoMGgXWCAAAABlM2E0YzAzN2JkZjE1NGIzNDRlZDliZDE2NDNhNjI5ZHE2dX1xNyhoAV1xOChdcTkoaARoBE5lXXE6KGgEaAZoBmVdcTsoTmgGaAZlZWgVaDZoF1ggAAAAYzI0MGZhMTYxNzM3Yzk2N2VjZTVmZDk0NjcyYWIwZjhxPHV9cT0oaAFdcT4oXXE/KGgEaAROZV1xQChoBGgGaAZlXXFBKGgEaAZoBmVlaBVoPGgXWCAAAAAyNGJhNzE1ZGMwNTY4M2NlNDViOWUxOTFlZDE4OGI5Y3FCdWV1Lg==
```

## Finding the vulnerability

Using the same method as in challenge 20, we can take a look at the board:

```py
In [1]: import pickle

In [2]: import base64

In [3]: pickle.loads(base64.b64decode("gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhoBGgGaAZlZVgEAAAAdHVybnEIaAZYCAAAAGZpbmlzaGVkcQmJWAYAAAB3aW5uZXJxClgAAAAAcQtYBAAAAHNhbmVxDIhYCgAAAGJsb2NrY2hhaW5xDYhYBQAAAGNoYWlucQ5dcQ8ofXEQKGgBXXERKF1xEihOTk5lXXETKE5OTmVdcRQoTk5oBmVlWAQAAABwcmV2cRVYIAAAAGNlZjIxNWM1YmU4Y2Y2M2ZjZjNkNDNlY2YyNTEwYjMzcRZYBAAAAGhhc2hxF1ggAAAAZTdkYzhlMWY3YTY3ODhiYzBjYjY4NDE1MzhiMjE2ZThxGHV9cRkoaAFdcRooXXEbKGgETk5lXXEcKE5OTmVdcR0oTk5oBmVlaBVoGGgXWCAAAABmYzkzMjM2YjVlZWE1ZjFkNTVlMmI1YjMwOGQ2NzM5MHEedX1xHyhoAV1xIChdcSEoaAROTmVdcSIoTmgGTmVdcSMoTk5oBmVlaBVoHmgXWCAAAABhOGRjMGQzZGEyOTBkMWU4OTRlYWFmZmNiOTgzOThjOXEkdX1xJShoAV1xJihdcScoaARoBE5lXXEoKE5oBk5lXXEpKE5OaAZlZWgVaCRoF1ggAAAAZTc0ZjViMjJmNTIxM2JhNGMyNDQ5NzU5Y2U5MWMyYWFxKnV9cSsoaAFdcSwoXXEtKGgEaAROZV1xLihOaAZoBmVdcS8oTk5oBmVlaBVoKmgXWCAAAABlZjI1NTE0ZGZmYmY4MjQ3Y2ZmNjA2M2JlOTBmMmQ1NHEwdX1xMShoAV1xMihdcTMoaARoBE5lXXE0KGgEaAZoBmVdcTUoTk5oBmVlaBVoMGgXWCAAAABlM2E0YzAzN2JkZjE1NGIzNDRlZDliZDE2NDNhNjI5ZHE2dX1xNyhoAV1xOChdcTkoaARoBE5lXXE6KGgEaAZoBmVdcTsoTmgGaAZlZWgVaDZoF1ggAAAAYzI0MGZhMTYxNzM3Yzk2N2VjZTVmZDk0NjcyYWIwZjhxPHV9cT0oaAFdcT4oXXE/KGgEaAROZV1xQChoBGgGaAZlXXFBKGgEaAZoBmVlaBVoPGgXWCAAAAAyNGJhNzE1ZGMwNTY4M2NlNDViOWUxOTFlZDE4OGI5Y3FCdWV1Lg=="))

```

This time our board is quite a bit larger:

{{< code language="py" title="Board" >}}

```py
{
  "blockchain": True,
  "board": [
    ["O", "O", None],
    ["O", "X", "X"],
    [None, "X", "X"]
  ],
  "chain": [
    {
      "board": [
        [None, None, None],
        [None, None, None],
        [None, None, "X"]
      ],
      "hash": "e7dc8e1f7a6788bc0cb6841538b216e8",
      "prev": "cef215c5be8cf63fcf3d43ecf2510b33"
    },
    {
      "board": [
        ["O", None, None],
        [None, None, None],
        [None, None, "X"]
      ],
      "hash": "fc93236b5eea5f1d55e2b5b308d67390",
      "prev": "e7dc8e1f7a6788bc0cb6841538b216e8"
    },
    {
      "board": [
        ["O", None, None],
        [None, "X", None],
        [None, None, "X"]
      ],
      "hash": "a8dc0d3da290d1e894eaaffcb98398c9",
      "prev": "fc93236b5eea5f1d55e2b5b308d67390"
    },
    {
      "board": [
        ["O", "O", None],
        [None, "X", None],
        [None, None, "X"]
      ],
      "hash": "e74f5b22f5213ba4c2449759ce91c2aa",
      "prev": "a8dc0d3da290d1e894eaaffcb98398c9"
    },
    {
      "board": [
        ["O", "O", None],
        [None, "X", "X"],
        [None, None, "X"]
      ],
      "hash": "ef25514dffbf8247cff6063be90f2d54",
      "prev": "e74f5b22f5213ba4c2449759ce91c2aa"
    },
    {
      "board": [
        ["O", "O", None],
        ["O", "X", "X"],
        [None, None, "X"]
      ],
      "hash": "e3a4c037bdf154b344ed9bd1643a629d",
      "prev": "ef25514dffbf8247cff6063be90f2d54"
    },
    {
      "board": [
        ["O", "O", None],
        ["O", "X", "X"],
        [None, "X", "X"]
      ],
      "hash": "c240fa161737c967ece5fd94672ab0f8",
      "prev": "e3a4c037bdf154b344ed9bd1643a629d"
    }
  ],
  "finished": False,
  "sane": True,
  "turn": "O",
  "winner": ""
}
```

{{< /code >}}

We can see that a `chain` value has been added. From the title of this challenge, we can say that this is the blockchain that we likely have to bypass.

## Exploit

Cracking this shouldn't be too hard. Let's start by copying our script from challenge 20 and resetting the chain:

```py
import base64
import pickle

board_b64 = "gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhOaAZoBmVlWAQAAAB0dXJucQhoBFgIAAAAZmluaXNoZWRxCYlYBgAAAHdpbm5lcnEKWAAAAABxC1gEAAAAc2FuZXEMiFgKAAAAYmxvY2tjaGFpbnENiFgFAAAAY2hhaW5xDl1xDyh9cRAoaAFdcREoXXESKE5OTmVdcRMoTk5OZV1xFChOTmgGZWVYBAAAAHByZXZxFVggAAAAY2VmMjE1YzViZThjZjYzZmNmM2Q0M2VjZjI1MTBiMzNxFlgEAAAAaGFzaHEXWCAAAABlN2RjOGUxZjdhNjc4OGJjMGNiNjg0MTUzOGIyMTZlOHEYdX1xGShoAV1xGihdcRsoaAROTmVdcRwoTk5OZV1xHShOTmgGZWVoFWgYaBdYIAAAAGZjOTMyMzZiNWVlYTVmMWQ1NWUyYjViMzA4ZDY3MzkwcR51fXEfKGgBXXEgKF1xIShoBE5OZV1xIihOaAZOZV1xIyhOTmgGZWVoFWgeaBdYIAAAAGE4ZGMwZDNkYTI5MGQxZTg5NGVhYWZmY2I5ODM5OGM5cSR1fXElKGgBXXEmKF1xJyhoBGgETmVdcSgoTmgGTmVdcSkoTk5oBmVlaBVoJGgXWCAAAABlNzRmNWIyMmY1MjEzYmE0YzI0NDk3NTljZTkxYzJhYXEqdX1xKyhoAV1xLChdcS0oaARoBE5lXXEuKE5oBmgGZV1xLyhOTmgGZWVoFWgqaBdYIAAAAGVmMjU1MTRkZmZiZjgyNDdjZmY2MDYzYmU5MGYyZDU0cTB1fXExKGgBXXEyKF1xMyhoBGgETmVdcTQoaARoBmgGZV1xNShOTmgGZWVoFWgwaBdYIAAAAGUzYTRjMDM3YmRmMTU0YjM0NGVkOWJkMTY0M2E2MjlkcTZ1fXE3KGgBXXE4KF1xOShoBGgETmVdcTooaARoBmgGZV1xOyhOaAZoBmVlaBVoNmgXWCAAAABjMjQwZmExNjE3MzdjOTY3ZWNlNWZkOTQ2NzJhYjBmOHE8dWV1Lg=="

game = pickle.loads(base64.b64decode(board_b64))

game["board"] = [['X', 'X', 'X'], ['O', None, 'O'], [None, None, None]]
game["chain"] = []
game["finished"] = True
game["winner"] = 'X'
game["turn"] = 'O'

print(base64.b64encode(pickle.dumps(data)))
```

Sadly, just submitting the result of this script doesn't work. We have to fill the chain.

To find out how the chain works, let's take another look at the `verify_chain()` function:

```py
def verify_chain(game):
    board=game["board"]
    chain = game["chain"]

    if len(chain) > 0:
        if board != chain[-1]["board"]:
            return False

    for i in range(len(chain)):
        block=chain[i]
        h = hash_board(block["board"])
        h = hash_string(h + block["prev"])
        if h != block["hash"]:
            return False
    return True
```

We can see that, to verify the game, the function loops through all the blocks in the chain. It then calculates a hash based on the board, and the previous hash and compares that to the actual hash in the block (the user provided one).

To crack this, we can simply reverse this algorithm. To do this, I grabbed the script from the HTML source, and added a crack method like so:

{{< code language="py" title="solve.py" >}}

```python
import hashlib
import pickle
import base64


def load_base64(base64_string):
    return pickle.loads(base64.b64decode(base64_string))


def export_base64(game):
    return base64.b64encode(pickle.dumps(game)).decode()


def hash_string(string):
    return hashlib.md5(string.encode('utf-8')).hexdigest()


def hash_row(row):
    def conv(i): return i or ' '
    res = [conv(i) for i in row]
    return hash_string(' '.join(res))


def hash_board(board):
    acc = ""
    for row in board:
        acc += hash_row(row)
    return acc


def verify_chain(game):
    board = game["board"]
    chain = game["chain"]

    if len(chain) > 0:
        if board != chain[-1]["board"]:
            return False

    for block in chain:
        h = hash_board(block["board"])
        h = hash_string(h + block["prev"])
        if h != block["hash"]:
            return False
    return True


def crack(game):
    game["board"] = [['X', 'X', 'X'], ['O', None, 'O'], [None, None, None]]
    game["chain"] = []
    game["finished"] = True
    game["winner"] = 'X'
    game["turn"] = 'O'

    board = game["board"]

    h = hash_board(board)
    h = hash_string(h)

    game["chain"].append({
        "board": board,
        "hash": h,
        "prev": ""
    })


if __name__ == "__main__":
    game = load_base64("gAN9cQAoWAUAAABib2FyZHEBXXECKF1xAyhYAQAAAE9xBGgETmVdcQUoaARYAQAAAFhxBmgGZV1xByhOaAZoBmVlWAQAAAB0dXJucQhoBFgIAAAAZmluaXNoZWRxCYlYBgAAAHdpbm5lcnEKWAAAAABxC1gEAAAAc2FuZXEMiFgKAAAAYmxvY2tjaGFpbnENiFgFAAAAY2hhaW5xDl1xDyh9cRAoaAFdcREoXXESKE5OTmVdcRMoTk5OZV1xFChOTmgGZWVYBAAAAHByZXZxFVggAAAAY2VmMjE1YzViZThjZjYzZmNmM2Q0M2VjZjI1MTBiMzNxFlgEAAAAaGFzaHEXWCAAAABlN2RjOGUxZjdhNjc4OGJjMGNiNjg0MTUzOGIyMTZlOHEYdX1xGShoAV1xGihdcRsoaAROTmVdcRwoTk5OZV1xHShOTmgGZWVoFWgYaBdYIAAAAGZjOTMyMzZiNWVlYTVmMWQ1NWUyYjViMzA4ZDY3MzkwcR51fXEfKGgBXXEgKF1xIShoBE5OZV1xIihOaAZOZV1xIyhOTmgGZWVoFWgeaBdYIAAAAGE4ZGMwZDNkYTI5MGQxZTg5NGVhYWZmY2I5ODM5OGM5cSR1fXElKGgBXXEmKF1xJyhoBGgETmVdcSgoTmgGTmVdcSkoTk5oBmVlaBVoJGgXWCAAAABlNzRmNWIyMmY1MjEzYmE0YzI0NDk3NTljZTkxYzJhYXEqdX1xKyhoAV1xLChdcS0oaARoBE5lXXEuKE5oBmgGZV1xLyhOTmgGZWVoFWgqaBdYIAAAAGVmMjU1MTRkZmZiZjgyNDdjZmY2MDYzYmU5MGYyZDU0cTB1fXExKGgBXXEyKF1xMyhoBGgETmVdcTQoaARoBmgGZV1xNShOTmgGZWVoFWgwaBdYIAAAAGUzYTRjMDM3YmRmMTU0YjM0NGVkOWJkMTY0M2E2MjlkcTZ1fXE3KGgBXXE4KF1xOShoBGgETmVdcTooaARoBmgGZV1xOyhOaAZoBmVlaBVoNmgXWCAAAABjMjQwZmExNjE3MzdjOTY3ZWNlNWZkOTQ2NzJhYjBmOHE8dWV1Lg==")
    crack(game)
    print(export_base64(game))
```

{{< /code >}}

After running this script, we get the following result:

```text
gASVsgAAAAAAAAB9lCiMBWJvYXJklF2UKF2UKIwBWJRoBGgEZV2UKIwBT5ROaAZlXZQoTk5OZWWMBHR1cm6UaAaMCGZpbmlzaGVklIiMBndpbm5lcpRoBIwEc2FuZZSIjApibG9ja2NoYWlulIiMBWNoYWlulF2UfZQojAVib2FyZJRoAowEaGFzaJSMIDZkZTM2NDM0OTAwZTI4YTdlYWYwNDhhYjBhY2JlNjA0lIwEcHJldpSMAJR1YXUu
```

When we set this and refresh the page, we get the following message: `"Game goes to: X NOVI{blockchain_cyb3r_security} Thank you for playing Advent of CTF! I hope you have a great christmas!"`.

## Solution

We got the flag! It is `NOVI{blockchain_cyb3r_security}`.
