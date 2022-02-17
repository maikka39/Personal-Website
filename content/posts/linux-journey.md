+++
author = "Maik de Kruif"
title = "My Linux Journey"
date = 2022-02-17T16:41:25+02:00
description = "Recently, my friend Raymon posted on is website about his distro hopping journey. I thought it was fun to see what he used over the years, so created a blog post for myself to post my journey."
cover = "img/posts/linux-journey/cover.png"
tags = [
    "linux",
    "windows",
    "zorin os",
    "kali linux",
    "Pop!_OS",
    "Pop!_OS",
    "manjaro",
    "arch",
]
categories = [
    "personal",
    "linux",
]
+++

Recently, my friend [Raymon](https://raymon.dev/) [posted on is website about his distro hopping journey](https://raymon.dev/posts/2022/2/hopping-around.html). I thought it was fun to see what he used over the years, so created a blog post for myself to post my journey.

## Tl;dr

| Device                       | Distro _("/" means dualbooted)_ | Year      |
| ---------------------------- | ------------------------------- | --------- |
| Toshiba Satellite C50D-A-10K | Windows                         | 2016      |
| Toshiba Satellite C50D-A-10K | ZorinOS / Windows               | 2016-2017 |
| Toshiba Satellite C50D-A-10K | Kali Linux                      | 2017      |
| Toshiba Satellite C50D-A-10K | ZorinOS                         | 2017      |
| MSI GL62M 7REX               | Windows                         | 2018      |
| MSI GL62M 7REX               | Pop!_OS / Windows               | 2019-2020 |
| Asus Zephyrus M GU502GV      | Windows                         | 2020      |
| Asus Zephyrus M GU502GV      | Manjaro / Windows               | 2020-2021 |
| Asus Zephyrus M GU502GV      | Arch / Windows                  | 2021-2022 |

## My journey

### First laptop

When I got my first laptop (a Toshiba Satellite C50D-A-10K), it, of course, had Windows installed. At first, this worked fine, as I didn't use my laptop that much. But as I started to use it more, I got more and more annoyed with how slow it was and the `DPC WATCHDOG VIOLATION` blue screens.

Part of the slowness was, naturally, because of the computer itself. Back then, you couldn't expect too much from a cheap AMD APU.

So, I started looking around and came across Zorin OS.

#### Zorin OS

After spending some time learning how to dual boot Zorin OS, I was pleasantly surprised with how well it worked out of the box. Its usage wasn't too different from Windows, which was a huge plus, as I had never used or heard about Linux before. And even though it looked like Windows, it was much faster to use.

As I continued using Zorin OS, I started using the terminal more and more. This is probably where my love for Linux started. It allowed me to do things much faster, and it made way more sense than having to click through twenty UI components.

#### Kali Linux

By this time, I learned about hacking, and saw many people use Kali Linux for it. As I didn't know much about it, and I didn't know how to install the tools necessary on Zorin OS, I installed Kali.

This actually wasn't a good experience. Although all the tools I wanted worked well, Kali was very slow on my machine. Because of this, I turned back to Zorin OS soon after.

### MSI laptop

Slowly, I became sick of the slowness, and wanted to play Minecraft at more than 20 FPS. So, I bought an MSI GL62M 7REX, which, with its i7-7700HQ and GTX 1050 Ti, was a massive upgrade over the AMD E1-1200 in the Toshiba.

As it, thus, was quick enough, I kept running Windows on it for a while.

I began to miss Linux after a while, though, and wanted to try something new. This is where Pop!_OS comes into view .

#### Pop!_OS

Pop!_OS was great. I got everything to work fairly quickly, and it was easy to use. I still kept Windows around for games, as Linux support was even worse than it is now.

### Asus Zephyrus

After a while, the subpar build quality of the MSI laptop really started to show. It was also a fairly heavy laptop, and since it had to carry it to school every day, I started to look for a replacement. I eventually settled on the Asus Zephyrus M GU502GV.

Initially, I used it with Windows again, but quickly installed Linux again. This time, I heard good things about Manjaro.

#### Manjaro

After I installed Manjaro on a second drive, I found out support for my laptop was pretty much nonexistent. The sound card wasn't working, the battery drained at least three times quicker, and certain special keys weren't functioning. I tried several distros, but there always were some major parts of the system that didn't feel like working.

Because of this, I had to use Windows. Because of [WSL](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux) this was kind of doable, but overall just very annoying.

I kept coming back to it from time to time, and eventually most issues were fixed. It didn't work exactly how I wanted, though, and my system was pretty bloated.

#### I use Arch, btw

Since I liked most parts of Manjaro, I decided to install the distro Manjaro was based on, Arch Linux. Many people say it is hard to use, and difficult to install, but after using it for a little over a year now, I've found the opposite to be true. Especially when it comes to the package manager, pacman is infinitely easier to use than apt.

Arch Linux has been working very well for me up until now, and I don't plan to hop distros any time soon.
