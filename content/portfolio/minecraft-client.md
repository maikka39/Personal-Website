+++
author = "Maik de Kruif"
title = "MinecraftClient"
start_date = 2022-08-30
end_date = 2022-12-29
company_name = "Personal"
company_url = "https://maik.dev"
cover = "img/portfolio/minecraft-client/cover.png"
description = "A Minecraft client that was designed to overcome a series of challenges presented by a YouTuber named LiveOverflow. The client was built using Kotlin and Fabric, and it featured creative solutions to bypass the server's defenses."
source_code = "https://github.com/maikka39/MinecraftClient"
skills = [
    "Java code injection",
    "Reverse engineering",
    "Java & Gradle",
]
+++

A Minecraft client that was designed to overcome a series of challenges presented by a YouTuber named LiveOverflow. The client was built using Kotlin and Fabric, and it featured creative solutions to bypass the server's defenses.

LiveOverflow set up a secret Minecraft server with a twist: finding it was the first challenge. After some clever detective work, including exploiting a slip-up in one of LiveOverflow's videos, I gained access.

The real fun began with the server's challenges. One required the client to move the player in a way that mimicked a bot, not a human. This meant overcoming the limitations of how computers represent numbers to ensure the server wouldn't detect "human-like" rounding errors.

Another challenge involved reaching a protected chest. The initial solution involved some trickery, but the server was patched. To adapt, the client needed to exploit a loophole in how the server tracked player movement. By manipulating the game's internal state and sending carefully crafted packets, the client achieved imperceptible movements, bypassing the server's defenses.

Reverse engineering the server's code was crucial in finding these exploits. By understanding the server's logic and implementation, I could identify vulnerabilities and devise strategies to exploit them. This process required a deep dive into the Minecraft server's source code and a keen eye for potential weaknesses.

The code for this client was written in Kotlin and injected into the Minecraft client using Fabric. This approach allowed for flexibility and customization, perfectly suited for tackling the server's unique challenges.

This project was a fascinating exploration of Minecraft's inner workings and the creativity required to overcome seemingly impossible challenges. As new challenges emerge, this client was ready to evolve and conquer them!

See also [my post about the experience]({{% ref "posts/liveoverflow-minecraft-server.md" %}}) for a more in-depth explanation.
