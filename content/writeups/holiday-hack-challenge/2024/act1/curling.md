+++
author = "Maik de Kruif"
title = "Curling"
subtitle = "Act 1 - SANS Holiday Hack Challenge 2024"
date = 2024-11-23T11:44:53+01:00
description = "In the Curling challenge, we join Bow Ninecandle to learn how to use the curl command for sending web requests. The silver tasks include sending basic requests, handling self-signed certificates, posting data, and more. Afterwards, we use our knowledge to solve extra tasks involving file paths and redirects, completing the challenge for the gold medal!"
cover = "img/writeups/holiday-hack-challenge/2024/act1/curling/cover.png"
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

Let's start off by talking to Bow Ninecandle:

```txt
Well hello there! I'm Bow Ninecandle, bright as a twinkling star! Everyone's busy unpacking, but I've grown quite bored of that. Care to join me for a lovely game?

Oh Joy! Today, We're diving into something delightful: the curling challenge—without any ice, but plenty of sparkle!

No icy brooms here though! We're all about Curl, sending web requests from the command line like magic messages.

So, have you ever wielded Curl before? If not, no worries at all, my friend!

It's this clever little tool that lets you whisper directly to web servers. Pretty neat, right?

Think of it like sending secret scrolls through the interwebs, awaiting a wise reply!

To begin, you can type something like curl https://example.com. Voilà! The HTML of the page appears, like conjuring a spell!

Simple enough, huh? But oh, there's a whole world of magic you can cast with Curl!

We're just brushing the surface here, but trust me—it’s a hoot and a half!

If you get tangled up or need help, just give me a shout! I’m here to help you ace this curling spectacle.

So, are you ready to curl those web requests like a pro? Let’s see your magic unfold!
```

## Recon

Upon opening the challenge, we're greeted with a terminal. Looks like we'll have to use the `curl` command to solve the challenge.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/start.png" title="Welcome screen" >}}

Let's enter "y", press enter, and start the challenge.

## Silver

### Task 1

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/http.png" title="Question 1" >}}

So, for our first task, we'll have to send a simple http request to `http://curlingfun:8080/`. Those of use who have used curl before will have no issues here, but since this writeup isn't just for them, I'll pretend to have never used curl before.

To get more info on how curl works, we can open its manpage. A manpage is the documentation of a command on linux systems. We can open it by running `man curl` in the terminal.

{{< figure class="small" src="/img/writeups/holiday-hack-challenge/2024/act1/curling/manpage.png" title="manpage of curl" >}}

We can scroll through the page using the arrow keys (or vim shortcuts), and search for things by typing `/[SEARCH TERM HERE]`.

For the first task, we don't need any of the special options, and we can just append the url after the curl command.

```sh
curl http://curlingfun:8080/
```

### Task 2

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/insecure-https.png" title="Question 2" >}}

For tasks 2, we'll have to send an https request. Sounds easy enough, and normally that would be the case, but here it also specifies that the destination is using a self-signed certificate.

By default curl will verify the remote certificate, and block the request if the certificate is not issued by a trusted party. Since the certificate here is self-signed, meaning there is no trusted party involved, curl will block the request.

To circumvent this protection mechanism, we'll have to tell curl to allow insecure connections. If we look at the manpage, we can find the following option:

```txt
       -k, --insecure
              (TLS) By default, every SSL connection curl makes is verified  to  be  secure.
              This  option  allows  curl  to proceed and operate even for server connections
              otherwise considered insecure.

              ...
```

So we can add the `-k` option, and run the command like this:

```sh
curl -k https://curlingfun:9090/
```

### Task 3

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/post.png" title="Question 3" >}}

On to task three, where we'll have to send a POST request with some data.

We can again look at the manpage. If type in `/POST`, press enter, and then press `n` to go to the next occurrence a few times, we'll find the following entry:

```txt
       -d, --data <data>
              (HTTP) Sends the specified data in a POST request to the HTTP server,  in  the
              same  way  that  a  browser  does  when  a user has filled in an HTML form and
              presses the submit button. This will cause curl to pass the data to the server
              using  the  content-type  application/x-www-form-urlencoded.   Compare  to -F,
              --form.

              ...

              If  any  of these options is used more than once on the same command line, the
              data pieces specified will be merged  together  with  a  separating  &-symbol.
              Thus,  using  '-d name=daniel -d skill=lousy' would generate a post chunk that
              looks like 'name=daniel&skill=lousy'.

              ...
```

Using this option, we can send the requested data. The page also shows an example of how to specify the data, so we can use that in our case like so:

```sh
curl -k https://curlingfun:9090/ --data "skip=alabaster"
```

In the screenshot below, I also added the `-X POST` option. The `-X` option as you may gave guessed sets the request method. I did this out of habit, but it is not needed at all. The `--data` option automatically converts it to a POST request for you.

