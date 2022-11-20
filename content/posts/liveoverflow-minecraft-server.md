+++
author = "Maik de Kruif"
title = "LiveOverflow's Minecraft Server"
date = 2022-09-14T02:46:01+02:00
description = "Around five months ago LiveOverflow started a series called Minecraft:HACKED. He invited everyone to find the server and join, but that was easier said than done."
cover = "img/posts/liveoverflow-minecraft-server/cover.png"
tags = [
    "minecraft",
    "challenge",
    "hacking",
]
categories = [
    "games",
    "hacking",
]
+++

Around five months ago [LiveOverflow](https://www.youtube.com/c/LiveOverflow) started a series called [Minecraft:HACKED](https://www.youtube.com/playlist?list=PLhixgUqwRTjwvBI-hmbZ2rpkAl4lutnJG). He invited everyone to find the server and join, but that was easier said than done.

## Concept

During one of his earlier videos, LiveOverflow challenged his viewers to find the Minecraft server he was playing on and come join it. At first, this was the only challenge, but as time went on and the server existed for longer, more challenge were added. At first, players had to bypass an algorithm that would kick players who moved like humans, but later on, we had to bypass a popular server plugin. All in all, I had/have a great time playing on the server and learned a lot about how Minecraft works, and how to write mods for it.

## Finding the server

In LiveOverflow's eighth video, [he told his viewers that the server has been opened to the public](https://youtu.be/QradKmQ27JY?t=1246). I immediately started looking for ways to find it. After researching for a while, I found multiple ways to find it, but I thought they would all take a fair bit of time (I'll get back to this later). So, instead of spending time actually learning stuff, I rewatched his videos to see if there would be a clue in there. Luckily it worked out. In [one video](https://youtu.be/Hmmr1oLt-V8?t=28) he blurred the IP inside the terminal, but forgot about the terminal title bar :smile:. I notified him of this, as it was obviously unintended, and the IP was changed shortly after, as many people apparently found it.


{{< figure src="/img/posts/liveoverflow-minecraft-server/first_ip_screenshot.png" title="Screenshot of video containing the IP address" >}}

### IP change

The IP change happened of the 26th of August. Finding the new IP was going to be a harder challenge, as the change meant there was no way to find the server using the videos. At the time I was looking into it, no new video had been released, after all.

During my research, I came across masscan. This is a piece of software that lets you scan the entire internet, and even does it pretty quickly. This may come as a surprise, but It doesn't support Minecraft packets… I could add support for this, but I would have to get familiar with the code base, and I thought it would over all just be easier to write a python script that interfaces or uses the output from masscan.

I got to work and wrote a script that scans the IP range in which the old IP was located. It starts by using masscan to scan the entire range of IP addresses, and saves it to a file to use later. I then read this file, and request basic Minecraft server information like its MOTD, players and favicon. This information was saved in another file, in which, I could easily search for LiveOverflow. In the end, the new IP only had one digit changed.

{{< code language="python" title="scan.py" isCollapsed="true" >}}

```py
import masscan
import json
import os
from mcstatus import JavaServer
from queue import Queue, Empty
from threading import Thread
import base64
from time import sleep
from contextlib import suppress
from os import remove

ip_ranges = [
    "116.202.0.0/16",
    "116.203.0.0/16",
    "128.140.0.0/17",
    "135.181.0.0/16",
    "136.243.0.0/16",
    "138.201.0.0/16",
    "142.132.128.0/17",
    "144.76.0.0/16",
    "148.251.0.0/16",
    "157.90.0.0/16",
    "159.69.0.0/16",
    "162.55.0.0/16",
    "167.233.0.0/16",
    "167.235.0.0/16",
    "168.119.0.0/16",
    "171.25.225.0/24",
    "176.9.0.0/16",
    "178.212.75.0/24",
    "178.63.0.0/16",
    "185.107.52.0/22",
    "185.110.95.0/24",
    "185.112.180.0/24",
    "185.126.28.0/22",
    "185.12.65.0/24",
    "185.136.140.0/23",
    "185.157.176.0/23",
    "185.157.178.0/23",
    "185.157.83.0/24",
    "185.171.224.0/22",
    "185.189.228.0/24",
    "185.189.229.0/24",
    "185.189.230.0/24",
    "185.189.231.0/24",
    "185.209.124.0/22",
    "185.213.45.0/24",
    "185.216.237.0/24",
    "185.226.99.0/24",
    "185.228.8.0/23",
    "185.242.76.0/24",
    "185.36.144.0/22",
    "185.50.120.0/23",
    "188.34.128.0/17",
    "188.40.0.0/16",
    "193.110.6.0/23",
    "193.163.198.0/24",
    "193.25.170.0/23",
    "194.35.12.0/23",
    "194.42.180.0/22",
    "194.42.184.0/22",
    "194.62.106.0/24",
    "195.201.0.0/16",
    "195.248.224.0/24",
    "195.60.226.0/24",
    "195.96.156.0/24",
    "197.242.84.0/22",
    "201.131.3.0/24",
    "213.133.96.0/19",
    "213.232.193.0/24",
    "213.239.192.0/18",
    "23.88.0.0/17",
    "45.136.70.0/23",
    "45.148.28.0/22",
    "45.15.120.0/22",
    "46.4.0.0/16",
    "49.12.0.0/16",
    "49.13.0.0/16",
    "5.75.128.0/17",
    "5.9.0.0/16",
    "65.108.0.0/16",
    "65.109.0.0/16",
    "65.21.0.0/16",
    "78.46.0.0/15",
    "85.10.192.0/18",
    "88.198.0.0/16",
    "88.99.0.0/16",
    "91.107.128.0/17",
    "91.190.240.0/21",
    "91.233.8.0/22",
    "94.130.0.0/16",
    "94.154.121.0/24",
    "95.216.0.0/16",
    "95.217.0.0/16",
]

thread_count = 100
# selected_range = "176.9.0.0/16"
selected_range = None

mas = masscan.PortScanner()

ip_ranges_to_scan = [selected_range] if selected_range else ip_ranges

for i, ip_range in enumerate(ip_ranges_to_scan):
    print(f"Starting on range: {ip_range} [{i+1}/{len(ip_ranges_to_scan)}]")
    mas.scan(ip_range, ports="25565", arguments="--max-rate 8000")
    with open("hosts.json", "r+") as file:
        hosts_json = json.load(file)
        previous_hosts = hosts_json.get(ip_range, [])
        hosts_json[ip_range] = list(set(previous_hosts) | set(mas.all_hosts))
        file.seek(0)
        json.dump(hosts_json, file)

with open("hosts.json", "r") as file:
    hosts_json = json.load(file)

if selected_range:
    hosts = hosts_json.get(selected_range, [])
else:
    hosts = [host for ip_range in hosts_json.values() for host in ip_range]

hosts = list(set(hosts))
hosts[:5], len(hosts)

with open("masscans/hosts.json", "r") as file:
    json_data = json.load(file)

hosts = [entry['ip'] for entry in json_data]

hosts = list(set(hosts))
hosts[:5], len(hosts)

with open("valid_hosts.json", "r") as file:
    valid_hosts = json.load(file)

def handle_ip(ip):
    try:
        server = JavaServer.lookup(ip)
        status = server.status()

        server_info = {
            "version": status.version.name,
            "motd": status.description,
            "favicon": status.favicon is not None,
            "player_count": status.players.online,
            "players": [player.name for player in status.players.sample or []],
        }

        valid_hosts[ip] = server_info

        if status.favicon:
            with open(f"servers/{ip}.png", 'wb') as file:
                file.write(base64.b64decode(status.favicon[len("data:image/png;base64,"):]))
    except Exception as e:
        print(f"Failed for IP: {ip} ({type(e)})")


def do_stuff(queue):
    with suppress(Empty):
        while True:
            handle_ip(queue.get(block=False))
            queue.task_done()


def print_progress(queue):
    initial_size = queue.qsize()
    def p(current_size):
        print(f"Progress: {(((initial_size-current_size)/initial_size)*100):.2f}% [{initial_size-current_size}/{initial_size}]")

    while (current_size := queue.qsize()) > 0:
        p(current_size)
        sleep(1)
    p(current_size)


queue = Queue(maxsize=0)
for host in hosts:
    queue.put(host)

threads = []

progress_printer = Thread(target=print_progress, args=(queue,))
progress_printer.daemon = True
progress_printer.start()
threads.append(progress_printer)

for _ in range(thread_count):
    worker = Thread(target=do_stuff, args=(queue,))
    worker.daemon = True
    worker.start()
    threads.append(worker)

queue.join()
for thread in threads:
    thread.join()

with open("valid_hosts.json", "w") as file:
    json.dump(valid_hosts, file)


with open("valid_hosts.json", "r") as file:
    valid_hosts_data = json.load(file)


# list({data.get("version") for ip, data in valid_hosts_data.items()})
current_servers = [filename[:-4] for filename in os.listdir("possible_hits")]

def is_1_19(ip) -> bool:
    return "1.19" in valid_hosts_data.get(ip).get("version")


valid_servers = list(filter(is_1_19, current_servers))

for filename in os.listdir("possible_hits"):
    if filename[:-4] not in valid_servers:
        remove(f"possible_hits/{filename}")

print(len(current_servers))
print(len(valid_servers))
```

{{< /code >}}

_This code is copied from a Jupyter Notebook, so it's not the most efficient and may not even work, the [here for the Github Gist of the Notebook](https://gist.github.com/maikka39/8019e2f1a45e1021fff05bd1e1688e14)_

Later, I found out the physical server was actually the same, and you could also use `traceroute` to find the new server as well.

```txt
traceroute to 176.9.20.201 (176.9.20.201), 30 hops max, 60 byte packets
 1  _gateway (10.0.0.1)  1.435 ms  1.407 ms  1.381 ms
 2  192.168.2.254 (192.168.2.254)  16.733 ms  16.722 ms  16.712 ms
 3  static.kpn.net (195.190.228.90)  17.893 ms  17.882 ms  17.882 ms
 4  139.156.98.101 (139.156.98.101)  128.740 ms  128.730 ms  128.720 ms
 5  * * *
 6  core24.fsn1.hetzner.com (213.239.224.253)  32.245 ms core23.fsn1.hetzner.com (213.239.224.249)  30.209 ms core24.fsn1.hetzner.com (213.239.224.253)  43.727 ms
 7  ex9k1.dc6.fsn1.hetzner.com (213.239.229.94)  30.182 ms  19.697 ms  22.575 ms
 8  static.205.20.9.176.clients.your-server.de (176.9.20.205)  19.665 ms  22.329 ms  22.306 ms
 9  * * *
10  * * *
```

### Third IP change

The “new” IP quickly got leaked, and so a new server had been created. This time, `traceroute` did not yield any useful results, so I used the above script again. The only change I made, was adding all Hetzner ranges to the list of ranges.

### Abuse emails

Not every ISP likes people scanning the internet. I ran the script on both a VPS, and on my home network. Especially the latter was a mistake, though, as I quickly received an email telling me to stop, or I would have my internet cut off. So, If you want to scan the whole internet, don't do it from home :smile:.

{{< figure src="/img/posts/liveoverflow-minecraft-server/kpn_abuse.png" title="Screenshot of abuse email (in Dutch)" >}}

## Challenges

I had a great time playing on the server. The other players were mostly nice, having to have some technical skills to find the server probably kept most griefers out. What I found most fun about the server, were the challenges, though.

### Bot movement challenge

After some time playing on the server, the first challenge was released. As LiveOverflow explained in [this video](https://www.youtube.com/watch?v=WEMOCFe4EFE), if you move on the server, without rounding your player position to 1/100th, you get kicked with the following message:

{{< figure src="/img/posts/liveoverflow-minecraft-server/human_movement_kick_message.png" title="Human movement kick message" >}}

#### Writing a Fabric mod

Where do you even get started with solving this challenge? I didn't have any Minecraft modding experience, but had heard about [Fabric](https://fabricmc.net/). I downloaded [an example mod](https://github.com/FabricMC/fabric-example-mod) from their GitHub, and got it to intercept `PlayerMoveC2SPacket`. These are the packets your Minecraft client sends to the server, so it knows where you are.

Unfortunately, I don't have my original code anymore, so I can't give any code snippets for this part. I _can_ explain the business logic, though.

#### Moving like a bot

You might say this is a straightforward challenge, but you might be surprised. This is because the naive approach of simply multiplying a coordinate by one hundred, rounding it, and then dividing it by one hundred again will only work some of the time. The reason for this is [how floating-point numbers work](https://en.wikipedia.org/wiki/Floating-point_arithmetic). You might have heard about the classic meme that `0.1` + `0.2` equals `0.30000000000000004`. We humans work in base 10, but computers work in base 2, and not all base 10 numbers can efficiently be represented in base 2. Our mod will not work when we're sending a number that's rounded down to, for instance, x.9999999, as casting that to an int would result into a non-rounded number. The easiest way to fix this is by adding the following step:

```kt
fun round(n: Double): Double {
    val rounded = Math.round(n * 100) / 100;
    return Math.nextAfter(rounded, rounded + Math.signum(rounded)); // <--
}
```

This will get the first exact floating-point number after the given number. We can then pass the x and/or z value of the current coordinate to this method, and replace the value with the result.

### Club Mate challenge

#### Original version

Some time after the bot movement challenge, a new challenge was released. This time, we had to open a chest in a protected area. Part of the challenge was actually finding it, I stumbled across it by accident, but a hint was otherwise also given [at the end of the bot movement video](https://www.youtube.com/watch?v=WEMOCFe4EFE).

Upon entering the area, you're teleported to a floating island and greeted with a message;

{{< figure src="/img/posts/liveoverflow-minecraft-server/club_mate_original.png" title="Club Mate message" >}}

This challenge had some unintended solutions. I'll get to the intended one later, but let's first solve it the easy way :smile:.

When looking at the given pseudocode, we can see we're only teleported back on a `PlayerMoveEvent`. As LiveOverflow [later showed in a video](https://www.youtube.com/watch?v=RDkWagIW6gw), many people found bypasses to it. My solution was to throw an Ender Pearl into the region, and then immediately block all outgoing movement packets. This way the server teleports us into the region, which does not trigger a `PlayerMoveEvent`, after which, we can open a chest. A message is also sent in chat after opening the chest;

{{< figure src="/img/posts/liveoverflow-minecraft-server/acquired_club_mate.png" title="Club Mate message" >}}

#### Patched version

After LiveOverflow noticed the unintended solutions, he used the plugin WorldGuard instead of his own. This made the challenge quite a bit harder, as silly things like throwing an Ender Pearl don't work.

After reading lots of [Paper source code](https://github.com/PaperMC/Paper), I came across the following code:

```java
// Prevent 40 event-calls for less than a single pixel of movement >.>
double delta = Math.pow(this.lastPosX - to.getX(), 2) + Math.pow(this.lastPosY - to.getY(), 2) + Math.pow(this.lastPosZ - to.getZ(), 2);
float deltaAngle = Math.abs(this.lastYaw - to.getYaw()) + Math.abs(this.lastPitch - to.getPitch());

if ((delta > 1f / 256 || deltaAngle > 10f) && !this.player.isImmobile()) {
    // ...
    PlayerMoveEvent event = new PlayerMoveEvent(player, from, to);
    // ...
}
```

In short, this code means we can move around a tiny bit before a `PlayerMoveEvent` is sent.  This caught my interest, as I thought there might be a way to change the `lastPos`. After reading more code, I found out there was!

If we send a position that is far away, like x+100, y+100, the player will be teleported back before the `PlayerMoveEvent` gets sent. During this teleport action, `lastPos` get set to the position the player had before the “far away packet” was sent.

```java
public void handleMovePlayer(ServerboundMovePlayerPacket packet) {
    // ...
    // d11 and d10 contain a difference in player position
    if (d11 - d10 > Math.max(f2, Math.pow((double) (org.spigotmc.SpigotConfig.movedTooQuicklyMultiplier * (float) i * speed), 2)) && !this.isSingleplayerOwner()) {
        // ...
        this.teleport(this.player.getX(), this.player.getY(), this.player.getZ(), this.player.getYRot(), this.player.getXRot());
        // ...
    }
    // ...
}

public boolean teleport(double d0, double d1, double d2, float f, float f1, Set<ClientboundPlayerPositionPacket.RelativeArgument> set, boolean flag, PlayerTeleportEvent.TeleportCause cause) {
    // ...
    this.internalTeleport(d0, d1, d2, f, f1, set, flag);
    // ...
}

public void internalTeleport(double d0, double d1, double d2, float f, float f1, Set<ClientboundPlayerPositionPacket.RelativeArgument> set, boolean flag) {
    // ...
    this.awaitingPositionFromClient = new Vec3(d0, d1, d2);
    // ...

    this.lastPosX = this.awaitingPositionFromClient.x;
    this.lastPosY = this.awaitingPositionFromClient.y;
    this.lastPosZ = this.awaitingPositionFromClient.z;
    this.lastYaw = f;
    this.lastPitch = f1;

    // ...
    this.player.moveTo(d0, d1, d2, f, f1);
    this.player.connection.send(new ClientboundPlayerPositionPacket(d0 - d3, d1 - d4, d2 - d5, f - f2, f1 - f3, set, this.awaitingTeleport, flag));
}
```

This meant that, as long as we sent a "far away packet" every `(1 / 256)**0.5` (`0.0625`) blocks, we can travel without triggering any events.

After implementing this, I could enter the region and jump in the fountain, after which, I got the HACKER rank and a bottle of Club Mate.

> maik_dev drank from the Club Mate fountain and became a real Minecraft HACKER

{{< figure src="/img/posts/liveoverflow-minecraft-server/club_mate_bottle_patched.png" title="Club Mate bottle" >}}

##### Speeding things up

This method was very slow, however. After taking another look at the [WorldGuard source code](https://github.com/EngineHub/WorldGuard), I noticed that it checks whether the player actually moved a block;

```java
public void onPlayerMove(PlayerMoveEvent event) {
    Location from = event.getFrom();
    Location to = event.getTo();
    if (from.getBlockX() == to.getBlockX()
            && from.getBlockY() == to.getBlockY()
            && from.getBlockZ() == to.getBlockZ()) {
        return;
    }
    // ...
}
```

This check means we only have to actually prevent a `PlayerMoveEvent` when we are changing from one block to another. The final code for which can be found in [my GitHub repo](https://github.com/maikka39/MinecraftClient).

## Conclusion

As of writing this, these are all the challenges I'm aware of. I'll update this post when more challenges are added.
