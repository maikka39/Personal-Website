+++
author = "Maik de Kruif"
title = "Santa Vision"
subtitle = "Act 3 - SANS Holiday Hack Challenge 2024"
date = 2025-01-04T00:46:44+01:00
description = "In Santa Vision, we assist Ribb Bonbowford in reclaiming the Santa Broadcast Network (SBN) from Wombley’s control. For the silver medal, we identify admin credentials hidden in the portal’s HTML, log in, and explore MQTT topics for valuable information. To earn gold, we uncover secrets in HTTP headers and retrieve additional user credentials to dig deeper into the northpolefeeds, ultimately restoring the holiday cheer and earning both medals!"
cover = "img/writeups/holiday-hack-challenge/2024/act3/santa-vision/cover.png"
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

Let's start off by talking to the elf:

> Hi, Ribb Bonbowford here, ready to guide you through the SantaVision dilemma!
>
> The Santa Broadcast Network (SBN) has been hijacked by Wombley's goons—they're using it to spread propaganda and recruit elves! And Alabaster joined in out of necessity. Quite the predicament, isn’t it?
>
> To access this challenge, use this terminal to access your own instance of the SantaVision infrastructure.
>
> Once it's done baking, you'll see an IP address that you'll need to scan for listening services.
>
> Our target is the technology behind the SBN. We need make a key change to its configuration.
>
> We’ve got to remove their ability to use their admin privileges. This is a delicate maneuver—are you ready?
>
> We need to change the application so that multiple administrators are not permitted. A misstep could cause major issues, so precision is key.
>
> Once that’s done, positive, cooperative images will return to the broadcast. The holiday spirit must prevail!
>
> This means connecting to the network and pinpointing the right accounts. Don’t worry, we'll get through this.
>
> Let’s ensure the broadcast promotes unity among the elves. They deserve to see the season’s spirit, don't you think?
>
> Remember, it’s about cooperation and togetherness. Let's restore that and bring back the holiday cheer. Best of luck!
>
> The first step to unraveling this mess is gaining access to the SantaVision portal. You'll need the right credentials to slip through the front door—what username will get you in?

## Hints

