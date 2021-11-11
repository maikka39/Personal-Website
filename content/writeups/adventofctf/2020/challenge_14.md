+++
author = "Maik de Kruif"
title = "Juggler"
subtitle = "Challenge 14 - AdventOfCTF"
date = 2020-12-14T19:45:51+01:00
description = "A writeup for challenge 14 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/dd04640480d764ab09eea047cde749cd.png"
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

- Points: 1400

## Description

We are testing a new 2-factor security system for Santa's deepest secrets. It should be pretty secure!

Visit <https://14.adventofctf.com> to start the challenge.

## Finding the vulnerability

Upon opening the challenge website we're greeted with some PHP code, as well as two input fields. The PHP code is the following:

```php
<?php

ini_set('display_errors', 0);

include("flag.php");

if (isset($_POST["password"], $_POST["verifier"])) {
    $password = $_POST["password"];
    $verifier = $_POST["verifier"];

    $hash = sha1($password + $secret_salt);
    $reference = substr($hash, 0, 7);

    if ($verifier === $reference) {
        echo $flag;
        die();
    }
}

header("Location: /index.php?error=That was not right.");
exit();

?>
```

As we can see, we only get the flag if `$verifier` is equal to `$reference`, where `$reference` is the `SHA-1` hash of the password in our request together with `$secret_salt`.

_Note: when I started with this challenge, [@credmp](https://twitter.com/credmp) had already posted a hint which I, unfortunately, saw. It said "The salt is a number."._

## Type Juggling

Because we already know `$secret_salt` is a number, we can leverage PHP type juggling to generate a known value for the hashing algorithm. But first, what is type juggling?

Because PHP does not support explicit type definition in a variable declaration, a variable's type is determined by the context in which the variable is used. For instance, if a `string` value is assigned to a variable `$var`, `$var` becomes a string. But if an `int` value is then assigned to `$var`, it becomes an int. This means that if we have a `string` and add an `int` to it, the outcome will be an `int`. The value of this `int` depends on what is inside the `string`. If the `string` starts with a number, it will be interpreted as an `int` with the value of the number inside the `string`, and if it starts with a letter, it will be interpreted as `0`.

For example, if we have a variable with the value `"hello"`, it will be converted to `0`. And if we have a variable with the value `"24"` or `"12ab"` it will be interpreted as `24` and `12` respectively.

## Generating a verifier value

To see what input will be converted to what output, we can create a little script that will generate those values for us. An example would be the following:

```php
<?php
$password = "1a";
$secret_salt = "11";

$hash = sha1($password + $secret_salt);
$reference = substr($hash, 0, 7);

echo ($password + $secret_salt)."\n";
echo $hash."\n";
echo $reference."\n";
?>
```

We can then run this script on our local machine or on a website like <https://sandbox.onlinephpfunctions.com/>.

This script will take the two inputs and give us the outcome of the addition with the `$secret_salt` (I used 11 as the salt number but it could be any number), the generated hash and thus the `$verifier` input we need for the original script.

If we make `$password` a really big number like `922337203685477580792233720368547758079223372036854775807` we see that the output of the addition will be written in the scientific notation if it is converted to a string. And because the `sha1()` function wants a `string` for the input, it will also get the shrunk-down version. This means that if we make `$password` big enough, the value of `$secret_salt` will not matter as it is not significant enough for the output.

If we thus enter `922337203685477580792233720368547758079223372036854775807` as `$password` in the above script, we get the following output:

```text
9.2233720368548E+56
48a888ebec04f516e8b765bc3879354411ac2387
48a888e
```

If we thus use `922337203685477580792233720368547758079223372036854775807` as the password and `48a888e` as the verifier, it should echo the flag.

## Solution

After entering the above form data and submitting it, we get the flag: `NOVI{typ3_juggl1ng_f0r_l1fe}`!

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#14-15).
