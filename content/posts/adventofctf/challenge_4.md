+++
author = "Maik de Kruif"
title = "Challenge 4 - AdventOfCTF"
date = 2020-12-04T09:58:46+01:00
description = "Challenge 4 of AdventOfCTF."
cover = "img/adventofctf/f1d6ca5572e0c012239bcf4a8f797be1.png"
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

- Points: 400

## Description

There are people who think you can hide important things by making it hard to read.

Visit <https://04.adventofctf.com> to start the challenge.

## Solution

When opening the website we're (for the first time) not provided with a login form. It is still authentication though as we are greeted with a message: "If you have access to it the special present will be shown below:". Also, I noticed the URL changed after about five seconds. That hints at some javascript, so let's open the sources tab in devtools. We find `login.js`.

{{< code language="js" title="login.js" >}}

```js
function startup() {
  key = localStorage.getItem("key");

  if (key === null) {
    localStorage.setItem("key", "eyJ1c2VyaWQiOjB9.1074");
  }
}

var _0x1fde = ["charCodeAt"];
(function (_0x93ff3a, _0x1fded8) {
  var _0x39b47b = function (_0x54f1d3) {
    while (--_0x54f1d3) {
      _0x93ff3a["push"](_0x93ff3a["shift"]());
    }
  };
  _0x39b47b(++_0x1fded8);
})(_0x1fde, 0x192);
var _0x39b4 = function (_0x93ff3a, _0x1fded8) {
  _0x93ff3a = _0x93ff3a - 0x0;
  var _0x39b47b = _0x1fde[_0x93ff3a];
  return _0x39b47b;
};
function calculate(_0x54f1d3) {
  var _0x58628b = _0x39b4,
    _0xc289d4 = 0x0;
  for (let _0x19ddf3 in text) {
    _0xc289d4 += text[_0x58628b("0x0")](_0x19ddf3);
  }
  return _0xc289d4;
}

function check() {
  key = localStorage.getItem("key");
  hash = window.location.search.split("?")[1];

  if (key !== null && hash != "token=" + key) {
    parts = key.split(".");
    text = atob(parts[0]);
    checksum = parseInt(parts[1]);

    count = calculate(text);

    if (count == checksum) {
      setTimeout(function () {
        window.location = "index.php?token=" + key;
      }, 5000);
    }
  }
}

startup();
check();
```

{{< /code >}}

This looks like some obfuscated code. So I started with de-obfuscating the code. After a few minutes of reading the code, I remembered to always start at the output. And after looking at the `check()` function I found out I had wasted my time.

As it turns out, we don't need to know what the obfuscated code does. If we read the `check()` function carefully, we see that we don't actually need to know what calculate does, we only need the output. I've added the commented code below:

```js
function check() {
  // Get key from localStorage
  // The key is initialized in startup()
  // > "eyJ1c2VyaWQiOjB9.1074"
  key = localStorage.getItem("key");

  // Get the token from the url
  // > "token=eyJ1c2VyaWQiOjB9.1074"
  hash = window.location.search.split("?")[1];

  // If key and hash are not empty:
  if (key !== null && hash != "token=" + key) {
    // Split the key by a .
    // > (2) ["eyJ1c2VyaWQiOjB9", "1074"]
    parts = key.split(".");

    // Decode the base64 from the first part of the key
    // > "{"userid":0}"
    text = atob(parts[0]);

    // Get the value of the second part of the key as an int
    // > 1074
    checksum = parseInt(parts[1]);

    // Calculate the value of text
    // > 1074
    count = calculate(text);

    // If the last part of the key is correct:
    if (count == checksum) {
      // Execute this function after 5000ms
      setTimeout(function () {
        // Execute a get request with the token parameter
        window.location = "index.php?token=" + key;
      }, 5000);
    }
  }
}
```

Now that we understand how it works, we cen reverse it. We know that the last part of the key (that is, after the `.`) is the value of calculate and the first part of the key is some base64 encoded JSON.

To reverse the functionality we, firstly, have to know the value of `text` so that we can calculate `count` and thus the last part of the url. Secondly, we calculate the base64 encoded value of `text`.

Let's turn this into some code:

```js
function generateHash(input) {
  // Set the global text variable defined in
  // login.js, otherwise calculate doesn't work
  text = input;

  let count = calculate(text);
  let key = btoa(text) + "." + count;

  console.log(key);
}

generateHash('{"userid":0}');
```

Now that the key algorithm has been reversed, we can try some inputs. Currently the `userid` in the input is `0`, so lets try `1`.

```js
generateHash('{"userid":1}');
// > "eyJ1c2VyaWQiOjF9.1075"
```

Let's try to use this key. As we saw in the `check()` function, the key is submitted as the token. To submit the key, we go to <https://04.adventofctf.com/index.php?token=eyJ1c2VyaWQiOjF9.1075>.

Now we're greeted with a flag. But be quick, as the `timeout` from `check()` will kick in after five seconds. The flag is `NOVI{0bfusc@t3_all_U_w@n7}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#4-5).