{{< collapsible-block title="Mosquito Mosquitto" isCollapsed="true" class="tight" >}}
[Mosquitto](https://mosquitto.org/) is a great client for interacting with MQTT, but their spelling may be suspect. Prefer a GUI? Try [MQTTX](https://mqttx.app/)
{{< /collapsible-block >}}

{{< collapsible-block title="Misplaced Credentials (A)" isCollapsed="true" class="tight" >}}
See if any credentials you find allow you to subscribe to any [MQTT](https://en.wikipedia.org/wiki/MQTT) feeds.
{{< /collapsible-block >}}

{{< collapsible-block title="Filesystem Analysis (A)" isCollapsed="true" class="tight" >}}
[jefferson](https://github.com/onekey-sec/jefferson/) is great for analyzing JFFS2 file systems.
{{< /collapsible-block >}}

{{< collapsible-block title="Database Pilfering (A)" isCollapsed="true" class="tight" >}}
Consider checking any database files for credentials...
{{< /collapsible-block >}}

## Recon

After clicking on the challenge, a new tab opens with a landing page. There is not much on it besides a picture of santa, and a weird animal in the bottom right. If we click on the dinosaur(?), some kind of control page opens up.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/landing-page.png" title="Landing page" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/control-page.png" title="Control page" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/about-screen.png" title="About screen" >}}

If we click on Time Travel, text starts appearing in the terminal, and, after a while, an IP is shown at the top. If it doesn't show, reload the page and it should be there.

The Objectives page on HHC also shows some questions we need to answer for the medals:

1. What username logs you into the SantaVision portal?
2. Once logged on, authenticate further without using Wombley's or Alabaster's accounts to see the `northpolefeeds` on the monitors. What username worked here?
3. Using the information available to you in the SantaVision platform, subscribe to the `frostbitfeed` MQTT topic. Are there any other feeds available? What is the code name for the elves' secret operation?
4. There are too many admins. Demote Wombley and Alabaster with a single MQTT message to correct the `northpolefeeds` feed. What type of contraption do you see Santa on?

## Solving

### Santa Vision A

#### Silver

Let's start by finding out that is happening on the IP we got. We can use a tool called [nmap](https://en.wikipedia.org/wiki/Nmap) for this. We could run it without any parameters, but add `-sC` and `-sV` will add some additional information about the services running on the server. We should also add `-p-` to make sure we scan all ports, not just the common ones.

```sh
nmap -sC -sV 34.136.4.185 -p-
```

```txt
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-04 01:09 CET
Nmap scan report for 185.4.136.34.bc.googleusercontent.com (34.136.4.185)
Host is up (0.11s latency).
Not shown: 65531 closed tcp ports (conn-refused)
PORT     STATE    SERVICE      VERSION
22/tcp   open  ssh         OpenSSH 9.2p1 Debian 2+deb12u3 (protocol 2.0)
| ssh-hostkey:
|   256 f8:97:0d:4e:97:e0:8d:4c:bd:34:c6:bf:15:d1:23:f5 (ECDSA)
|_  256 56:9e:99:d9:50:3d:f4:97:32:cf:0e:2e:3b:4d:b8:30 (ED25519)
1883/tcp open  mqtt
|_mqtt-subscribe: Connection rejected: Not Authorized
8000/tcp open  http        Gunicorn
|_http-server-header: gunicorn
|_http-title: Santa Vision
9001/tcp open  tor-orport?
| fingerprint-strings:
|   JavaRMI, Radmin, SSLSessionReq, SSLv23SessionReq, TLSSessionReq, mongodb, tarantool:
|     HTTP/1.0 403 Forbidden
|     content-type: text/html
|     content-length: 173
|_    <html><head><meta charset=utf-8 http-equiv="Content-Language" content="en"/><link rel="stylesheet" type="text/css" href="/error.css"/></head><body><h1>403</h1></body></html>
1 service unrecognized despite returning data.

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 396.97 seconds
```

Nmap shows there are 4 ports open; 22 (ssh), 1883 (mqtt), 8000 (http) and 9001. The last one is a weird one, there is some kind of webserver running, but it's not the normal kind.

Let's continue by navigating to the python webserver we found at port 8000. Upon opening it, we're greeted by a login page. There is also a comment at the bottom; "(topic 'sitestatus' available.)". Maybe this hints at an [MQTT](https://en.wikipedia.org/wiki/MQTT) topic.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/login-page.png" title="Login page" >}}

The page is **very** slow, but once it loads we can also take a look at the html behind it. In there, we find an interesting comment.

```html {linenos=true,linenostart=72}
  <b>©2024 Santavision Elventech Co., Ltd. Snow Rights Reserved.<br>(<i>topic 'sitestatus'</i> available.)</b>
</div> <!-- mqtt: elfanon:elfanon -->

```

These credentials allow us to log in to the website, and is thus also the answer for A - silver.

#### Gold

Let's talk to the elf again first:

> Great work! You've taken the first step—nicely done. You're on the silver path and off to a strong start!
>
> (Gold hint) Stay curious. Sometimes, the smallest details—often overlooked—hold the keys to the kingdom. Pay close attention to what’s hidden in the source.
>
> You've gained access, but there’s still much more to uncover. Patience and persistence will guide you—silver or gold, you're making progress!
>
> Now that you're in, it’s time to go deeper. We need access to the northpolefeeds. This won't work if you use Wombley or Alabaster’s credentials—find the right user to log in.

We also received a new hint, but it's for B.

{{< collapsible-block title="Like a Good Header on Your HTTP? (B)" isCollapsed="true" class="tight" >}}
Be on the lookout for strange HTTP headers...
{{< /collapsible-block >}}

Back to the task at hand. We were able to log in to the portal using the credentials, so maybe we can also connect to the MQTT server directly to look at the `sitestatus` topic we saw before.

In oder to connect to the server, we can use [MQTTX](https://mqttx.app/). MQTTX is a GUI for visualizing messages on the topics. Once we've installed MQTTX, we can set up the connection, and try the credentials. They work! We can now also subscribe to `sitestatus` topic.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/mqttx-sitestatus.png" title="sitestatus topic" >}}

In there, we almost immediately see an interesting message. There is a path to a file starting with `/static/`, a prefix often used on websites. Let's try download the file in the browser. The url should look like this: [`http://34.136.4.185:8000/static/sv-application-2024-SuperTopSecret-9265193/applicationDefault.bin`](/files/writeups/holiday-hack-challenge/2024/act3/santa-vision/applicationDefault.bin).

Once downloaded, we can use the [`file`](<https://en.wikipedia.org/wiki/File_(command)>) command to find out what kind of file it is.

```sh
file applicationDefault.bin
```

```txt
applicationDefault.bin: Linux jffs2 filesystem data little endian
```

It seems like it's some linux filesystem I've never heard of. An online search, or a look at the hints, will direct us to [jefferson](https://github.com/onekey-sec/jefferson/), a tool to extract JFFS2 files. Once installed, we can use it as follows.

```sh
jefferson applicationDefault.bin -d out
```

In it, we find a Python Flask application. It could be of the portal we just logged in to. So let's explore the code. In it we find some useful things. On of the first things can be found in `app/src/core/views.py`. There, we some, what looks like admin, credentials for MQTT.

```py {linenos=true,linenostart=159}
#Publish Messages to Broker to Create Player Broker Clients
mqttPublish.multiple(CreatePlayerClients,hostname="localhost",port=1883,auth={'username':"SantaBrokerAdmin", 'password':"8r0k3R4d1mp455wD"})
```

Unfortunately, the credentials don't work for the portal, so we'll have to explore further. In `app/src/accounts/views.py`, we find the login logic of the application. It looks like a database is being used for the users. At the bottom of the file, we also find an endpoint to download this database. The sqlite file is not part of the filesystem we extracted, so let's grab it from the server; [`http://34.136.4.185:8000/sv2024DB-Santa/SantasTopSecretDB-2024-Z.sqlite`](/files/writeups/holiday-hack-challenge/2024/act3/santa-vision/SantasTopSecretDB-2024-Z.sqlite).

We can open the file in many ways, but I like [DB Browser for SQLite](https://sqlitebrowser.org/). In the file we find the `users` table, with the following data.

| id  | username       | password               | created_on                 | is_admin |
| --- | -------------- | ---------------------- | -------------------------- | -------- |
| 1   | santaSiteAdmin | S4n+4sr3411yC00Lp455wd | 2024-01-23 06:05:29.466071 | 1        |

We can now enter this username for the gold medal. Upon completion, the elf will say the following:

> Impressive! You dug deeper and uncovered something hidden—very strategic work. You're well on your way to gold!

### Santa Vision B

#### Silver

For B, we'll have to look at the `northpolefeeds`. We haven't found a user for the monitors yet, so let's see if we can connect to the MQTT server with the "SantaBrokerAdmin" user we found. Since this is an admin, we can also subscribe to the wildcard and [security topics](https://github.com/eclipse-mosquitto/mosquitto/blob/master/plugins/dynamic-security/README.md).

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/mqttx-all-topics.png" title="MQTTX all topics" >}}

The security topic allows us to list all users on the system, by sending a json message to `$CONTROL/dynamic-security/v1`. The message is as follows.

```json
{ "commands": [{ "command": "listClients" }] }
```

```json
{
    "responses": [
        {
            "command": "listClients",
            "data": {
                "totalCount": 11,
                "clients": [
                    "AlabasterS",
                    "AlabasterS-viewer",
                    "SantaBrokerAdmin",
                    "WomblyC",
                    "WomblyC-viewer",
                    "elfanon",
                    "elfmonitor",
                    "elfmonitor-viewer",
                    "santaMonitor",
                    "santashelper2024",
                    "santashelper2024-viewer"
                ]
            }
        }
    ]
}
```

Here we found a few users. We found Alabaster and Wombly, which are the ones we're not supposed to use, and a few other new ones. It looks like only account with `-viewer` are being used to turn on the monitors, as elfanon didn't work for it.

Anyway, "elfmonitor" looks like a monitor account, so let's submit that name for the silver medal.

#### Gold

Let's talk to the elf again first:

> Excellent progress! You've moved us closer to understanding this network—keep it up on the silver path!
>
> (Gold hint) Look beyond the surface. Headers and subtle changes might just open new doors. Pay close attention to everything as you log in.
>
> You're doing fantastic! The northpolefeeds are now in your sights. Silver or gold, you're pushing forward with great momentum!
>
> We're getting closer. Now, we need to dig into the frostbitfeed. It’s time to figure out if any other feeds are lurking beneath the surface—and uncover the elves' secret operation.

We also received a new hint, but it's for C.
{{< collapsible-block title="Looking Deeper (C)" isCollapsed="true" class="tight" >}}
Discovering the credentials will show you the answer, but will you see it?
{{< /collapsible-block >}}

Solving gold is really easy because of the way we got silver. In the previous output, we also found the "santashelper2024" user, and this is the one needed for gold. We highly likely took an unintended path here, and I'm curious about what the intended way is.

I later found out there is another way to get the user for gold (though I'm still clueless for silver). If we take a look at the network tab of the DevTools, and log in with the santaSiteAdmin user, we see two requests are made; one to `/login`, and one to `/auth`. If we take a good look at the response headers of the `/auth` request, we find some interesting ones here.

```txt
brkrpswd:   playerSantaHelperPass9977518499
brkrtopic:  northpolefeeds
brkruser:   santashelper2024
```

The brkrpswd value seems to change every time you log in, but the user will stay the same.

Upon completion, the elf will say the following:

> That’s the kind of attention to detail we need! You've uncovered a hidden path—solid gold effort!

### Santa Vision C

For C, the quest is to find the code name for the elves' operation.

#### Silver

Since we already have MQTT open with the wildcard topic, we can see every message in every topic. If we observe for a while, we'll eventually find this message.

```txt
Sixteen elves launched operation: Idemcerybu
```

#### Gold

Let's talk to the elf again first:

> Wonderful job! You've uncovered a critical piece of the puzzle—well on track with the silver approach!
>
> (Gold hint) Sometimes the answers are in the quiet moments. Pay attention to every feed and signal—you may find what you're looking for hidden deep in the streams.
>
> You're almost there! The operation’s code is unlocked, but the final challenge is waiting. Silver or gold, you're close to victory!
>
> It’s time to take back control of the Santa Broadcast Network. There really shouldn't be multiple administrators—send the right message, and Santa’s true spirit will return. What’s Santa test-driving this season?

This one took me quite some time to figure out. The gold hint from the elf didn't make any sense to me and really threw me off. In the end it's a really easy one, do you see it already?

The name "Idemcerybu" looks weird, it feels like the characters were rotated. We can use a [CyberChef recipe](<https://gchq.github.io/CyberChef/#recipe=ROT13_Brute_Force(true,true,false,100,0,true,'')&input=SWRlbWNlcnlidQ>) to take a look at all [ROT13](https://en.wikipedia.org/wiki/ROT13) variations. Here we find that if we rotated all characters by 10 places, the outcome is "Snowmobile".

Upon completion, the elf will say the following:

> Brilliant work! You cracked the secret operation’s code on the gold path. Analytical thinking like that will lead to success!

### Santa Vision D

On to the last one. This time we need to demote the other admins, and look at the `northpolefeeds` to find the contraption Santa is on.

#### Silver

Let's start by viewing the feeds using the feeds using the "santashelper2024" user we got from B - gold.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/default-feeds.png" title="northpolefeeds" >}}

We see some stuff here, but no santa. The quest said something about demoting admins, so let's find how to do that. From looking at the wildcard topic again, we can see the message `singleAdminMode=false` popping up quite a lot in the `santafeed`.

I found this challenge a bit weird, and it took a lot of time. You have to be very specific about it.

If we try setting `singleAdminMode` to `true` by sending `singleAdminMode=true` to the `santafeed` topic, nothing will happen. It turns out we have to do this from the "elfmonitor" user. Since we don't have the credentials for it, we can set it using the security topic (`$CONTROL/dynamic-security/v1`).

```json
{
    "commands": [
        {
            "command": "modifyClient",
            "username": "elfmonitor-viewer",
            "password": "password"
        }
    ]
}
```

Then, we can either use MQTTX to log in as that user and send it to the `santafeed`, or we can use the portal. If you choose to use the portal, make use to use the "elfanon" user to log in, otherwise, you won't be able to send messages. Once logged it, a form shows up to public a message.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/silver-feeds.png" title="Silver northpolefeeds" >}}

In the feed we can see Santa on a pogo stick.

Upon completion, the elf will say the following:

> Excellent! You've successfully removed the propaganda and restored the true spirit of the season. A solid silver finish—well done!
>
> (Gold hint) Think about the kind of ride Santa would take in a world filled with innovation. His vehicle of choice might surprise you—pay attention to the futuristic details.
>
> Mission accomplished! The airwaves are restored, and the message is one of unity and teamwork. Whether silver or gold, you've done an incredible job!

#### Gold

For gold, the process is the same as for silver, only this time we have to send it from the "santashelper2024" user. This time, we also can't send it from the portal, as the user is not allowed. We can do it in MQTTX though, so in there, we can send `singleAdminMode=true` to the `santafeed` topic.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/mqttx-send-gold.png" title="MQTTX send singleAdminMode=true" >}}

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/santa-vision/gold-feeds.png" title="Gold northpolefeeds" >}}

Here we can see Santa on a hovercraft.

Upon completion, the elf will say the following:

> Phenomenal! You've figured it out—Santa’s on a new ride. You've earned your gold badge with this one!

## Important extra

For a later challenge, it is important to find some information in this challenge.

In the `frostbitfeed` topic, there are two message you will need.

```txt
Error msg: Unauthorized access attempt. /api/v1/frostbitadmin/bot/<botuuid>/deactivate, authHeader: X-API-Key, status: Invalid Key, alert: Warning, recipient: Wombley
```

```txt
Let's Encrypt cert for api.frostbit.app verified. at path /etc/nginx/certs/api.frostbit.app.key
```