### Task 4

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/cookie.png" title="Question 4" >}}

Next up is sending a cookie along. A quick search in the manpage will yield us the following result:

```txt
       -b, --cookie <data|filename>
              (HTTP) Pass the data to the HTTP server in the Cookie header. It is supposedly
              the  data  previously  received  from the server in a "Set-Cookie:" line.  The
              data should be in the format "NAME1=VALUE1; NAME2=VALUE2".

              ...
```

The page also conveniently shows us the format in which the data is expected. Let's fill it in and send it.

```sh
curl -k https://curlingfun:9090/ --cookie "end=3"
```

### Task 5

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/headers.png" title="Question 5" >}}

This time, we'll have to get curl to show us the headers it received as well.

You know the drill by now, this is what the manpage shows:

```txt
       -i, --include
              Include the HTTP response headers in the output. The HTTP response headers can
              include  things  like server name, cookies, date of the document, HTTP version
              and more...

              ...
```

We won't have to send any data, so we can leave all other things out.

```sh
curl -k -i https://curlingfun:9090/
```

### Task 6

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/header.png" title="Question 6" >}}

For the sixth task, we need to send a header along with the request.

Once again, the manpage helps us out:

```txt
       -H, --header <header/@file>
              (HTTP) Extra header to include in the request when sending HTTP to  a  server.
              You  may  specify  any  number of extra headers.

              ...

              Example:

               curl -H "X-First-Name: Joe" http://example.com/

              ...
```

```sh
curl -k https://curlingfun:9090/ -H "Stone: Granite"
```

### Task 7

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/path-as-is.png" title="Question 7" >}}

We have made it to the last task; making a request with `./` in the url. Because actually wanting to send `./` or `../` is very rare and often unintended (only hackers would want to), curl resolves them locally before sending the request.

Luckily, we can also disable this functionality:

```txt
       --path-as-is
              Tell curl to not handle sequences of /../ or /./ in the given URL  path.  Nor‐
              mally  curl will squash or merge them according to standards but with this op‐
              tion set you tell it not to do that.
```

We'll just add that option to our final command:

```sh
curl -k --path-as-is https://curlingfun:9090/../../etc/hacks
```

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/silver.png" title="Silver" >}}

And... bam! We got the medal!

### Tl;dr

These are the commands in order:

```sh
curl http://curlingfun:8080/
curl -k https://curlingfun:9090/
curl -k https://curlingfun:9090/ --data "skip=alabaster"
curl -k https://curlingfun:9090/ --cookie "end=3"
curl -k -i https://curlingfun:9090/
curl -k https://curlingfun:9090/ -H "Stone: Granite"
curl -k --path-as-is https://curlingfun:9090/../../etc/hacks
```

## Gold

### Continued story line

Let's first talk to the elf again, he'll tell us what we'll have to do for gold.

```txt
Bravo! Look at you, curling through that like a true web wizard!

You zipped through that challenge faster than a curling stone on enchanted ice!

You know... rumor has it you can breeze through this with just three commands. Why don’t you give it a whirl?
```

### Task 1

At first, I though we could just combine the previous commands in one, and solve it, but, alas, this was not the case...

This is the input I tried:

```sh
curl http://curlingfun:8080/
curl -k -X POST https://curlingfun:9090/ --data "skip=alabaster" --cookie "end=3" -H "Stone: Granite"
curl -k  --path-as-is https://curlingfun:9090/../../etc/hacks
```

Curious as to what we needs to be done, we should explore further. Let's start by listing the files in the current directory. This turns out to be a good idea, as we find a file there; `HARD-MODE.txt`.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/hard-mode.png" title="HARD-MODE.txt" >}}

Turns out we get some more steps to follow. We have already practiced all the things needed here with the silver one, so we can apply the knowledge gained there with this task.

```sh
curl -k https://curlingfun:9090/ --data "skip=bow" --cookie "end=10" -H "Hack: 12ft"
```

### Task 2

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/gold2.png" title="Question 2" >}}

The second one also brings nothing new, the `--path-as-is` option will help us again here:

```sh
curl -k --path-as-is https://curlingfun:9090/../../etc/button
```

### Task 3

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/gold3.png" title="Question 3" >}}

For the third task, we got something new. The message shows us that the url will redirect us.

By default, curl will not follow redirects. As you may have guessed by now though, there is way to enable this functionality, and it's written in the manpage:

```txt
       -L, --location
              (HTTP)  If the server reports that the requested page has moved to a different
              location (indicated with a Location: header and a 3XX response code), this op‐
              tion  will  make curl redo the request on the new place.

              ...
```

We can then add this option to the command as follows:

```sh
curl -k -L https://curlingfun:9090/GoodSportsmanship
```

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act1/curling/gold.png" title="Gold" >}}

And that's it, we got the gold medal!
