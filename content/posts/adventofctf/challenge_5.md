+++
author = "Maik de Kruif"
title = "Challenge 5 - AdventOfCTF"
date = 2020-12-05T08:57:31+01:00
description = "Challenge 5 of AdventOfCTF."
cover = "img/adventofctf/080b5d5fcaf13167d2e7e8871fdc8ded.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "sql-injection",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 500

## Description

Again a login form stands in your way. What powerful 'hacker' tool will help you proceed?

Visit <https://05.adventofctf.com> to start the challenge.

## Finding the vulnerability

Upon opening the challenge website, we're, yet again, greeted with a login form. As the last few challenges used javascript I immediately opened the devtools to have a look at the sources. But, no javascript! This time it looks like the form is actually submitted. Below the form there is also some text: "A classic, with a twist.". When talking about forms, a classic exploit is SQL Injection. So let's try that.

### SQL Injection

My first try was to submit a quote `'` as the username and some garbage password. This is a common check for SQLi and if it works it throws an error:

```text
Error description: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'sd'' at line 1
```

But how does this work in the first place?

#### Background

When a login form on a website is submitted, the website often connects to a database to check the login credentials. On most website this database is a SQL database.

Here's an example of a query to check login credentials:

```sql
FROM `users` SELECT * WHERE `username`='' AND `password`=''
```

_Note: the backticks (`\``) mean the content of it is a column in the database._

The username and password values are inserted in this query and if there is a result, the database will return it.

#### Vulnerability

Now that we know how it works, we can try to exploit it. Take my first input for example (`'`) and see what the resulting query would be.

```sql
FROM `users` SELECT * WHERE `username`=''' AND `password`='garbage'
```

The query becomes invalid as there is an unterminated string. So, how do we turn this query into one that logs us in as the admin?

## Solution

Firstly, I tried to use `' OR 1=1 -- ` as the username and, again, some garbage as the password. However, it didn't work. It didn't even return an error. So I guess this is where "A classic, with a twist." comes in. Next, I tried to just use `admin` as the username and end the query after it by inserting a comment (this is `--` in sql). The resulting input would become `admin' -- ` for the username, the password doesn't matter.

The resulting query would be this:

```sql
FROM `users` SELECT * WHERE `username`='admin' -- ' AND `password`='garbage'
```

As we can see, it now only checks the username. I submitted the form and, I got the flag! It is `NOVI{th3_classics_with_a_7wis7}`

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#5-6).
