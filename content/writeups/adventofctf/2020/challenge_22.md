+++
author = "Maik de Kruif"
title = "Challenge 22"
subtitle = "Challenge 22 - AdventOfCTF"
date = 2021-03-04T01:24:34+01:00
description = "A writeup for challenge 22 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/6c0810c1568645bcf58da67a1db6e3e7.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "php",
    "ssrf",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 2200

## Description

We have a new service! You can view santa's favorite pictues. Currently there is only one, but it is a very good one! You can get the flag through flag.php.

Visit <https://22.adventofctf.com> to start the challenge.

## Recon

Upon opening the challenge website, we're greeted with a link with the text "Is this santa?". If we click on it, it redirects to `/index.php?image=cat.jpg`.

This page shows us a nice picture of a cat.

## Finding the vulnerability

When looking at this, you might think of Local File Inclusion (LFI). This makes sense as it is one of the most common vulnerability in opening files.

We can try to use it to open `flag.php`. To try this, let's replace `cat.jpg` with `flag.php` in the URL.

When opening the page, we will see a broken image, this is expected as the file it not an image. If we open the source we find the following:

```html
<img
  src="data:image/jpeg;base64,PD9waHAKCmluY2x1ZGUoInNlY3JldC5waHAiKTsKCmlmIChzdHJwb3MoY2hlY2tfc2VjcmV0KCksICJhbGxvdyIpICE9PSBmYWxzZSkgewogICBlY2hvIGdldF9mbGFnKCk7IAp9Cgo/Pgo="
  width="100%"
/>
```

Here we see some `base64` encoded data, let's decode it using the following command:

```bash
echo -n "PD9waHAKCmluY2x1ZGUoInNlY3JldC5waHAiKTsKCmlmIChzdHJwb3MoY2hlY2tfc2VjcmV0KCksICJhbGxvdyIpICE9PSBmYWxzZSkgewogICBlY2hvIGdldF9mbGFnKCk7IAp9Cgo/Pgo=" | base64 -d
```

```php
<?php

include("secret.php");

if (strpos(check_secret(), "allow") !== false) {
   echo get_flag();
}

?>
```

If we look at this code, we see that if `check_secret()` contains `"allow"`, it will execute the `get_flag()` function (which will probably give us the flag).

The functions are not defined in this file so they probably come from `secret.php`. Let's try to read that file.

Alas, we get the cat picture again. That's weird. There might be a filter on the input. Let's verify that by reading the `index.php` file.

Using the same decoding method, we get the following result:

{{< code language="php" title="index.php" >}}

```html
<!DOCTYPE html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Advent of CTF 22</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="stylesheet" href="style.css" type="text/css" media="screen" />
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
      integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
      crossorigin="anonymous"
    />
    <style>
      .row-margin-05 {
        margin-top: 0.5em;
      }
      .row-margin-10 {
        margin-top: 1em;
      }
      .row-margin-20 {
        margin-top: 2em;
      }
      .row-margin-30 {
        margin-top: 3em;
      }
    </style>
  </head>
  <body>
    <div class="jumbotron bg-transparent mb-0 radius-0">
      <div class="container fluid">
        <div class="row">
          <div class="col-xl-6 mx-auto">
            <h1 class="display-2">
              Advent of CTF <span class="vim-caret">22</span>
            </h1>
            <div class="lead mb-3 text-mono text-warning">
              Your daily dose of CTF for December
            </div>

            <div class="row">
              <div class="col-xl-12 mx-auto">
                <div class="card">
                  <div class="card-header text-center">
                    <h2>The big reveal</h2>
                  </div>
                  <div class="card-body">
                    <?php
                    if (!isset($_GET["image"])) {
                    ?>
                    <a href="/index.php?image=cat.jpg">Is this santa?</a>
                    <?php
                    } else {
                        $path = $_GET["image"];
                        if (strpos($path,"secret") !== false) {
                            $path="cat.jpg";
                        }
                        $image = file_get_contents($path);
                        echo '<img src="data:image/jpeg;base64,'.base64_encode($image).'" width="100%"/>';
                    } ?>
                  </div>
                  <div class="card-footer text-center">Almost there</div>
                </div>
              </div>
            </div>
            <div class="row row-margin-30">
              <div class="card mb-3 bg-dark text-white">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-2">
                      <img src="/logo.png" />
                    </div>
                    <div class="col-md-9 offset-md-1 align-middle">
                      <p class="text-center">
                        <span class="align-middle">
                          The Advent of CTF is brought to you by
                          <a href="http://www.novi.nl">NOVI Hogeschool</a>. It
                          is built by
                          <a
                            href="https://twitter.com/credmp/"
                            class="icoTwitter"
                            title="Twitter"
                            ><i class="fab fa-twitter"></i> @credmp</a
                          >. If you are looking for a Dutch Cyber Security
                          Bachelor degree or bootcamp,
                          <a href="https://www.novi.nl">check us out</a>.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

{{< /code >}}

Just the PHP part:

```html
<?php
if (!isset($_GET["image"])) {
?>
<a href="/index.php?image=cat.jpg">Is this santa?</a>
<?php
} else {
    $path = $_GET["image"];
    if (strpos($path,"secret") !== false) {
        $path="cat.jpg";
    }
    $image = file_get_contents($path);
    echo '<img src="data:image/jpeg;base64,'.base64_encode($image).'" width="100%"/>';
} ?>
```

Here we see that we cannot get any file containing "secret". This means we have to find another way to get the flag.

We see that this code is using the `file_get_contents()` function to open file. Let's have a look at the [PHP documentation for it](https://www.php.net/manual/en/function.file-get-contents.php).

If we read a bit we find the following example usage:

```php
<?php
$homepage = file_get_contents('http://www.example.com/');
echo $homepage;
?>
```

This means it can also open URLs and, since we control the input to the function, we have a Server-Side Request Forgery (SSRF) vulnerability. Let's try to use that to open the flag file.

To test this, we can use the following input; `image=http://localhost/flag.php`.

_Note: We can not use the `secret.php` file as any input containing "secret" is blocked._

We, again, got some base64 encoded data back, so let's decode it:

```bash
echo -n "Tk9WSXthc2tpbmdfZm9yX2FfZnJpZW5kfQ==" | base64 -d
```

## Solution

We got the flag! It is `NOVI{asking_for_a_friend}`.
