+++
author = "Maik de Kruif"
title = "Challenge 3 - AdventOfCTF"
date = 2020-12-03T09:29:12+01:00
description = "Challenge 3 of AdventOfCTF."
cover = "img/adventofctf/4f5cc0afbb9e7ec6a57cdd68a92b9213.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 300

## Description

For this challenge you will, again, need to bypass the login mechanism.

Visit <https://03.adventofctf.com> to start the challenge.

## Solution

When opening the website we're provided with a login form. If we fill in the form with random data, nothing happens. Usually a website will do a `POST` request to a URL when submitting a form, but even that didn't happen. So my guess is that there is some javascript in play.

Let's open the source and take a look at the form. Here we can see that when the form is submitted, a javascript function called `checkPass()` is called.

```html
<form action="/index.php" onsubmit='checkPass(); return false'>
```

To find this funtion, enter `checkPass` in the devtools console and click on the three dots at the bottom of the output.

```js
function checkPass()
{
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var novi = '-NOVI';

    if (password == btoa(username + novi)) {
        window.setTimeout(function() {
            window.location.assign('inde' + 'x.php?username='+ username +'&password=' + password);
        }, 500);
    }
}
```

We can see there is a check which checks if `password` is equal to `btoa(username + novi)`. But what is `btoa`? According to [w3schools](https://www.w3schools.com/jsref/met_win_btoa.asp):

> The btoa() method encodes a string in base-64.

To get the value of what the password should be, we have to know the output of `btoa(username + novi)`. Above this check, we see the `novi` variable is set to `'-NOVI'`. Now, we go to the devtools console and generate the password. In the console, enter `btoa("a" + "-NOVI")`. This returns `"YS1OT1ZJ"`, so lets try that combination. I used the username `"a"`. If we enter this combination in the form, we get redirected to a page with the flag.

This flag is `NOVI{javascript_is_not_s@fe}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#3-4).
