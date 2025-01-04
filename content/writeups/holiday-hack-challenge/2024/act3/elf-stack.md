+++
author = "Maik de Kruif"
title = "Elf Stack"
subtitle = "Act 3 - SANS Holiday Hack Challenge 2024"
date = 2025-01-04T02:00:00+01:00
description = "In Elf Stack SIEM, we help a North Pole elf investigate a cyberattack by the Wombley faction. In Silver, we analyze logs to uncover key insights like event counts and sources, using Python and pandas. Gold dives deeper, exploring phishing emails and reindeer-related domains to trace the attackers. By scripting smart queries, we piece together the attack chain, earning both medals and restoring order to the North Pole’s systems!"
cover = "img/writeups/holiday-hack-challenge/2024/act3/elf-stack/cover.png"
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

> Greetings! I'm the genius behind the North Pole Elf Stack SIEM. And oh boy, we’ve got a situation on our hands.
>
> Our system was attacked—Wombley’s faction unleashed their FrostBit ransomware, and it’s caused a digital disaster.
>
> The logs are a mess, and Wombley’s laptop—the only backup of the Naughty-Nice List—was smashed to pieces.
>
> Now, it’s all up to you to help me trace the attack vectors and events. We need to figure out how this went down before it’s too late.
>
> You’ll be using a containerized ELK stack or Linux CLI tools. Sounds like a fun little puzzle, doesn't it?
>
> Your job is to analyze these logs... think of it as tracking snow tracks but in a digital blizzard.
>
> If you can find the attack path, maybe we can salvage what’s left and get Santa’s approval.
>
> Santa’s furious at the faction fighting, and he’s disappointed. We have to make things right.
>
> So, let’s show these attackers that the North Pole’s defenses are no joke!

## Hints

{{< collapsible-block title="Elf Stack Intro" isCollapsed="true" class="tight" >}}
I'm part of the ElfSOC that protects the interests here at the North Pole. We built the Elf Stack SIEM, but not everybody uses it. Some of our senior analysts choose to use their command line skills, while others choose to deploy their own solution. Any way is possible to hunt through our logs!
{{< /collapsible-block >}}

{{< collapsible-block title="Elf Stack Fields" isCollapsed="true" class="tight" >}}
If you are using your command line skills to solve the challenge, you might need to review the configuration files from the containerized Elf Stack SIEM.
{{< /collapsible-block >}}

{{< collapsible-block title="Elf Stack WinEvent" isCollapsed="true" class="tight" >}}
One of our seasoned ElfSOC analysts told me about a great resource to have handy when hunting through event log data. I have it around here somewhere, or maybe it was online. Hmm.
{{< /collapsible-block >}}

{{< collapsible-block title="Elf Stack PowerShell" isCollapsed="true" class="tight" >}}
Our Elf Stack SIEM has some minor issues when parsing log data that we still need to figure out. Our ElfSOC SIEM engineers drank many cups of hot chocolate figuring out the right parsing logic. The engineers wanted to ensure that our junior analysts had a solid platform to hunt through log data.
{{< /collapsible-block >}}

{{< collapsible-block title="Elf Stack Hard - Email1" isCollapsed="true" class="tight" >}}
I was on my way to grab a cup of hot chocolate the other day when I overheard the reindeer talking about playing games. The reindeer mentioned trying to invite Wombley and Alabaster to their games. This may or may not be great news. All I know is, the reindeer better create formal invitations to send to both Wombley and Alabaster.
{{< /collapsible-block >}}

{{< collapsible-block title="Elf Stack Hard - Email2" isCollapsed="true" class="tight" >}}
Some elves have tried to make tweaks to the Elf Stack log parsing logic, but only a seasoned SIEM engineer or analyst may find that task useful.
{{< /collapsible-block >}}

## Recon

Upon clicking on the challenge, an iframe pops up with some instructions and a menu.

{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/elf-stack/initial-screen.png" title="Quick Start Instructions" >}}
{{< figure class="small inline" src="/img/writeups/holiday-hack-challenge/2024/act3/elf-stack/menu.png" title="Menu" >}}

In the menu we find four buttons, "Easy Mode", "Hard Mode", "Help" and "Download". The Help page will show us some information about how to set up the SIEM.

{{< collapsible-block title="Help" isCollapsed="true" class="tight" >}}

### Elf Stack Help

#### Description

-   Help the ElfSOC analysts and test your technical and security skills while you investigate a malicious attack. You will parse a set of log files to identify the malicious attack vector and various events within an attack chain.
-   The log parsing skills emphasized by this challenge can be done with the provided containerized Elf Stack SIEM, through traditional Linux CLI tools, or however you want. There are two challenge modes (EASY and HARD) which determines the difficulty of questions presented to you.
-   **Note:** You do not have to use the containerized SIEM to solve any of the questions, but it might make things a bit easier!
-   You can download the containerized Elf Stack SIEM configuration and log files by selecting the "Download" button.

#### Challenge Modes

##### Easy Mode

-   This mode teaches basic log parsing with a common SIEM utility like the ELK stack. You are provided a Docker Compose configuration that allows you to fully setup an ELK stack within a containerized environment.
-   Select this mode if you are new to security, or you want to continue on with the story. This mode is meant to help you learn while doing.

##### Hard Mode

-   This mode expects you have some knowledge on parsing log files. The attack path is more complex and you will need to research how to identify the steps within the attack chain.
-   Select this mode if you want to challenge your security skills.

#### Optional: Elf Stack SIEM

##### Containerized ELK Stack

-   The containerized SIEM is provided to assist in solving the challenge. The SIEM is fully functional and configured to ingest the provided log files.
-   Note: This was built and tested on an Ubuntu 22.04 Linux virtual machine.

##### Containerized ELK Stack: Prerequisites

-   Minimum system specs to run the containerized SIEM. The specs below minimize the loss of logs during ingestion. Adjusting the specs down may cause longer delays in log ingestion, loss of logs during ingestion, or slow performance:
    -   RAM: Minimum 16GB
    -   CPU Cores: Minimum 4
    -   Hard drive space: Minimum 30GB / Recommended 40GB
    -   A network interface with internet connectivity
-   Follow the instructions on Docker Installation Guide to install Docker on your respective platform.
-   After installation of Docker, download the Elf Stack files from the download page.
-   Unzip/Extract the containerized files into a single directory.

##### Containerized ELK Stack: Setup

-   **NOTE:** Setup time depends on internet connectivity and system resources.
-   Browse to the directory containing the container SIEM files and setup the environment. Time to complete ~2-10 minutes:

    ```sh
    docker compose up setup
    ```

-   Run the ELF Stack SIEM to automatically ingest the logs. Time to complete ~20-30 minutes:

    ```sh
    docker compose up
    ```

-   The terminal output will display:

    -   When logs ingestion is complete.
    -   The login URL and credentials.

-   After the login URL and credentials are displayed, the Elf Stack SIEM is ready for use.
-   **NOTE:** After your Elf Stack SIEM is setup, ensure you set the timeframe to look at events in 2024.

##### Containerized ELK Stack: Teardown

-   Use the following command to shut down the Elf Stack SIEM:

    ```sh
    docker compose down --volumes
    ```

-   **NOTE:** The command requires the --volumes syntax to clear the volume data which may skew your results if you set the stack up again later.

{{< /collapsible-block >}}

Upon clicking the download button, we'll get links to three files:

-   [log_chunk_2.log.zip](https://hhc24-elfstack.holidayhackchallenge.com/download_file/log_chunk_2.log.zip)
-   [elf-stack-siem-with-logs.zip](https://hhc24-elfstack.holidayhackchallenge.com/download_file/elf-stack-siem-with-logs.zip)
-   [log_chunk_1.log.zip](https://hhc24-elfstack.holidayhackchallenge.com/download_file/log_chunk_1.log.zip)

The files starting with "log_chunk\_" are zipped log files, and the "elf-stack-siem-with-logs.zip" file contains the Elf Stack SIEM setup, which is optional.

## Set up environment

There are multiple ways to go around solving this challenge, we can use the provided Elf Stack SIEM, but we can also use plain bash commands or Python. I chose to go with the latter, but my RAM didn't like it :smile:.

In oder to read the logs with Python, we'll first have to transform the logs into a more usable format. What the current format looks like can be found in the provided SIEM's config, namely in the `logstash.conf` file. There, we find that [grok](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html) is used, along with the format string.

```txt
<%{NONNEGINT:syslog_pri}>%{NONNEGINT:version}%{SPACE}(?:-|%{TIMESTAMP_ISO8601:syslog_timestamp})%{SPACE}(?:-|%{IPORHOST:hostname})%{SPACE}(?:%{SYSLOG5424PRINTASCII:event_source}|-)%{SPACE}(?:-|%{SYSLOG5424PRINTASCII:event_source_id})%{SPACE}(?:-|%{SYSLOG5424PRINTASCII:msgid})%{SPACE}(?:-|(?<structured_data>(\[.*?[^\\]\])+))(?:%{SPACE}%{GREEDYDATA:message_json}|)
```

There is not support for grok in the standard library, we there is a package out there called [`py3grok`](https://github.com/ztroop/py3grok), which allows us to parse the log lines into dictionaries. We can use this in a script to transform both log files into a single big json file.

```py
from py3grok import GrokEnvironment
import json


# Parse log files to JSON
grok_env = GrokEnvironment()
pattern = "<%{NONNEGINT:syslog_pri}>%{NONNEGINT:version}%{SPACE}(?:-|%{TIMESTAMP_ISO8601:syslog_timestamp})%{SPACE}(?:-|%{IPORHOST:hostname})%{SPACE}(?:%{SYSLOG5424PRINTASCII:event_source}|-)%{SPACE}(?:-|%{SYSLOG5424PRINTASCII:event_source_id})%{SPACE}(?:-|%{SYSLOG5424PRINTASCII:msgid})%{SPACE}(?:-|(?<structured_data>(\\[.*?[^\\\\]\\])+))(?:%{SPACE}%{GREEDYDATA:message_json}|)"
grok = grok_env.create(pattern)

with open("logs.json", "w") as out_file:
    out_file.write("[\n")

    for log_filename in ["log_chunk_1.log", "log_chunk_2.log"]:
        with open(log_filename, "r") as f:
            for line in f:
                text = line.strip()
                log = grok.match(text)
                for key, value in json.loads(log["message_json"]).items():
                    log[f"message.{key}"] = value
                del log["message_json"]  # We don't need it anymore, so save some RAM by deleting it
                out_file.write(json.dumps(log))
                out_file.write(",\n")

    out_file.seek(out_file.tell()-2)
    out_file.write("\n]\n")
```

This will take some time to run, but once finished we find a 4.5 GB large `logs.json` file.

Now that we have it in a more common format, we can look into loading the file. Because loading it will take a long time (due to the file size), we prefer it to be kept in memory while we make changes to the script. A [Jupyter Notebook](https://jupyter.org/) is the perfect solution for this. It's like an interactive shell, everything will stay in memory in between changes.

We can use the official Jupyter Notebook setup, but I prefer to use [Visual Studio Code](https://code.visualstudio.com/) (VSCode). It's easier in use, and requires less setup. In VSCode, we can just create a file ending in `.ipynb`, and it'll automatically load it as a notebook.

We can then use the `pandas` library to load and query the data.

```py
import pandas as pd
```

```py
df = pd.read_json("logs.json")
df
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname                    | event_source | event_source_id | msgid | structured_data | message.timestamp                | message.hostname | ... | message.AdditionalInformation_RequestedUPN | message.UserInformation_UPN | message.CertificateInformation_CertificateTemplate | message.AdditionalInformation_CallerComputer | message.CertificateTemplateInformation_CertificateTemplateName | message.ModifierInformation_UserName | message.ModifierInformation_Computer | message.Details_ModificationType | message.Details_NewSecuritySettings | message.CallerComputer |
| ------- | ---------- | ------- | ------------------------- | --------------------------- | ------------ | --------------- | ----- | --------------- | -------------------------------- | ---------------- | --- | ------------------------------------------ | --------------------------- | -------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ | ------------------------------------ | -------------------------------- | ----------------------------------- | ---------------------- |
| 0       | 134        | 1       | 2024-09-15T00:10:01-04:00 | kringleSSleigH              | AuthLog      | NaN             | NaN   | NaN             | 2024-09-15T03:10:01.304953-04:00 | kringleSSleigH   | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 1       | 134        | 1       | 2024-09-15T00:10:01-04:00 | kringleSSleigH              | AuthLog      | NaN             | NaN   | NaN             | 2024-09-15T03:10:01.314490-04:00 | kringleSSleigH   | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2       | 134        | 1       | 2024-09-15T00:10:01-04:00 | SleighRider.northpole.local | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 3       | 134        | 1       | 2024-09-15T00:10:02-04:00 | SleighRider.northpole.local | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 4       | 134        | 1       | 2024-09-15T00:10:03-04:00 | dc01.northpole.local        | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| ...     | ...        | ...     | ...                       | ...                         | ...          | ...             | ...   | ...             | ...                              | ...              | ... | ...                                        | ...                         | ...                                                | ...                                          | ...                                                            | ...                                  | ...                                  | ...                              | ...                                 | ...                    |
| 2343141 | 134        | 1       | 2024-09-16T11:14:12-04:00 | dc01.northpole.local        | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | administrator\@northpole.local             | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2343142 | 134        | 1       | 2024-09-16T11:15:12-04:00 | dc01.northpole.local        | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | nutcrakr\@northpole.local   | ElfUsers                                           | 172.24.25.153                                | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2343143 | 134        | 1       | 2024-09-16T11:15:12-04:00 | dc01.northpole.local        | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | ElfUsers                                                       | nutcrakr                             | 10.12.25.24                          | Permissions Update               | [Details not specified in log]      | 172.24.25.153          |
| 2343144 | 134        | 1       | 2024-09-16T11:33:12-04:00 | SleighRider.northpole.local | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2343145 | 134        | 1       | 2024-09-16T11:33:12-04:00 | SleighRider.northpole.local | WindowsEvent | NaN             | NaN   | NaN             | NaN                              | NaN              | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |

{{< /collapsible-block >}}

The loading might take a while, for me it took 4m 28.8s and used in excess of 100 GB of RAM/swap.

## Silver

With the setup ready, we can start with the challenge. Let's click Easy Mode and start with the first task.

### Question 1

**How many unique values are there for the event_source field in all logs?**

Starting off easy, we can use panda's `nunique` function on the "event_source" field.

```py
df["event_source"].nunique()
```

```py
5
```

Answer: `5`

### Question 2

**Which event_source has the fewest number of events related to it?**

For question 2, the `value_counts` function can be used.

```py
df["event_source"].value_counts()
```

| event_source    | count   |
| --------------- | ------- |
| WindowsEvent    | 2299324 |
| NetflowPmacct   | 34679   |
| GreenCoat       | 7476    |
| SnowGlowMailPxy | 1398    |
| AuthLog         | 269     |

Answer: `AuthLog`

### Question 3

**Using the event_source from the previous question as a filter, what is the field name that contains the name of the system the log event originated from?**

Next up is finding the column. We can filter on the event source, and then use `.T.dropna(how="all").T` to strip off all columns that only contain empty values. This way we remove the columns used by other event sources.

```py
df[df["event_source"] == "AuthLog"].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname       | event_source | message.timestamp                | message.hostname | message.service | message.message                                   |
| ------- | ---------- | ------- | ------------------------- | -------------- | ------------ | -------------------------------- | ---------------- | --------------- | ------------------------------------------------- |
| 0       | 134        | 1       | 2024-09-15T00:10:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:10:01.304953-04:00 | kringleSSleigH   | CRON[4863]:     | pam_unix(cron:session): session opened for use... |
| 1       | 134        | 1       | 2024-09-15T00:10:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:10:01.314490-04:00 | kringleSSleigH   | CRON[4863]:     | pam_unix(cron:session): session closed for use... |
| 157     | 134        | 1       | 2024-09-15T00:17:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:17:01.331687-04:00 | kringleSSleigH   | CRON[4872]:     | pam_unix(cron:session): session opened for use... |
| 158     | 134        | 1       | 2024-09-15T00:17:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:17:01.341866-04:00 | kringleSSleigH   | CRON[4872]:     | pam_unix(cron:session): session closed for use... |
| 1457    | 134        | 1       | 2024-09-15T01:17:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T04:17:01.457972-04:00 | kringleSSleigH   | CRON[4923]:     | pam_unix(cron:session): session opened for use... |
| ...     | ...        | ...     | ...                       | ...            | ...          | ...                              | ...              | ...             | ...                                               |
| 2328131 | 134        | 1       | 2024-09-16T11:58:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:58:01.331792-04:00 | kringleSSleigH   | CRON[6769]:     | pam_unix(cron:session): session closed for use... |
| 2341849 | 134        | 1       | 2024-09-16T11:59:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:59:01.339409-04:00 | kringleSSleigH   | CRON[6777]:     | pam_unix(cron:session): session opened for use... |
| 2341850 | 134        | 1       | 2024-09-16T11:59:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:59:01.345015-04:00 | kringleSSleigH   | CRON[6777]:     | pam_unix(cron:session): session closed for use... |
| 2341885 | 134        | 1       | 2024-09-16T12:00:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T15:00:01.348709-04:00 | kringleSSleigH   | CRON[6780]:     | pam_unix(cron:session): session opened for use... |
| 2341886 | 134        | 1       | 2024-09-16T12:00:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T15:00:01.353084-04:00 | kringleSSleigH   | CRON[6780]:     | pam_unix(cron:session): session closed for use... |

{{< /collapsible-block >}}

Answer: `hostname`

### Question 4

**Which event_source has the second highest number of events related to it?**

We can reuse the result from question 2 here.

```py
df["event_source"].value_counts()
```

| event_source    | count   |
| --------------- | ------- |
| WindowsEvent    | 2299324 |
| NetflowPmacct   | 34679   |
| GreenCoat       | 7476    |
| SnowGlowMailPxy | 1398    |
| AuthLog         | 269     |

Answer: `NetflowPmacct`

### Question 5

**Using the event_source from the previous question as a filter, what is the name of the field that defines the destination port of the Netflow logs?**

Reusing what we did for question 3, we can run the following query.

```py
df[df["event_source"] == "NetflowPmacct"].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|        | syslog_pri | version | syslog_timestamp          | hostname       | event_source  | message.event_type | message.ip_src | message.ip_dst | message.port_src | message.port_dst | message.ip_proto | message.timestamp_start   | message.timestamp_end     | message.packets | message.bytes | message.src_host           | message.dst_host           |
| ------ | ---------- | ------- | ------------------------- | -------------- | ------------- | ------------------ | -------------- | -------------- | ---------------- | ---------------- | ---------------- | ------------------------- | ------------------------- | --------------- | ------------- | -------------------------- | -------------------------- |
| 718166 | 134        | 1       | 2024-09-15T10:37:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.93   | 172.24.25.25   | 29994.0          | 808.0            | tcp              | 2024-09-15T10:37:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 40.0          | SnowSentry.northpole.local |                            |
| 718167 | 134        | 1       | 2024-09-15T10:37:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.25   | 172.24.25.93   | 808.0            | 29996.0          | tcp              | 2024-09-15T10:37:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 71.0          |                            | SnowSentry.northpole.local |
| 718168 | 134        | 1       | 2024-09-15T10:37:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.25   | 172.24.25.93   | 808.0            | 29998.0          | tcp              | 2024-09-15T10:37:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 4731.0        |                            | SnowSentry.northpole.local |
| 718169 | 134        | 1       | 2024-09-15T10:37:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.93   | 172.24.25.25   | 29998.0          | 808.0            | tcp              | 2024-09-15T10:37:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 40.0          | SnowSentry.northpole.local |                            |
| 718170 | 134        | 1       | 2024-09-15T10:37:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.93   | 172.24.25.25   | 29998.0          | 808.0            | tcp              | 2024-09-15T10:37:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 104.0         | SnowSentry.northpole.local |                            |
| ...    | ...        | ...     | ...                       | ...            | ...           | ...                | ...            | ...            | ...              | ...              | ...              | ...                       | ...                       | ...             | ...           | ...                        | ...                        |
| 775661 | 134        | 1       | 2024-09-15T10:38:43-04:00 | kringleconnect | NetflowPmacct | purge              | 34.98.72.95    | 172.24.25.25   | 443.0            | 52275.0          | tcp              | 2024-09-15T10:38:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 40.0          |                            |                            |
| 775662 | 134        | 1       | 2024-09-15T10:38:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.25   | 146.75.81.44   | 52218.0          | 443.0            | tcp              | 2024-09-15T10:38:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 41.0          |                            |                            |
| 775663 | 134        | 1       | 2024-09-15T10:38:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.25   | 172.24.25.93   | 808.0            | 30109.0          | tcp              | 2024-09-15T10:38:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 41.0          |                            | SnowSentry.northpole.local |
| 775664 | 134        | 1       | 2024-09-15T10:38:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.93   | 172.24.25.25   | 30109.0          | 808.0            | tcp              | 2024-09-15T10:38:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 52.0          | SnowSentry.northpole.local |                            |
| 775665 | 134        | 1       | 2024-09-15T10:38:43-04:00 | kringleconnect | NetflowPmacct | purge              | 172.24.25.20   | 146.75.81.44   | 52218.0          | 443.0            | tcp              | 2024-09-15T10:38:43-04:00 | 0000-00-00T00:00:00-00:00 | 1.0             | 41.0          |                            |                            |

{{< /collapsible-block >}}

We'll find the remote port in the `message.port_dst` column.

Answer: `port_dst`

### Question 6

**Which event_source is related to email traffic?**

We can list the distinct event sources using the `unique` function.

```py
df["event_source"].unique()
```

```py
array(['AuthLog', 'WindowsEvent', 'GreenCoat', 'SnowGlowMailPxy',
       'NetflowPmacct'], dtype=object)
```

Answer: `SnowGlowMailPxy`

### Question 7

**Looking at the event source from the last question, what is the name of the field that contains the actual email text?**

Once again we can reuse a previous query from question 3 and 5.

```py
df[df["event_source"] == "SnowGlowMailPxy"].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname     | event_source    | message.From                    | message.To                    | message.Subject                                   | message.Message-ID                                    | message.Return-Path                     | message.Body                                      | message.Received_Time     | message.ReceivedIP1 | message.ReceivedIP2 |
| ------- | ---------- | ------- | ------------------------- | ------------ | --------------- | ------------------------------- | ----------------------------- | ------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------- | ------------------------- | ------------------- | ------------------- |
| 486676  | 134        | 1       | 2024-09-15T08:26:14-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user00\@northpole.local     | asnowball04\@northpole.local  | Welcome to the North Pole!                        | &lt;532A9346-9F5F-4C29-BD40-CA171DD0E7DE\@SecureEl... | elf_user00\@northpole.local             | Dear asnowball04,\n\nI wanted to inform you th... | 2024-09-15 08:26:14-04:00 | 172.24.25.25        | 172.24.25.20        |
| 486843  | 134        | 1       | 2024-09-15T08:26:17-04:00 | SecureElfGwy | SnowGlowMailPxy | GingerGem\@merry.elves          | elf_user10\@northpole.local   | Request for Competitor Analysis Report            | &lt;99712D58-D39D-4186-B1E0-BA34B37D3A83\@SecureEl... | GingerGem\@merry.elves                  | Dear elf_user10,\n\nHope this email finds you ... | 2024-09-15 08:26:17-04:00 | 172.24.25.25        | 172.24.25.20        |
| 486946  | 134        | 1       | 2024-09-15T08:26:19-04:00 | SecureElfGwy | SnowGlowMailPxy | asnowball_05\@northpole.local   | wcub303\@northpole.local      | Travel Arrangements - Urgent                      | &lt;5A40805A-532B-4AD0-B05B-25091BBEB757\@SecureEl... | asnowball_05\@northpole.local           | Dear wcub303,\n\nI hope this message finds you... | 2024-09-15 08:26:19-04:00 | 172.24.25.25        | 172.24.25.20        |
| 516915  | 134        | 1       | 2024-09-15T08:37:41-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user02\@northpole.local     | wcub101\@northpole.local      | Meeting Schedules Update                          | &lt;96D21546-EC3F-4BFE-9358-C7CE74705F83\@SecureEl... | elf_user02\@northpole.local             | Dear wcub101,\n\nI hope this email finds you i... | 2024-09-15 08:37:41-04:00 | 172.24.25.25        | 172.24.25.20        |
| 517150  | 134        | 1       | 2024-09-15T08:37:45-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user07\@northpole.local     | elf_user07\@northpole.local   | Employee Surveys - Your Valuable Feedback Matt... | &lt;F486377B-82EC-47AC-A096-F0D7CDD239D4\@SecureEl... | elf_user07\@northpole.local             | Dear elf_user07,\n\nI hope this email finds yo... | 2024-09-15 08:37:45-04:00 | 172.24.25.25        | 172.24.25.20        |
| ...     | ...        | ...     | ...                       | ...          | ...             | ...                             | ...                           | ...                                               | ...                                                   | ...                                     | ...                                               | ...                       | ...                 | ...                 |
| 2341927 | 134        | 1       | 2024-09-16T12:01:09-04:00 | SecureElfGwy | SnowGlowMailPxy | wcub808\@northpole.local        | wcub303\@northpole.local      | No Subject                                        | &lt;12D146C1-B183-465D-B128-573B0B7A0BAF\@SecureEl... | wcub808\@northpole.local                | wcub808,\n\nI hope this email finds you ready ... | 2024-09-16 12:01:09-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341932 | 134        | 1       | 2024-09-16T12:01:14-04:00 | SecureElfGwy | SnowGlowMailPxy | HollyHelper\@stocking.chimney   | asnowball_05\@northpole.local | Health and Safety Updates: Ensuring a Secure W... | &lt;EC9C4C52-2381-4EDA-A7C8-193DCA7C7AE9\@SecureEl... | NorthPolePostmaster\@northpole.exchange | Dear asnowball_05,\n\nI hope this email finds ... | 2024-09-16 12:01:14-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341933 | 134        | 1       | 2024-09-16T12:01:19-04:00 | SecureElfGwy | SnowGlowMailPxy | TinselTwinkle\@stocking.chimney | elf_user06\@northpole.local   | Employee Surveys - Your Valuable Insights Matter! | &lt;F7297E75-ED87-441E-AD5E-E069531907E0\@SecureEl... | NorthPolePostmaster\@northpole.exchange | Dear elf_user06,\n\nI hope this email finds yo... | 2024-09-16 12:01:19-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341936 | 134        | 1       | 2024-09-16T12:01:24-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user02\@northpole.local     | elf_user08\@northpole.local   | Urgent: System Outage Updates                     | &lt;75324EA6-777B-4341-BABB-0A0577906233\@SecureEl... | elf_user02\@northpole.local             | Dear elf_user08,\n\nI hope this email finds yo... | 2024-09-16 12:01:24-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341939 | 134        | 1       | 2024-09-16T12:01:28-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user05\@northpole.local     | elf_user03\@northpole.local   | Performance Reviews                               | &lt;9EE973CD-029D-4F86-B3B3-D1A9DCCC74BC\@SecureEl... | elf_user05\@northpole.local             | Dear elf_user03,\n\nI hope this email finds yo... | 2024-09-16 12:01:28-04:00 | 172.24.25.25        | 172.24.25.20        |

{{< /collapsible-block >}}

We'll then see the email contents in `message.Body`.

Answer: `Body`

### Question 8

**Using the 'GreenCoat' event_source, what is the only value in the hostname field?**

For this one we can combine the filter with the `unique` function.

```py
df[df["event_source"] == "GreenCoat"]["hostname"].unique()
```

```py
array(['SecureElfGwy'], dtype=object)
```

Answer: `SecureElfGwy`

### Question 9

**Using the 'GreenCoat' event_source, what is the name of the field that contains the site visited by a client in the network?**

You know how this works by now.

```py
df[df["event_source"] == "GreenCoat"].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname     | event_source | message.timestamp         | message.ip   | message.user_identifier | message.method | message.url                              | message.http_protocol | message.status_code | message.response_size | message.protocol | message.additional_info   | message.host   |
| ------- | ---------- | ------- | ------------------------- | ------------ | ------------ | ------------------------- | ------------ | ----------------------- | -------------- | ---------------------------------------- | --------------------- | ------------------- | --------------------- | ---------------- | ------------------------- | -------------- |
| 84877   | 134        | 1       | 2024-09-15T05:57:55-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:57:55-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 84942   | 134        | 1       | 2024-09-15T05:57:56-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:57:56-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | kv601.prod.do.dsp.mp.microsoft.com:443   | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 86222   | 134        | 1       | 2024-09-15T05:58:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:58:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 87485   | 134        | 1       | 2024-09-15T05:58:52-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:58:52-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 87825   | 134        | 1       | 2024-09-15T05:58:58-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:58:58-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| ...     | ...        | ...     | ...                       | ...          | ...          | ...                       | ...          | ...                     | ...            | ...                                      | ...                   | ...                 | ...                   | ...              | ...                       | ...            |
| 1901727 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | aax.amazon-adsystem.com:443              | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901728 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | hbopenbid.pubmatic.com:443               | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901729 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | bidder.criteo.com:443                    | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901730 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | fastlane.rubiconproject.com:443          | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901731 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.91 | elf_user01              | CONNECT        | x.bidswitch.net:443                      | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | VirtualStation |

{{< /collapsible-block >}}

We then find the sites in the `message.url` column.

Answer: `url`

### Question 10

**Using the 'GreenCoat' event_source, which unique URL and port (URL:port) did clients in the TinselStream network visit most?**

This one should also be pretty clear from the previous ones.

```py
df[df["event_source"] == "GreenCoat"]["message.url"].value_counts()
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

| message.url                        | count |
| ---------------------------------- | ----- |
| pagead2.googlesyndication.com:443  | 150   |
| ib.adnxs.com:443                   | 105   |
| securepubads.g.doubleclick.net:443 | 98    |
| cdn.cookielaw.org:443              | 82    |
| cm.g.doubleclick.net:443           | 80    |
| ...                                | ...   |
| eq97f.publishers.tremorhub.com:443 | 1     |
| featuregates.org:443               | 1     |
| batch.cootlogix.com:443            | 1     |
| delivery-cdn-cf.adswizz.com:443    | 1     |
| adswizz-match.dotomi.com:443       | 1     |

{{< /collapsible-block >}}

Answer: `pagead2.googlesyndication.com:443`

### Question 11

**Using the 'WindowsEvent' event_source, how many unique Channels is the SIEM receiving Windows event logs from?**

To count the amount of unique values, we can use `nunique` again.

```py
df[df["event_source"] == "WindowsEvent"]["message.Channel"].nunique()
```

```py
5
```

Answer: `5`

### Question 12

**What is the name of the event.Channel (or Channel) with the second highest number of events?**

One last value count for good pratice.

```py
df[df["event_source"] == "WindowsEvent"]["message.Channel"].value_counts()
```

| message.Channel                          | count   |
| ---------------------------------------- | ------- |
| Security                                 | 2268402 |
| Microsoft-Windows-Sysmon/Operational     | 17713   |
| Microsoft-Windows-PowerShell/Operational | 11751   |
| System                                   | 191     |
| Windows PowerShell                       | 50      |

Answer: `Microsoft-Windows-Sysmon/Operational`

### Question 13

**Our environment is using Sysmon to track many different events on Windows systems. What is the Sysmon Event ID related to loading of a driver?**

For this one we'll have to look online. A good place is [Microsoft's documentation](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-6-driver-loaded), were find that Event ID 6 is used for the driver loaded events.

Answer: `6`

### Question 14

**What is the Windows event ID that is recorded when a new service is installed on a system?**

[Microsoft's documentation](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4697) will help us once again here. Although the documentation can be hard to find, it often does exist.

Answer: `4697`

### Question 15

**Using the WindowsEvent event_source as your initial filter, how many user accounts were created?**

Before we can query the logs, we need to know how to look for account creation events. We can once again look at [Microsoft's documentation](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4720), and find that Event ID 4720 is used for that.

```py
len(
    df[
        (df["event_source"] == "WindowsEvent")
        & (df["message.EventID"] == 4720)
    ]
)
```

```py
0
```

Looks like no new user accounts were created

Answer: `0`

## Gold

Not that the practice round is done, we're ready for Hard Mode.

### Continued story line

Let's first talk to the elf again.

> Fantastic job! You worked through the logs using the ELK stack like a pro—efficient, quick, and spot-on. Maybe, just maybe, this will turn Santa’s frown upside down!
>
> Up for the real challenge? Take a deep dive into those logs and query your way through the chaos. It might be tricky, but I know your adaptable skills will crack it!
>
> Bravo! You pieced it all together, uncovering the attack path. Santa’s gonna be grateful for your quick thinking and tech savvyness. The North Pole owes you big time!

### Question 1

**What is the event.EventID number for Sysmon event logs relating to process creation?**

Gold starts off where silver stopped, and we'll have to find an Event ID again. Just like the previous times, we can find the Event ID in [Microsoft's documentation](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-1-process-creation).

Answer: `1`

### Question 2

**How many unique values are there for the 'event_source' field in all of the logs?**

We should know how to use `nunique` by now.

```py
df["event_source"].nunique()
```

```py
5
```

Answer: `5`

### Question 3

**What is the event_source name that contains the email logs?**

A quick listing of all event sources will show us the email logs source.

```py
df["event_source"].unique()
```

```py
array(['AuthLog', 'WindowsEvent', 'GreenCoat', 'SnowGlowMailPxy',
       'NetflowPmacct'], dtype=object)
```

Answer: `SnowGlowMailPxy`

### Question 4

**The North Pole network was compromised recently through a sophisticated phishing attack sent to one of our elves. The attacker found a way to bypass the middleware that prevented phishing emails from getting to North Pole elves. As a result, one of the Received IPs will likely be different from what most email logs contain. Find the email log in question and submit the value in the event 'From:' field for this email log event.**

Okay, now we'll have to combine a few things. First, let's take a look at what the email logs look like.

```py
email_df = df[df["event_source"] == "SnowGlowMailPxy"].T.dropna(how="all").T
email_df
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname     | event_source    | message.From                    | message.To                    | message.Subject                                   | message.Message-ID                                    | message.Return-Path                     | message.Body                                      | message.Received_Time     | message.ReceivedIP1 | message.ReceivedIP2 |
| ------- | ---------- | ------- | ------------------------- | ------------ | --------------- | ------------------------------- | ----------------------------- | ------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------- | ------------------------- | ------------------- | ------------------- |
| 486676  | 134        | 1       | 2024-09-15T08:26:14-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user00\@northpole.local     | asnowball04\@northpole.local  | Welcome to the North Pole!                        | &lt;532A9346-9F5F-4C29-BD40-CA171DD0E7DE\@SecureEl... | elf_user00\@northpole.local             | Dear asnowball04,\n\nI wanted to inform you th... | 2024-09-15 08:26:14-04:00 | 172.24.25.25        | 172.24.25.20        |
| 486843  | 134        | 1       | 2024-09-15T08:26:17-04:00 | SecureElfGwy | SnowGlowMailPxy | GingerGem\@merry.elves          | elf_user10\@northpole.local   | Request for Competitor Analysis Report            | &lt;99712D58-D39D-4186-B1E0-BA34B37D3A83\@SecureEl... | GingerGem\@merry.elves                  | Dear elf_user10,\n\nHope this email finds you ... | 2024-09-15 08:26:17-04:00 | 172.24.25.25        | 172.24.25.20        |
| 486946  | 134        | 1       | 2024-09-15T08:26:19-04:00 | SecureElfGwy | SnowGlowMailPxy | asnowball_05\@northpole.local   | wcub303\@northpole.local      | Travel Arrangements - Urgent                      | &lt;5A40805A-532B-4AD0-B05B-25091BBEB757\@SecureEl... | asnowball_05\@northpole.local           | Dear wcub303,\n\nI hope this message finds you... | 2024-09-15 08:26:19-04:00 | 172.24.25.25        | 172.24.25.20        |
| 516915  | 134        | 1       | 2024-09-15T08:37:41-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user02\@northpole.local     | wcub101\@northpole.local      | Meeting Schedules Update                          | &lt;96D21546-EC3F-4BFE-9358-C7CE74705F83\@SecureEl... | elf_user02\@northpole.local             | Dear wcub101,\n\nI hope this email finds you i... | 2024-09-15 08:37:41-04:00 | 172.24.25.25        | 172.24.25.20        |
| 517150  | 134        | 1       | 2024-09-15T08:37:45-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user07\@northpole.local     | elf_user07\@northpole.local   | Employee Surveys - Your Valuable Feedback Matt... | &lt;F486377B-82EC-47AC-A096-F0D7CDD239D4\@SecureEl... | elf_user07\@northpole.local             | Dear elf_user07,\n\nI hope this email finds yo... | 2024-09-15 08:37:45-04:00 | 172.24.25.25        | 172.24.25.20        |
| ...     | ...        | ...     | ...                       | ...          | ...             | ...                             | ...                           | ...                                               | ...                                                   | ...                                     | ...                                               | ...                       | ...                 | ...                 |
| 2341927 | 134        | 1       | 2024-09-16T12:01:09-04:00 | SecureElfGwy | SnowGlowMailPxy | wcub808\@northpole.local        | wcub303\@northpole.local      | No Subject                                        | &lt;12D146C1-B183-465D-B128-573B0B7A0BAF\@SecureEl... | wcub808\@northpole.local                | wcub808,\n\nI hope this email finds you ready ... | 2024-09-16 12:01:09-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341932 | 134        | 1       | 2024-09-16T12:01:14-04:00 | SecureElfGwy | SnowGlowMailPxy | HollyHelper\@stocking.chimney   | asnowball_05\@northpole.local | Health and Safety Updates: Ensuring a Secure W... | &lt;EC9C4C52-2381-4EDA-A7C8-193DCA7C7AE9\@SecureEl... | NorthPolePostmaster\@northpole.exchange | Dear asnowball_05,\n\nI hope this email finds ... | 2024-09-16 12:01:14-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341933 | 134        | 1       | 2024-09-16T12:01:19-04:00 | SecureElfGwy | SnowGlowMailPxy | TinselTwinkle\@stocking.chimney | elf_user06\@northpole.local   | Employee Surveys - Your Valuable Insights Matter! | &lt;F7297E75-ED87-441E-AD5E-E069531907E0\@SecureEl... | NorthPolePostmaster\@northpole.exchange | Dear elf_user06,\n\nI hope this email finds yo... | 2024-09-16 12:01:19-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341936 | 134        | 1       | 2024-09-16T12:01:24-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user02\@northpole.local     | elf_user08\@northpole.local   | Urgent: System Outage Updates                     | &lt;75324EA6-777B-4341-BABB-0A0577906233\@SecureEl... | elf_user02\@northpole.local             | Dear elf_user08,\n\nI hope this email finds yo... | 2024-09-16 12:01:24-04:00 | 172.24.25.25        | 172.24.25.20        |
| 2341939 | 134        | 1       | 2024-09-16T12:01:28-04:00 | SecureElfGwy | SnowGlowMailPxy | elf_user05\@northpole.local     | elf_user03\@northpole.local   | Performance Reviews                               | &lt;9EE973CD-029D-4F86-B3B3-D1A9DCCC74BC\@SecureEl... | elf_user05\@northpole.local             | Dear elf_user03,\n\nI hope this email finds yo... | 2024-09-16 12:01:28-04:00 | 172.24.25.25        | 172.24.25.20        |

{{< /collapsible-block >}}

The question asks us to look at the Received IPs, and we found two columns for that; `ReceivedIP1` and `ReceivedIP2`. Let's get their value counts.

```py
email_df["message.ReceivedIP1"].value_counts()
```

| message.ReceivedIP1 | count |
| ------------------- | ----- |
| 172.24.25.25        | 1398  |

```py
email_df["message.ReceivedIP2"].value_counts()
```

| message.ReceivedIP2 | count |
| ------------------- | ----- |
| 172.24.25.20        | 1397  |
| 34.30.110.62        | 1     |

The IP `34.30.110.62` shows up only once, so let's get more information about that email.

```py
email_df[email_df["message.ReceivedIP2"] == "34.30.110.62"]
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|        | syslog_pri | version | syslog_timestamp          | hostname     | event_source    | message.From                 | message.To                  | message.Subject | message.Message-ID                                    | message.Return-Path          | message.Body                                      | message.Received_Time     | message.ReceivedIP1 | message.ReceivedIP2 |
| ------ | ---------- | ------- | ------------------------- | ------------ | --------------- | ---------------------------- | --------------------------- | --------------- | ----------------------------------------------------- | ---------------------------- | ------------------------------------------------- | ------------------------- | ------------------- | ------------------- |
| 679306 | 134        | 1       | 2024-09-15T10:36:09-04:00 | SecureElfGwy | SnowGlowMailPxy | kriskring1e\@northpole.local | elf_user02\@northpole.local | URGENT!         | &lt;F3483D7F-3DBF-4A92-813D-4D9738479E50\@SecureEl... | fr0sen\@hollyhaven.snowflake | We need to store the updated naughty and nice ... | 2024-09-15 10:36:09-04:00 | 172.24.25.25        | 34.30.110.62        |

{{< /collapsible-block >}}

We can find the answer in the `message.From` column.

Answer: `kriskring1e@northpole.local`

### Question 5

**Our ElfSOC analysts need your help identifying the hostname of the domain computer that established a connection to the attacker after receiving the phishing email from the previous question. You can take a look at our GreenCoat proxy logs as an event source. Since it is a domain computer, we only need the hostname, not the fully qualified domain name (FQDN) of the system.**

Let's start again by looking at what the GreenCoat data source looks like.

```py
greencoat_df = df[df["event_source"] == "GreenCoat"].T.dropna(how="all").T
greencoat_df
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname     | event_source | message.timestamp         | message.ip   | message.user_identifier | message.method | message.url                              | message.http_protocol | message.status_code | message.response_size | message.protocol | message.additional_info   | message.host   |
| ------- | ---------- | ------- | ------------------------- | ------------ | ------------ | ------------------------- | ------------ | ----------------------- | -------------- | ---------------------------------------- | --------------------- | ------------------- | --------------------- | ---------------- | ------------------------- | -------------- |
| 84877   | 134        | 1       | 2024-09-15T05:57:55-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:57:55-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 84942   | 134        | 1       | 2024-09-15T05:57:56-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:57:56-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | kv601.prod.do.dsp.mp.microsoft.com:443   | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 86222   | 134        | 1       | 2024-09-15T05:58:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:58:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 87485   | 134        | 1       | 2024-09-15T05:58:52-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:58:52-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 87825   | 134        | 1       | 2024-09-15T05:58:58-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T05:58:58-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | disc601.prod.do.dsp.mp.microsoft.com:443 | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| ...     | ...        | ...     | ...                       | ...          | ...          | ...                       | ...          | ...                     | ...            | ...                                      | ...                   | ...                 | ...                   | ...              | ...                       | ...            |
| 1901727 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | aax.amazon-adsystem.com:443              | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901728 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | hbopenbid.pubmatic.com:443               | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901729 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | bidder.criteo.com:443                    | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901730 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.93 | elf_user03              | CONNECT        | fastlane.rubiconproject.com:443          | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | SnowSentry     |
| 1901731 | 134        | 1       | 2024-09-16T11:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-16T11:36:26-04:00 | 172.24.25.91 | elf_user01              | CONNECT        | x.bidswitch.net:443                      | HTTP/1.1              | 200.0               | 0.0                   | HTTPS            | outgoing via 172.24.25.25 | VirtualStation |

{{< /collapsible-block >}}

Okay, we have the `message.url` column here, but we don't have a url to search for. Maybe we can find it in the content of the phishing email.

```py
phishing_email = email_df[email_df["message.ReceivedIP2"] == "34.30.110.62"].iloc[0]
phishing_email["message.Body"]
```

```py
"We need to store the updated naughty and nice list somewhere secure. I posted it here http://hollyhaven.snowflake/howtosavexmas.zip. Act quickly so I can remove the link from the internet! I encrypted it with the password: n&nli$t_finAl1\n\nthx!\nkris\n- Sent from the sleigh. Please excuse any Ho Ho Ho's."
```

Alright, there is a url there, so let's search for it in the GreenCoat logs.

```py
greencoat_df[greencoat_df["message.url"] == "http://hollyhaven.snowflake/howtosavexmas.zip"]
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|        | syslog_pri | version | syslog_timestamp          | hostname     | event_source | message.timestamp         | message.ip   | message.user_identifier | message.method | message.url                                    | message.http_protocol | message.status_code | message.response_size | message.protocol | message.additional_info   | message.host |
| ------ | ---------- | ------- | ------------------------- | ------------ | ------------ | ------------------------- | ------------ | ----------------------- | -------------- | ---------------------------------------------- | --------------------- | ------------------- | --------------------- | ---------------- | ------------------------- | ------------ |
| 688367 | 134        | 1       | 2024-09-15T10:36:26-04:00 | SecureElfGwy | GreenCoat    | 2024-09-15T10:36:26-04:00 | 172.24.25.12 | elf_user02              | GET            | http\://hollyhaven.snowflake/howtosavexmas.zip | HTTP/1.1              | 200.0               | 1098.0                | HTTP             | outgoing via 172.24.25.25 | SleighRider  |

{{< /collapsible-block >}}

Yes, we found it. The hostname is all the way at the end in the `message.host` column.

Answer: `SleighRider`

### Question 6

**What was the IP address of the system you found in the previous question?**

We already found the answer for this one in the previous question. But let's also save the event to a variable; we might need it later.

```py
download_event = greencoat_df[greencoat_df["message.url"] == "http://hollyhaven.snowflake/howtosavexmas.zip"].iloc[0]
download_event["message.ip"]
```

Answer: `172.24.25.12`

### Question 7

**A process was launched when the user executed the program AFTER they downloaded it. What was that Process ID number (digits only please)?**

Let's start again by looking at the WindowsEvent logs.

```py
events_df = df[df["event_source"] == "WindowsEvent"].T.dropna(how="all").T
events_df
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname                    | event_source | message.Provider_Name        | message.Provider_Guid                  | message.EventID | message.Version | message.Level | ... | message.AdditionalInformation_RequestedUPN | message.UserInformation_UPN | message.CertificateInformation_CertificateTemplate | message.AdditionalInformation_CallerComputer | message.CertificateTemplateInformation_CertificateTemplateName | message.ModifierInformation_UserName | message.ModifierInformation_Computer | message.Details_ModificationType | message.Details_NewSecuritySettings | message.CallerComputer |
| ------- | ---------- | ------- | ------------------------- | --------------------------- | ------------ | ---------------------------- | -------------------------------------- | --------------- | --------------- | ------------- | --- | ------------------------------------------ | --------------------------- | -------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ | ------------------------------------ | -------------------------------- | ----------------------------------- | ---------------------- |
| 2       | 134        | 1       | 2024-09-15T00:10:01-04:00 | SleighRider.northpole.local | WindowsEvent | Microsoft-Windows-PowerShell | {a0c1853b-5c40-4b15-8766-3cf1c58f985a} | 40962.0         | 1.0             | 4             | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 3       | 134        | 1       | 2024-09-15T00:10:02-04:00 | SleighRider.northpole.local | WindowsEvent | Microsoft-Windows-PowerShell | {a0c1853b-5c40-4b15-8766-3cf1c58f985a} | 32784.0         | 1.0             | 2             | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 4       | 134        | 1       | 2024-09-15T00:10:03-04:00 | dc01.northpole.local        | WindowsEvent | Microsoft-Windows-PowerShell | {a0c1853b-5c40-4b15-8766-3cf1c58f985a} | 8195.0          | 1.0             | 5             | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 5       | 134        | 1       | 2024-09-15T00:10:04-04:00 | SnowSentry.northpole.local  | WindowsEvent | NaN                          | NaN                                    | 4663.0          | 1.0             | NaN           | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 6       | 134        | 1       | 2024-09-15T00:10:11-04:00 | dc01.northpole.local        | WindowsEvent | NaN                          | NaN                                    | 4663.0          | 1.0             | NaN           | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| ...     | ...        | ...     | ...                       | ...                         | ...          | ...                          | ...                                    | ...             | ...             | ...           | ... | ...                                        | ...                         | ...                                                | ...                                          | ...                                                            | ...                                  | ...                                  | ...                              | ...                                 | ...                    |
| 2343141 | 134        | 1       | 2024-09-16T11:14:12-04:00 | dc01.northpole.local        | WindowsEvent | NaN                          | NaN                                    | 4888.0          | NaN             | Information   | ... | administrator\@northpole.local             | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2343142 | 134        | 1       | 2024-09-16T11:15:12-04:00 | dc01.northpole.local        | WindowsEvent | NaN                          | NaN                                    | 4886.0          | NaN             | Information   | ... | NaN                                        | nutcrakr\@northpole.local   | ElfUsers                                           | 172.24.25.153                                | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2343143 | 134        | 1       | 2024-09-16T11:15:12-04:00 | dc01.northpole.local        | WindowsEvent | NaN                          | NaN                                    | 4864.0          | NaN             | Information   | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | ElfUsers                                                       | nutcrakr                             | 10.12.25.24                          | Permissions Update               | [Details not specified in log]      | 172.24.25.153          |
| 2343144 | 134        | 1       | 2024-09-16T11:33:12-04:00 | SleighRider.northpole.local | WindowsEvent | Microsoft-Windows-PowerShell | {a0c1853b-5c40-4b15-8766-3cf1c58f985a} | 4103.0          | 1.0             | 4             | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |
| 2343145 | 134        | 1       | 2024-09-16T11:33:12-04:00 | SleighRider.northpole.local | WindowsEvent | Microsoft-Windows-PowerShell | {a0c1853b-5c40-4b15-8766-3cf1c58f985a} | 4104.0          | 1.0             | 5             | ... | NaN                                        | NaN                         | NaN                                                | NaN                                          | NaN                                                            | NaN                                  | NaN                                  | NaN                              | NaN                                 | NaN                    |

{{< /collapsible-block >}}

It looks like the hostname column requerest the FQDN, but, luckily, SleighRider is already right there, and we don't have to look it up. We can use this together with the timestamp of when the user clicked the link to find the processes. There are way to many columns to look at, so let's also narrow those down to the ones we need.

```py
events_df[
    (events_df["hostname"] == "SleighRider.northpole.local")
    & (events_df["syslog_timestamp"] > download_event["syslog_timestamp"])
    & (events_df["message.EventID"] == 1)
][["syslog_timestamp", "message.User", "message.Image", "message.CommandLine"]]
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_timestamp          | message.User                 | message.Image                                     | message.CommandLine                                   |
| ------- | ------------------------- | ---------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| 695268  | 2024-09-15T10:36:36-04:00 | NORTHPOLE\elf_user02         | C:\Program Files\Google\Chrome\Application\chr... | "C:\Program Files\Google\Chrome\Application\ch...     |
| 703731  | 2024-09-15T10:37:02-04:00 | NORTHPOLE\elf_user02         | C:\Windows\SysWOW64\dllhost.exe                   | "C:\Windows\SysWOW64\DllHost.exe" /Processid:{...     |
| 709566  | 2024-09-15T10:37:13-04:00 | NORTHPOLE\elf_user02         | C:\Windows\SysWOW64\dllhost.exe                   | "C:\Windows\SysWOW64\DllHost.exe" /Processid:{...     |
| 712533  | 2024-09-15T10:37:20-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\consent.exe                   | consent.exe 8524 558 000001B2CD232F70                 |
| 724498  | 2024-09-15T10:37:50-04:00 | NORTHPOLE\elf_user02         | C:\Users\elf_user02\Downloads\howtosavexmas\ho... | "C:\Users\elf_user02\Downloads\howtosavexmas\h...     |
| 753902  | 2024-09-15T10:38:22-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\cmd.exe                       | cmd.exe /c echo ddpvccdbr &amp;gt; \\.\pipe\ddpvccdbr |
| 767329  | 2024-09-15T10:38:34-04:00 | NORTHPOLE\elf_user02         | C:\Windows\System32\WindowsPowerShell\v1.0\pow... | powershell.exe                                        |
| 843061  | 2024-09-15T10:42:00-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k netsvcs -s ...     |
| 843062  | 2024-09-15T10:42:00-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\servicing\TrustedInstaller.exe         | C:\Windows\servicing\TrustedInstaller.exe             |
| 843063  | 2024-09-15T10:42:00-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\WinSxS\amd64_microsoft-windows-serv... | C:\Windows\winsxs\amd64_microsoft-windows-serv...     |
| 852824  | 2024-09-15T10:42:37-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32 askhostw.exe                  | taskhostw.exe -RegisterDevice -ProtectionState...     |
| 852825  | 2024-09-15T10:42:37-04:00 | NORTHPOLE\elf_user02         | C:\Windows\System32\smartscreen.exe               | C:\Windows\System32\smartscreen.exe -Embedding        |
| 867555  | 2024-09-15T10:43:33-04:00 | NT AUTHORITY\SYSTEM          | C:\Program Files (x86)\Google\Update\GoogleUpd... | "C:\Program Files (x86)\Google\Update\GoogleUp...     |
| 878801  | 2024-09-15T10:44:09-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\WindowsPowerShell\v1.0\pow... | powershell.exe                                        |
| 879790  | 2024-09-15T10:44:15-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\ipconfig.exe                  | "C:\Windows\system32\ipconfig.exe"                    |
| 885280  | 2024-09-15T10:44:33-04:00 | NT AUTHORITY\NETWORK SERVICE | C:\Windows\System32\gpupdate.exe                  | "gpupdate.exe" /target:computer                       |
| 911284  | 2024-09-15T10:45:37-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\MoUsoCoreWorker.exe           | C:\Windows\System32\mousocoreworker.exe -Embed...     |
| 911285  | 2024-09-15T10:45:37-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\servicing\TrustedInstaller.exe         | C:\Windows\servicing\TrustedInstaller.exe             |
| 911286  | 2024-09-15T10:45:37-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\WinSxS\amd64_microsoft-windows-serv... | C:\Windows\winsxs\amd64_microsoft-windows-serv...     |
| 929661  | 2024-09-15T10:46:27-04:00 | NORTHPOLE\elf_user02         | C:\Program Files (x86)\Microsoft\Edge\Applicat... | "C:\Program Files (x86)\Microsoft\Edge\Applica...     |
| 931375  | 2024-09-15T10:46:33-04:00 | NORTHPOLE\elf_user02         | C:\Program Files (x86)\Microsoft\Edge\Applicat... | "C:\Program Files (x86)\Microsoft\Edge\Applica...     |
| 992551  | 2024-09-15T10:49:40-04:00 | NT AUTHORITY\SYSTEM          | C:\Program Files (x86)\Microsoft\EdgeUpdate\Mi... | "C:\Program Files (x86)\Microsoft\EdgeUpdate\M...     |
| 996615  | 2024-09-15T10:50:02-04:00 | NT AUTHORITY\NETWORK SERVICE | C:\Windows\System32\gpupdate.exe                  | "gpupdate.exe" /target:user                           |
| 996616  | 2024-09-15T10:50:02-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k netsvcs -p ...     |
| 1184195 | 2024-09-16T11:00:21-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k netsvcs -p ...     |
| 1261804 | 2024-09-16T11:04:24-04:00 | NORTHPOLE\elf_user02         | C:\Program Files (x86)\Microsoft\Edge\Applicat... | "C:\Program Files (x86)\Microsoft\Edge\Applica...     |
| 1474383 | 2024-09-16T11:15:21-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k netsvcs -p ...     |
| 1699385 | 2024-09-16T11:27:22-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\ZiyfDiiO.exe                           | C:\Windows\ZiyfDiiO.exe                               |
| 1699394 | 2024-09-16T11:27:22-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\SysWOW64\WindowsPowerShell\v1.0\pow... | powershell.exe                                        |
| 1703529 | 2024-09-16T11:27:36-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\SysWOW64\whoami.exe                    | "C:\Windows\system32\whoami.exe"                      |
| 1715682 | 2024-09-16T11:28:16-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\YdTRctss.exe                           | C:\Windows\YdTRctss.exe                               |
| 1715690 | 2024-09-16T11:28:16-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\SysWOW64\WindowsPowerShell\v1.0\pow... | powershell.exe                                        |
| 1755214 | 2024-09-16T11:30:21-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k netsvcs -p ...     |
| 2072533 | 2024-09-16T11:43:32-04:00 | NT AUTHORITY\SYSTEM          | C:\Program Files (x86)\Google\Update\GoogleUpd... | "C:\Program Files (x86)\Google\Update\GoogleUp...     |
| 2103286 | 2024-09-16T11:45:21-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k netsvcs -p ...     |
| 2106433 | 2024-09-16T11:45:38-04:00 | NT AUTHORITY\SYSTEM          | C:\Windows\System32\MoUsoCoreWorker.exe           | C:\Windows\System32\mousocoreworker.exe -Embed...     |
| 2179524 | 2024-09-16T11:49:40-04:00 | NT AUTHORITY\SYSTEM          | C:\Program Files (x86)\Microsoft\EdgeUpdate\Mi... | "C:\Program Files (x86)\Microsoft\EdgeUpdate\M...     |

{{< /collapsible-block >}}

Event `724498` looks interesting here because it contains "howtosavexmas", let's take a closer look.

```py
events_df.loc[724498].dropna()
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

| Property                  | Value                                             |
| ------------------------- | ------------------------------------------------- |
| syslog_pri                | 134                                               |
| version                   | 1                                                 |
| syslog_timestamp          | 2024-09-15T10:37:50-04:00                         |
| hostname                  | SleighRider.northpole.local                       |
| event_source              | WindowsEvent                                      |
| message.EventID           | 1.0                                               |
| message.Version           | 5.0                                               |
| message.Task              | 1.0                                               |
| message.Opcode            | Info                                              |
| message.Keywords          | -9223372036854775808                              |
| message.ThreadID          | 6340.0                                            |
| message.Channel           | Microsoft-Windows-Sysmon/Operational              |
| message.EventTime         | 2024-09-15 10:37:50                               |
| message.Hostname          | SleighRider.northpole.local                       |
| message.EventType         | INFO                                              |
| message.SeverityValue     | 2.0                                               |
| message.Severity          | INFO                                              |
| message.SourceName        | Microsoft-Windows-Sysmon                          |
| message.ProviderGuid      | {5770385F-C22A-43E0-BF4C-06F5698FFBD9}            |
| message.OpcodeValue       | 0.0                                               |
| message.RecordNumber      | 723.0                                             |
| message.ProcessID         | 10014.0                                           |
| message.Domain            | NT AUTHORITY                                      |
| message.AccountName       | SYSTEM                                            |
| message.UserID            | S-1-5-18                                          |
| message.AccountType       | User                                              |
| message.Category          | Process Create (rule: ProcessCreate)              |
| message.UtcTime           | 2024-09-15T10:37:50-04:00                         |
| message.ProcessGuid       | {face0b26-426e-660c-eb0f-000000000700}            |
| message.EventReceivedTime | 2024-09-15T10:37:50-04:00                         |
| message.SourceModuleName  | inSysmon                                          |
| message.SourceModuleType  | im_msvistalog                                     |
| message.RuleName          | -                                                 |
| message.Image             | C:\Users\elf_user02\Downloads\howtosavexmas\ho... |
| message.FileVersion       | -                                                 |
| message.Description       | -                                                 |
| message.Product           | -                                                 |
| message.Company           | -                                                 |
| message.OriginalFileName  | -                                                 |
| message.CommandLine       | "C:\Users\elf_user02\Downloads\howtosavexmas\h... |
| message.CurrentDirectory  | C:\Users\elf_user02\Downloads\howtosavexmas\      |
| message.User              | NORTHPOLE\elf_user02                              |
| message.LogonGuid         | {face0b26-426d-660c-650f-7d0500000000}            |
| message.LogonId           | 0x57d0f65                                         |
| message.TerminalSessionId | 1.0                                               |
| message.IntegrityLevel    | High                                              |
| message.Hashes            | MD5=790F0E0E9DBF7E9771FF9F0F7DE9804C,SHA256=79... |
| message.ParentProcessGuid | {face0b26-e149-6606-9300-000000000700}            |
| message.ParentProcessId   | 5680.0                                            |
| message.ParentImage       | C:\Windows\explorer.exe                           |
| message.ParentCommandLine | C:\Windows\Explorer.EXE                           |
| message.ParentUser        | NORTHPOLE\elf_user02                              |
| message.ProcessId         | 8096.0                                            |
| message.MoreDetails       | Process Create:                                   |

{{< /collapsible-block >}}

Here, we find two process ids, `ProcessID` and `ProcessId`, we need the first one.

Answer: `10014`

### Question 8

**Did the attacker's payload make an outbound network connection? Our ElfSOC analysts need your help identifying the destination TCP port of this connection.**

There is also and event id for network communications. I don't think you saw this coming, but it's written in [Microsoft's documentation](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-3-network-connection). We can filter on both it and the process id to find the network communications of the process.

```py
events_df[
    (events_df["hostname"] == "SleighRider.northpole.local")
    & (events_df["message.ProcessID"] == 10014)
    & (process_events_df["message.EventID"] == 3)
].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname                    | event_source | message.EventID | message.Version | message.Task | message.Opcode | message.Keywords     | ... | message.Initiated | message.SourceIsIpv6 | message.SourceIp | message.SourceHostname      | message.SourcePortName | message.DestinationIsIpv6 | message.DestinationIp | message.DestinationHostname            | message.DestinationPort | message.DestinationPortName |
| ------- | ---------- | ------- | ------------------------- | --------------------------- | ------------ | --------------- | --------------- | ------------ | -------------- | -------------------- | --- | ----------------- | -------------------- | ---------------- | --------------------------- | ---------------------- | ------------------------- | --------------------- | -------------------------------------- | ----------------------- | --------------------------- |
| 132103  | 134        | 1       | 2024-09-15T06:15:55-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 808.0                   | -                           |
| 154376  | 134        | 1       | 2024-09-15T06:24:32-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 808.0                   | -                           |
| 154604  | 134        | 1       | 2024-09-15T06:24:38-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 808.0                   | -                           |
| 154605  | 134        | 1       | 2024-09-15T06:24:38-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 808.0                   | -                           |
| 154727  | 134        | 1       | 2024-09-15T06:24:39-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 808.0                   | -                           |
| 290028  | 134        | 1       | 2024-09-15T07:16:29-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 808.0                   | -                           |
| 485923  | 134        | 1       | 2024-09-15T08:26:02-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 143.0                   | imap                        |
| 485925  | 134        | 1       | 2024-09-15T08:26:02-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 143.0                   | imap                        |
| 485928  | 134        | 1       | 2024-09-15T08:26:02-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 143.0                   | imap                        |
| 507308  | 134        | 1       | 2024-09-15T08:34:01-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 143.0                   | imap                        |
| 507309  | 134        | 1       | 2024-09-15T08:34:01-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 143.0                   | imap                        |
| 507310  | 134        | 1       | 2024-09-15T08:34:01-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.25          | SECUREELFGWY                           | 143.0                   | imap                        |
| 725184  | 134        | 1       | 2024-09-15T10:37:51-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 103.12.187.43         | 19.148.239.35.bc.googleusercontent.com | 8443.0                  | -                           |
| 1710606 | 134        | 1       | 2024-09-16T11:28:02-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1710607 | 134        | 1       | 2024-09-16T11:28:02-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1710608 | 134        | 1       | 2024-09-16T11:28:02-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1710815 | 134        | 1       | 2024-09-16T11:28:03-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1725242 | 134        | 1       | 2024-09-16T11:28:45-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1726328 | 134        | 1       | 2024-09-16T11:28:47-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1726488 | 134        | 1       | 2024-09-16T11:28:48-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1726598 | 134        | 1       | 2024-09-16T11:28:49-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1726726 | 134        | 1       | 2024-09-16T11:28:50-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1754576 | 134        | 1       | 2024-09-16T11:30:20-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |
| 1820024 | 134        | 1       | 2024-09-16T11:33:03-04:00 | SleighRider.northpole.local | WindowsEvent | 3.0             | 5.0             | 3.0          | Info           | -9223372036854775808 | ... | 1.0               | 0.0                  | 172.24.25.12     | SleighRider.northpole.local | -                      | 0.0                       | 172.24.25.153         | DC01                                   | 389.0                   | ldap                        |

{{< /collapsible-block >}}

One connection jumps out here; `19.148.239.35.bc.googleusercontent.com`. It's different from the rest, and it's port is `8443`.

Answer: `8443`

### Question 9

**The attacker escalated their privileges to the SYSTEM account by creating an inter-process communication (IPC) channel. Submit the alpha-numeric name for the IPC channel used by the attacker.**

There is an [Event ID](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-17-pipeevent-pipe-created) for IPC pipes, but if we filter on it, won't find anything. Instead, we should look at new processes that are created with the system user.

```py
events_df[
    (events_df["hostname"] == "SleighRider.northpole.local")
    & (events_df["message.ProcessID"] == 10014)
    & (events_df["message.EventID"] == 1)
    & (events_df["message.User"] == "NT AUTHORITY\\SYSTEM")
    & (events_df["message.Image"].str.contains(".*(cmd.exe)|(powershell.exe)"))
][["message.Image", "message.CommandLine"]]
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | message.Image                                     | message.CommandLine                                     |
| ------- | ------------------------------------------------- | ------------------------------------------------------- |
| 25097   | C:\Windows\System32\WindowsPowerShell\v1.0\pow... | "C:\Windows\System32\WindowsPowerShell\v1.0\po...       |
| 753902  | C:\Windows\System32\cmd.exe                       | cmd.exe /c echo ddpvccdbr &amp;gt; \\\\.\pipe\ddpvccdbr |
| 878801  | C:\Windows\System32\WindowsPowerShell\v1.0\pow... | powershell.exe                                          |
| 1699394 | C:\Windows\SysWOW64\WindowsPowerShell\v1.0\pow... | powershell.exe                                          |
| 1715690 | C:\Windows\SysWOW64\WindowsPowerShell\v1.0\pow... | powershell.exe                                          |

{{< /collapsible-block >}}

In there, we find a cmd command that connects with a pipe.

Answer: `ddpvccdbr`

### Question 10

**The attacker's process attempted to access a file. Submit the full and complete file path accessed by the attacker's process.**

There is once again an Event ID for attempts to access a file; [Windows Security Log Event ID 4663](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=4663). Let's filter on that.

```py
events_df[
    (events_df["message.ProcessID"] == 10014)
    & (events_df["message.EventID"] == 4663)
].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname                    | event_source | message.EventID | message.Version | message.Task | message.Opcode | message.Keywords     | ... | message.ProcessName                               | message.ObjectServer | message.ObjectType | message.ObjectName                                 | message.HandleID | message.Accesses                  | message.AccessMask | message.EventReceivedTime | message.SourceModuleName | message.SourceModuleType |
| ------- | ---------- | ------- | ------------------------- | --------------------------- | ------------ | --------------- | --------------- | ------------ | -------------- | -------------------- | --- | ------------------------------------------------- | -------------------- | ------------------ | -------------------------------------------------- | ---------------- | --------------------------------- | ------------------ | ------------------------- | ------------------------ | ------------------------ |
| 2341940 | 134        | 1       | 2024-09-16T10:45:48-04:00 | SleighRider.northpole.local | WindowsEvent | 4663.0          | 1.0             | 12800.0      | Info           | -9223372036854775808 | ... | C:\Users\elf_user02\Downloads\howtosavexmas\ho... | Security             | File               | C:\Users\elf_user02\Desktop\kkringl315\@10.12.2... | 0x3fc            | READ_CONTROL,SYNCHRONIZE,ReadData | 0x120089           | 2024-09-16T10:45:48-04:00 | inSecurity               | im_msvistalog            |

{{< /collapsible-block >}}

There is only one result, but its ObjectName is cut off. We can get the full result as follows.

```py
events_df[
    (events_df["message.ProcessID"] == 10014)
    & (events_df["message.EventID"] == 4663)
].iloc[0]["message.ObjectName"]
```

```py
"C:\Users\elf_user02\Desktop\kkringl315@10.12.25.24.pem"
```

Answer: `C:\Users\elf_user02\Desktop\kkringl315@10.12.25.24.pem`

### Question 11

**The attacker attempted to use a secure protocol to connect to a remote system. What is the hostname of the target server?**

If connections are made to connect to a system, there should be some authentication logs. Let's explore those.

```py
auth_df = df[df["event_source"] == "AuthLog"].T.dropna(how="all").T
auth_df
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname       | event_source | message.timestamp                | message.hostname | message.service | message.message                                   |
| ------- | ---------- | ------- | ------------------------- | -------------- | ------------ | -------------------------------- | ---------------- | --------------- | ------------------------------------------------- |
| 0       | 134        | 1       | 2024-09-15T00:10:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:10:01.304953-04:00 | kringleSSleigH   | CRON[4863]:     | pam_unix(cron:session): session opened for use... |
| 1       | 134        | 1       | 2024-09-15T00:10:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:10:01.314490-04:00 | kringleSSleigH   | CRON[4863]:     | pam_unix(cron:session): session closed for use... |
| 157     | 134        | 1       | 2024-09-15T00:17:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:17:01.331687-04:00 | kringleSSleigH   | CRON[4872]:     | pam_unix(cron:session): session opened for use... |
| 158     | 134        | 1       | 2024-09-15T00:17:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T03:17:01.341866-04:00 | kringleSSleigH   | CRON[4872]:     | pam_unix(cron:session): session closed for use... |
| 1457    | 134        | 1       | 2024-09-15T01:17:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T04:17:01.457972-04:00 | kringleSSleigH   | CRON[4923]:     | pam_unix(cron:session): session opened for use... |
| ...     | ...        | ...     | ...                       | ...            | ...          | ...                              | ...              | ...             | ...                                               |
| 2328131 | 134        | 1       | 2024-09-16T11:58:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:58:01.331792-04:00 | kringleSSleigH   | CRON[6769]:     | pam_unix(cron:session): session closed for use... |
| 2341849 | 134        | 1       | 2024-09-16T11:59:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:59:01.339409-04:00 | kringleSSleigH   | CRON[6777]:     | pam_unix(cron:session): session opened for use... |
| 2341850 | 134        | 1       | 2024-09-16T11:59:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:59:01.345015-04:00 | kringleSSleigH   | CRON[6777]:     | pam_unix(cron:session): session closed for use... |
| 2341885 | 134        | 1       | 2024-09-16T12:00:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T15:00:01.348709-04:00 | kringleSSleigH   | CRON[6780]:     | pam_unix(cron:session): session opened for use... |
| 2341886 | 134        | 1       | 2024-09-16T12:00:01-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T15:00:01.353084-04:00 | kringleSSleigH   | CRON[6780]:     | pam_unix(cron:session): session closed for use... |

{{< /collapsible-block >}}

We find that most information is stored as text in the `message.message` column. Let's look for the IP from the filename we got.

```py
auth_df[auth_df["message.message"].str.contains("10.12.25.24")]
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname       | event_source | message.timestamp                | message.hostname | message.service | message.message                                   |
| ------- | ---------- | ------- | ------------------------- | -------------- | ------------ | -------------------------------- | ---------------- | --------------- | ------------------------------------------------- |
| 234766  | 134        | 1       | 2024-09-15T06:55:21-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:21.345567-04:00 | kringleSSleigH   | sshd[6005]:     | Connection from 34.30.110.62 port 39720 on 10.... |
| 234828  | 134        | 1       | 2024-09-15T06:55:23-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:23.345567-04:00 | kringleSSleigH   | sshd[6006]:     | Connection from 34.30.110.62 port 39721 on 10.... |
| 235014  | 134        | 1       | 2024-09-15T06:55:25-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:25.345567-04:00 | kringleSSleigH   | sshd[6007]:     | Connection from 34.30.110.62 port 39722 on 10.... |
| 235130  | 134        | 1       | 2024-09-15T06:55:27-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:27.345567-04:00 | kringleSSleigH   | sshd[6008]:     | Connection from 34.30.110.62 port 39723 on 10.... |
| 235178  | 134        | 1       | 2024-09-15T06:55:29-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:29.345567-04:00 | kringleSSleigH   | sshd[6009]:     | Connection from 34.30.110.62 port 39724 on 10.... |
| 235300  | 134        | 1       | 2024-09-15T06:55:31-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:31.345567-04:00 | kringleSSleigH   | sshd[6010]:     | Connection from 34.30.110.62 port 39725 on 10.... |
| 235350  | 134        | 1       | 2024-09-15T06:55:33-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:33.345567-04:00 | kringleSSleigH   | sshd[6011]:     | Connection from 34.30.110.62 port 39726 on 10.... |
| 235394  | 134        | 1       | 2024-09-15T06:55:35-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:35.345567-04:00 | kringleSSleigH   | sshd[6012]:     | Connection from 34.30.110.62 port 39727 on 10.... |
| 235426  | 134        | 1       | 2024-09-15T06:55:37-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T09:55:37.345567-04:00 | kringleSSleigH   | sshd[6013]:     | Connection from 34.30.110.62 port 39728 on 10.... |
| 1001863 | 134        | 1       | 2024-09-15T10:50:21-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T13:50:21.450567-04:00 | kringleSSleigH   | sshd[6110]:     | Connection from 34.30.110.62 port 39732 on 10.... |
| 1020042 | 134        | 1       | 2024-09-15T10:51:33-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T13:51:33.245567-04:00 | kringleSSleigH   | sshd[6115]:     | Connection from 34.30.110.62 port 39733 on 10.... |
| 1085833 | 134        | 1       | 2024-09-15T10:55:21-04:00 | kringleSSleigH | AuthLog      | 2024-09-15T13:55:21.345567-04:00 | kringleSSleigH   | sshd[6125]:     | Connection from 34.30.110.62 port 41606 on 10.... |
| 1242765 | 134        | 1       | 2024-09-16T11:03:06-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:03:06.315201-04:00 | kringleSSleigH   | sshd[6301]:     | Connection from 34.30.110.62 port 58634 on 10.... |
| 1290133 | 134        | 1       | 2024-09-16T11:05:57-04:00 | kringleSSleigH | AuthLog      | 2024-09-16T14:05:57.781687-04:00 | kringleSSleigH   | sshd[6425]:     | Connection from 34.30.110.62 port 48202 on 10.... |

{{< /collapsible-block >}}

We find some connections here, and all of them are going to the kringleSSleigH host.

Answer: `kringleSSleigH`

### Question 12

**The attacker created an account to establish their persistence on the Linux host. What is the name of the new account created by the attacker?**

Let's take a look at all the unique log messages from kringleSSleigH.

```py
auth_df[auth_df["hostname"] == "kringleSSleigH"]["message.message"].unique()
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

```py
array(['pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)',
       'pam_unix(cron:session): session closed for user root',
       'uid 1000 is trying to obtain org.freedesktop.packagekit.system-sources-refresh auth (only_trusted:0)',
       'uid 1000 obtained auth for org.freedesktop.packagekit.system-sources-refresh',
       'Connection from 34.30.110.62 port 39720 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for netrider from 34.30.110.62 port 39720 ssh2',
       'Connection from 34.30.110.62 port 39721 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for frostyhacker from 34.30.110.62 port 39721 ssh2',
       'Connection from 34.30.110.62 port 39722 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for cryptocode from 34.30.110.62 port 39722 ssh2',
       'Connection from 34.30.110.62 port 39723 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for shadowseeker from 34.30.110.62 port 39723 ssh2',
       'Connection from 34.30.110.62 port 39724 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for dataphantom from 34.30.110.62 port 39724 ssh2',
       'Connection from 34.30.110.62 port 39725 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for firewallfox from 34.30.110.62 port 39725 ssh2',
       'Connection from 34.30.110.62 port 39726 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for glitchmaster from 34.30.110.62 port 39726 ssh2',
       'Connection from 34.30.110.62 port 39727 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for wiretrace from 34.30.110.62 port 39727 ssh2',
       'Connection from 34.30.110.62 port 39728 on 10.12.25.24 port 22 rdomain ""',
       'Failed password for codecrunch from 34.30.110.62 port 39728 ssh2',
       'Connection from 34.30.110.62 port 39732 on 10.12.25.24 port 22 rdomain ""',
       'error: Received disconnect from 34.30.110.62 port 39732:14: No supported authentication methods available [preauth]',
       'Disconnected from authenticating user kkringl315 34.30.110.62 port 39732 [preauth]',
       'Connection from 34.30.110.62 port 39733 on 10.12.25.24 port 22 rdomain ""',
       'Failed publickey for kkringl315 from 34.30.110.62 port 39733 ssh2: RSA SHA256:ZxnmQ23LgHtXj5987Km3NdjXjUHwVvBr',
       'Received disconnect from 34.30.110.62 port 39733:11: Bye Bye [preauth]',
       'Connection from 34.30.110.62 port 41606 on 10.12.25.24 port 22 rdomain ""',
       'Accepted key RSA SHA256:AbfXsQOO05qHNT98Rhe1B7KzURo0viFfq2/gpAWlP7E found at /home/kkringl315/.ssh/authorized_keys:1',
       'Postponed publickey for kkringl315 from 34.30.110.62 port 41606 ssh2 [preauth]',
       'Accepted publickey for kkringl315 from 34.30.110.62 port 41606 ssh2: RSA SHA256:AbfXsQOO05qHNT98Rhe1B7KzURo0viFfq2/gpAWlP7E',
       'pam_unix(sshd:session): session opened for user kkringl315(uid=1000) by (uid=0)',
       'New session 58 of user kkringl315.',
       'pam_env(sshd:session): deprecated reading of user environment enabled',
       'User child is on pid 6145',
       'Starting session: shell on pts/5 for kkringl315 from 34.30.110.62 port 41606 id 0',
       'pam_unix(sudo:auth): authentication failure; logname=kkringl315 uid=1000 euid=0 tty=/dev/pts/5 ruser=kkringl315 rhost=  user=kkringl315',
       ' kkringl315 : 3 incorrect password attempts ; TTY=pts/5 ; PWD=/opt ; USER=root ; COMMAND=/usr/bin/su',
       'pam_unix(sudo:auth): conversation failed',
       'pam_unix(sudo:auth): auth could not identify password for [kkringl315]',
       ' kkringl315 : TTY=pts/5 ; PWD=/opt ; USER=root ; COMMAND=/usr/bin/su',
       'pam_unix(sudo:session): session opened for user root(uid=0) by kkringl315(uid=1000)',
       '(to root) root on pts/6',
       'pam_unix(su:session): session opened for user root(uid=0) by kkringl315(uid=0)',
       'pam_unix(su:session): session closed for user root',
       'pam_unix(sudo:session): session closed for user root',
       ' kkringl315 : TTY=pts/5 ; PWD=/opt ; USER=root ; COMMAND=/usr/sbin/adduser ssdh',
       'group added to /etc/group: name=ssdh, GID=1002',
       'group added to /etc/gshadow: name=ssdh',
       'new group: name=ssdh, GID=1002',
       'new user: name=ssdh, UID=1002, GID=1002, home=/home/ssdh, shell=/bin/bash, from=/dev/pts/6',
       'pam_unix(passwd:chauthtok): password changed for ssdh',
       "gkr-pam: couldn't update the login keyring password: no old password was entered",
       "changed user 'ssdh' information",
       'members of group users set by root to kkringl315,pmacct,ssdh',
       ' kkringl315 : TTY=pts/5 ; PWD=/opt ; USER=root ; COMMAND=/usr/sbin/usermod -a -G sudo ssdh',
       "add 'ssdh' to group 'sudo'", "add 'ssdh' to shadow group 'sudo'",
       'Received disconnect from 34.30.110.62 port 41606:11: disconnected by user',
       'Disconnected from user kkringl315 34.30.110.62 port 41606',
       'pam_unix(sshd:session): session closed for user kkringl315',
       'Session 58 logged out. Waiting for processes to exit.',
       'Removed session 58.',
       'Connection from 34.30.110.62 port 58634 on 10.12.25.24 port 802 rdomain ""',
       'Postponed publickey for kkringl315 from 34.30.110.62 port 58634 ssh2 [preauth]',
       'Accepted publickey for kkringl315 from 34.30.110.62 port 58634 ssh2: RSA SHA256:AbfXsQOO05qHNT98Rhe1B7KzURo0viFfq2/gpAWlP7E',
       'New session 59 of user kkringl315.', 'User child is on pid 6319',
       'Starting session: shell on pts/5 for kkringl315 from 34.30.110.62 port 58634 id 0',
       ' kkringl315 : TTY=pts/5 ; PWD=/home/kkringl315 ; USER=root ; COMMAND=/usr/bin/crontab -',
       ' kkringl315 : TTY=pts/5 ; PWD=/home/kkringl315 ; USER=root ; COMMAND=/usr/bin/crontab -l',
       ' kkringl315 : TTY=pts/5 ; PWD=/home/kkringl315 ; USER=root ; COMMAND=/usr/sbin/service cron restart',
       ' kkringl315 : TTY=pts/5 ; PWD=/home/kkringl315 ; USER=root ; COMMAND=/usr/bin/cat /etc/crontab',
       ' kkringl315 : TTY=pts/5 ; PWD=/home/kkringl315 ; USER=root ; COMMAND=/usr/bin/cat /var/spool/cron/crontabs/root',
       'Received disconnect from 34.30.110.62 port 58634:11: disconnected by user',
       'Disconnected from user kkringl315 34.30.110.62 port 58634',
       'Session 59 logged out. Waiting for processes to exit.',
       'Removed session 59.',
       'Connection from 34.30.110.62 port 48202 on 10.12.25.24 port 802 rdomain ""',
       'Postponed publickey for kkringl315 from 34.30.110.62 port 48202 ssh2 [preauth]',
       'Accepted publickey for kkringl315 from 34.30.110.62 port 48202 ssh2: RSA SHA256:AbfXsQOO05qHNT98Rhe1B7KzURo0viFfq2/gpAWlP7E',
       'New session 62 of user kkringl315.', 'User child is on pid 6447',
       'Starting session: shell on pts/5 for kkringl315 from 34.30.110.62 port 48202 id 0',
       'error: connect_to dc01.northpole.local: unknown host (Name or service not known)',
       'error: connect_to 10.56.4.53 port 88: failed.',
       'Close session: user kkringl315 from 34.30.110.62 port 48202 id 0',
       'Received disconnect from 34.30.110.62 port 48202:11: disconnected by user',
       'Disconnected from user kkringl315 34.30.110.62 port 48202',
       'Session 62 logged out. Waiting for processes to exit.',
       'Removed session 62.'], dtype=object)
```

{{< /collapsible-block >}}

There are manu things happening, but just after the successfull login, we find a line starting with `new user`.

```py
'new user: name=ssdh, UID=1002, GID=1002, home=/home/ssdh, shell=/bin/bash, from=/dev/pts/6',
```

In it, we can clearly see the new user name.

Answer: `ssdh`

### Question 13

**The attacker wanted to maintain persistence on the Linux host they gained access to and executed multiple binaries to achieve their goal. What was the full CLI syntax of the binary the attacker executed after they created the new user account?**

For question 13 we can take another look at the last result. A few lines after the `new user` event, we find a command.

```py
' kkringl315 : TTY=pts/5 ; PWD=/opt ; USER=root ; COMMAND=/usr/sbin/usermod -a -G sudo ssdh',
```

Answer: `/usr/sbin/usermod -a -G sudo ssdh`

### Question 14

**The attacker enumerated Active Directory using a well known tool to map our Active Directory domain over LDAP. Submit the full ISO8601 compliant timestamp when the first request of the data collection attack sequence was initially recorded against the domain controller.**

Back to the Windows event logs. LDAP events are logging using [Event ID 2889](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/enable-ldap-signing-in-windows-server#event-id-2889), so let's filter on those.

```py
events_df[events_df["message.EventID"] == 2889].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname             | event_source | message.EventID | message.Level | message.Keywords | message.Computer     | message.UserID            | message.Category | message.Description                               | message.ServiceName  | message.Date              | message.LogName   | message.Source                                  | message.ClientIPaddress | message.ServicePort | message.ServiceIpAddress | message.BindType                              |
| ------- | ---------- | ------- | ------------------------- | -------------------- | ------------ | --------------- | ------------- | ---------------- | -------------------- | ------------------------- | ---------------- | ------------------------------------------------- | -------------------- | ------------------------- | ----------------- | ----------------------------------------------- | ----------------------- | ------------------- | ------------------------ | --------------------------------------------- |
| 2341941 | 134        | 1       | 2024-09-16T11:10:12-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:10:12-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:18598      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2341942 | 134        | 1       | 2024-09-16T11:10:12-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:10:12-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:25168      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2341943 | 134        | 1       | 2024-09-16T11:10:12-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:10:12-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:50183      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2341944 | 134        | 1       | 2024-09-16T11:10:12-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:10:12-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:57683      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2341945 | 134        | 1       | 2024-09-16T11:10:12-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:10:12-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:33773      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| ...     | ...        | ...     | ...                       | ...                  | ...          | ...             | ...           | ...              | ...                  | ...                       | ...              | ...                                               | ...                  | ...                       | ...               | ...                                             | ...                     | ...                 | ...                      | ...                                           |
| 2343136 | 134        | 1       | 2024-09-16T11:12:11-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:12:11-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:60776      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2343137 | 134        | 1       | 2024-09-16T11:12:11-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:12:11-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:37622      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2343138 | 134        | 1       | 2024-09-16T11:12:11-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:12:11-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:57315      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2343139 | 134        | 1       | 2024-09-16T11:12:11-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:12:11-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:17963      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |
| 2343140 | 134        | 1       | 2024-09-16T11:12:12-04:00 | dc01.northpole.local | WindowsEvent | 2889.0          | Information   | Classic          | dc01.northpole.local | elf_user\@northpole.local | LDAP Interface   | The following client performed a SASL (Negotia... | dc01.northpole.local | 2024-09-16T11:12:12-04:00 | Directory Service | Microsoft-Windows-ActiveDirectory_DomainService | 172.24.25.22:51127      | 389.0               | 172.24.25.153            | 0 - Simple Bind that does not support signing |

{{< /collapsible-block >}}

The question is asking for the first one, so we can take the `syslog_timestamp` of that one.

Answer: `2024-09-16T11:10:12-04:00`

### Question 15

**The attacker attempted to perform an ADCS ESC1 attack, but certificate services denied their certificate request. Submit the name of the software responsible for preventing this initial attack.**

Another look at [Microsoft's documentation](https://learn.microsoft.com/en-us/defender-for-identity/deploy/event-collection-overview#required-ad-cs-events) will tell us that Event ID 4886 is used for denied a certificate requests.

```py
events_df[events_df["message.EventID"] == 4888].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname             | event_source | message.EventID | message.Level | message.Keywords | message.Computer     | message.Category                                  | ... | message.User | message.Date              | message.LogName | message.Source                      | message.UserInformation_UserName | message.CertificateInformation_CertificateAuthority | message.CertificateInformation_RequestedTemplate | message.ReasonForRejection                        | message.AdditionalInformation_RequesterComputer | message.AdditionalInformation_RequestedUPN |
| ------- | ---------- | ------- | ------------------------- | -------------------- | ------------ | --------------- | ------------- | ---------------- | -------------------- | ------------------------------------------------- | --- | ------------ | ------------------------- | --------------- | ----------------------------------- | -------------------------------- | --------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| 2343141 | 134        | 1       | 2024-09-16T11:14:12-04:00 | dc01.northpole.local | WindowsEvent | 4888.0          | Information   | Audit Failure    | dc01.northpole.local | Certification Services - Certificate Request D... | ... | N/A          | 2024-09-16T11:14:12-04:00 | Security        | Microsoft-Windows-Security-Auditing | elf_user\@northpole.local        | elf-dc01-SeaA                                       | Administrator                                    | KringleGuard EDR flagged the certificate request. | 10.12.25.24                                     | administrator\@northpole.local             |

{{< /collapsible-block >}}

We can find the EDR that blocked it in the `message.ReasonForRejection` column.

Answer: `KringleGuard`

### Question 16

**We think the attacker successfully performed an ADCS ESC1 attack. Can you find the name of the user they successfully requested a certificate on behalf of?**

Another question, another event id. This one oddly doesn't show on the same page as the previous one, but can be found [here](<https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn786423(v=ws.11)>).

```py
events_df[events_df["message.EventID"] == 4886].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname             | event_source | message.EventID | message.Level | message.Keywords | message.Computer     | message.Category                              | ... | message.User | message.Date              | message.LogName | message.Source                      | message.UserInformation_UserName | message.CertificateInformation_CertificateAuthority | message.AdditionalInformation_RequesterComputer | message.UserInformation_UPN | message.CertificateInformation_CertificateTemplate | message.AdditionalInformation_CallerComputer |
| ------- | ---------- | ------- | ------------------------- | -------------------- | ------------ | --------------- | ------------- | ---------------- | -------------------- | --------------------------------------------- | --- | ------------ | ------------------------- | --------------- | ----------------------------------- | -------------------------------- | --------------------------------------------------- | ----------------------------------------------- | --------------------------- | -------------------------------------------------- | -------------------------------------------- |
| 2343142 | 134        | 1       | 2024-09-16T11:15:12-04:00 | dc01.northpole.local | WindowsEvent | 4886.0          | Information   | Audit Success    | dc01.northpole.local | Certification Services - Certificate Issuance | ... | N/A          | 2024-09-16T11:15:12-04:00 | Security        | Microsoft-Windows-Security-Auditing | elf_user\@northpole.local        | elf-dc01-SeaA                                       | 10.12.25.24                                     | nutcrakr\@northpole.local   | ElfUsers                                           | 172.24.25.153                                |

{{< /collapsible-block >}}

We can then find the username in the `message.UserInformation_UPN` column.

Answer: `nutcrakr`

### Question 17

**One of our file shares was accessed by the attacker using the elevated user account (from the ADCS attack). Submit the folder name of the share they accessed.**

There is also and Event ID in [Microsoft's documentation](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5140) for network share access logs. We can combine that with the user we just found to find the shares that were accessed.

```py
events_df[
    (events_df["message.EventID"] == 5140)
    & (events_df["message.SubjectUserName"] == "nutcrakr")
].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname             | event_source | message.EventID | message.Version | message.Task | message.Opcode | message.Keywords     | ... | message.AccessRequestInformation_AccessMask | message.IpAddress       | message.IpPort | message.ShareName | message.NetworkInformation_ObjectType | message.NetworkInformation | message.ShareInformation_ShareName | message.ShareInformation | message.ShareLocalPath       | message.ShareInformation_SharePath |
| ------- | ---------- | ------- | ------------------------- | -------------------- | ------------ | --------------- | --------------- | ------------ | -------------- | -------------------- | --- | ------------------------------------------- | ----------------------- | -------------- | ----------------- | ------------------------------------- | -------------------------- | ---------------------------------- | ------------------------ | ---------------------------- | ---------------------------------- |
| 1542505 | 134        | 1       | 2024-09-16T11:18:43-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | 34.30.110.62            | 53378          | \\\*\WishLists    | File                                  | ,                          | \\\*\WishLists                     | NaN                      | \??\C:\WishLists             | \??\C:\WishLists                   |
| 1890762 | 134        | 1       | 2024-09-16T11:35:58-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | fe80::292b:d1:2589:ffa9 | 50356          | \\\*\SYSVOL       | File                                  | ,                          | \\\*\SYSVOL                        | NaN                      | \??\C:\Windows\SYSVOL\sysvol | \??\C:\Windows\SYSVOL\sysvol       |
| 1891218 | 134        | 1       | 2024-09-16T11:35:59-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | fe80::292b:d1:2589:ffa9 | 50356          | \\\*\IPC$         | File                                  | ,                          | \\\*\IPC$                          | Share Path:,             | NaN                          | NaN                                |
| 2090002 | 134        | 1       | 2024-09-16T11:44:40-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | fe80::292b:d1:2589:ffa9 | 50404          | \\\*\ADMIN$       | File                                  | ,                          | \\\*\ADMIN$                        | NaN                      | \??\C:\Windows               | \??\C:\Windows                     |
| 2090004 | 134        | 1       | 2024-09-16T11:44:40-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | fe80::292b:d1:2589:ffa9 | 50404          | \\\*\ADMIN$       | File                                  | ,                          | \\\*\ADMIN$                        | NaN                      | \??\C:\Windows               | \??\C:\Windows                     |
| 2118082 | 134        | 1       | 2024-09-16T11:46:17-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | fe80::292b:d1:2589:ffa9 | 50404          | \\\*\ADMIN$       | File                                  | ,                          | \\\*\ADMIN$                        | NaN                      | \??\C:\Windows               | \??\C:\Windows                     |
| 2238565 | 134        | 1       | 2024-09-16T11:53:12-04:00 | dc01.northpole.local | WindowsEvent | 5140.0          | 1.0             | 12808.0      | Info           | -9214364837600034816 | ... | 0x1                                         | fe80::292b:d1:2589:ffa9 | 50404          | \\\*\SYSVOL       | File                                  | ,                          | \\\*\SYSVOL                        | NaN                      | \??\C:\Windows\SYSVOL\sysvol | \??\C:\Windows\SYSVOL\sysvol       |

{{< /collapsible-block >}}

The question is not asking for the share, but for the folder in it. This can be found in the `message.ShareInformation_SharePath` column.

Answer: `WishLists`

### Question 18

**The naughty attacker continued to use their privileged account to execute a PowerShell script to gain domain administrative privileges. What is the password for the account the attacker used in their attack payload?**

The attack payload might be referring to a PowerShell script, so let's take a look at those logs. Event IDs 4103 and 4104 are used for powershell script logging.

```py
events_df[(events_df["message.EventID"] == 4104)]["message.ScriptBlockText"].unique()
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

```py
array(['quser | Select-String -Pattern ".+"',
       'Get-LocalUser | Where-Object { $_.Enabled -eq $true } | Get-LocalGroupMember',
       'Get-Disk | Select-Object Number, Status, OperationalStatus, TotalSize, PartitionStyle',
       'Get-ChildItem "$env:USERPROFILE\\Downloads\\*" | Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-30) } | Remove-Item',
       'Get-WmiObject Win32_LogicalDisk | Format-Table DeviceID, MediaType, FreeSpace',
       "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object Name, InterfaceDescription, MacAddress",
       '[int][double]::Parse((Get-WmiObject win32_operatingsystem).LastBootUpTime.Subtract([datetime]::Parse("1970-01-01T00:00:00Z")).TotalSeconds)',
       'certutil -verify -urlfetch certificate.cer',
       'Test-Connection -ComputerName conntest.northpole.local -Count 4',
       'Get-SmbSession | Where-Object { $_.OpenFileCount -gt 0 } | Format-Table SessionId, ClientComputerName',
       '(Get-WmiObject -Query "SELECT * FROM Win32_Printer WHERE Default=$true").Name',
       '(Get-Date) - (gcim Win32_OperatingSystem).LastBootUpTime',
       'Get-Counter -Counter "\\PhysicalDisk(_Total)\\Disk Reads/sec", "\\PhysicalDisk(_Total)\\Disk Writes/sec"',
       'C:\\Windows\\System32\\perfmon /report',
       "Get-Counter '\\Processor(_Total)\\% Processor Time' | Select-Object -ExpandProperty CounterSamples | Select-Object CookedValue",
       'Get-PSDrive C | Select-Object Free,Used',
       'Get-EventLog -LogName Application | Measure-Object -Property Length -Sum | Select-Object Sum',
       '(New-Object -ComObject Microsoft.Update.AutoUpdate).DetectNow()',
       'gpupdate /force',
       "Get-Disk | Where-Object { $_.OperationalStatus -ne 'OK' } | Select-Object Number, Status, OperationalStatus",
       'Get-WmiObject Win32_NetworkProtocol | Select-Object Name, ProtocolID, GuaranteesDelivery, GuaranteesSequencing',
       'Get-WmiObject Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate | Format-List',
       'Add-Type -AssemblyName System.DirectoryServices\n$ldapConnString = "LDAP://CN=Domain Admins,CN=Users,DC=northpole,DC=local"\n$username = "nutcrakr"\n$pswd = \'fR0s3nF1@k3_s\'\n$nullGUID = [guid]\'00000000-0000-0000-0000-000000000000\'\n$propGUID = [guid]\'00000000-0000-0000-0000-000000000000\'\n$IdentityReference = (New-Object System.Security.Principal.NTAccount("northpole.local\\$username")).Translate([System.Security.Principal.SecurityIdentifier])\n$inheritanceType = [System.DirectoryServices.ActiveDirectorySecurityInheritance]::None\n$ACE = New-Object System.DirectoryServices.ActiveDirectoryAccessRule $IdentityReference, ([System.DirectoryServices.ActiveDirectoryRights] "GenericAll"), ([System.Security.AccessControl.AccessControlType] "Allow"), $propGUID, $inheritanceType, $nullGUID\n$domainDirEntry = New-Object System.DirectoryServices.DirectoryEntry $ldapConnString, $username, $pswd\n$secOptions = $domainDirEntry.get_Options()\n$secOptions.SecurityMasks = [System.DirectoryServices.SecurityMasks]::Dacl\n$domainDirEntry.RefreshCache()\n$domainDirEntry.get_ObjectSecurity().AddAccessRule($ACE)\n$domainDirEntry.CommitChanges()\n$domainDirEntry.dispose()\n$ldapConnString = "LDAP://CN=Domain Admins,CN=Users,DC=northpole,DC=local"\n$domainDirEntry = New-Object System.DirectoryServices.DirectoryEntry $ldapConnString, $username, $pswd\n$user = New-Object System.Security.Principal.NTAccount("northpole.local\\$username")\n$sid=$user.Translate([System.Security.Principal.SecurityIdentifier])\n$b=New-Object byte[] $sid.BinaryLength\n$sid.GetBinaryForm($b,0)\n$hexSID=[BitConverter]::ToString($b).Replace(\'-\',\'\')\n$domainDirEntry.Add("LDAP://<SID=$hexSID>")\n$domainDirEntry.CommitChanges()\n$domainDirEntry.dispose()'],
      dtype=object)
```

{{< /collapsible-block >}}

On the last line we can find that a username and password are set.

Answer: `fR0s3nF1@k3_s`

### Question 19

**The attacker then used remote desktop to remotely access one of our domain computers. What is the full ISO8601 compliant UTC EventTime when they established this connection?**

To stay with the same method, there are also [Event IDs for RDP logs](https://frsecure.com/blog/rdp-connection-event-logs/). We can use [Event ID 4642](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624), which is for any login, together with the LogonType to filter on RDP logins.

```py
events_df[
    (events_df["message.EventID"] == 4624)
    & (events_df["message.LogonInformation_LogonType"] == 10)
    & (events_df["message.NewLogon_AccountName"] == "nutcrakr")
].T.dropna(how="all").T
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | syslog_pri | version | syslog_timestamp          | hostname             | event_source | message.EventID | message.Version | message.Task | message.Opcode | message.Keywords     | ... | message.NewLogon_NetworkAccountName | message.NewLogon_NetworkAccountDomain | message.NewLogon_LogonGUID             | message.NetworkInformation_WorkstationName | message.NetworkInformation_SourceNetworkAddress | message.DetailedAuthenticationInformation_LogonProcess | message.DetailedAuthenticationInformation_AuthenticationPackage | message.DetailedAuthenticationInformation_TransitedServices | message.DetailedAuthenticationInformation_PackageNameNTLMonly | message.DetailedAuthenticationInformation_KeyLength |
| ------- | ---------- | ------- | ------------------------- | -------------------- | ------------ | --------------- | --------------- | ------------ | -------------- | -------------------- | --- | ----------------------------------- | ------------------------------------- | -------------------------------------- | ------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| 1889952 | 134        | 1       | 2024-09-16T11:35:57-04:00 | dc01.northpole.local | WindowsEvent | 4624.0          | 2.0             | 12544.0      | Info           | -9214364837600034816 | ... | -                                   | -                                     | {00000000-0000-0000-0000-000000000000} | DC01                                       | 10.12.25.24                                     | User32                                                 | Negotiate                                                       | -                                                           | -                                                             | 0.0                                                 |

{{< /collapsible-block >}}

We found the log here, but there is something really awful. The last question that asked for a timestamp allowed the existing format, and according to the current question, this one does as well. This is not the case however. This time, we need to convert it to a UTC timestamp.

```py
from datetime import datetime, UTC

datetime.fromtimestamp(
    datetime.fromisoformat("2024-09-16T11:35:57-04:00").timestamp(), UTC
).isoformat(timespec="milliseconds")
```

Answer: `2024-09-16T15:35:57.000+00:00`

### Question 20

**The attacker is trying to create their own naughty and nice list! What is the full file path they created using their remote desktop connection?**

From the previous result, we can grab the login ID to filter on anything that happened in that session. Let's take a look at the processes that ran.

```py
events_df[
    (events_df["message.LogonId"] == "0xdd425e")
][["message.Image", "message.CommandLine"]]
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

|         | message.Image                                     | message.CommandLine                                |
| ------- | ------------------------------------------------- | -------------------------------------------------- |
| 1891243 | C:\Windows\System32\TSTheme.exe                   | C:\Windows\system32\TSTheme.exe -Embedding         |
| 1891249 | C:\Windows\System32\rdpclip.exe                   | rdpclip                                            |
| 1891280 | C:\Windows\System32\sihost.exe                    | sihost.exe                                         |
| 1891285 | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k UnistackSvc...  |
| 1891286 | C:\Windows\System32\svchost.exe                   | C:\Windows\system32\svchost.exe -k UnistackSvc...  |
| 1891288 | C:\Windows\System32 askhostw.exe                  | taskhostw.exe \{222A245B-E637-4AE9-A93F-A59CA11... |
| 1891290 | C:\Windows\System32\taskhostw.exe                 | taskhostw.exe USER                                 |
| 1891295 | C:\Windows\System32\ServerManagerLauncher.exe     | C:\Windows\system32\ServerManagerLauncher.exe      |
| 1891304 | C:\Windows\System32\userinit.exe                  | C:\Windows\system32\userinit.exe                   |
| 1891591 | C:\Windows\explorer.exe                           | C:\Windows\Explorer.EXE                            |
| 1891963 | C:\Windows\System32\smartscreen.exe               | C:\Windows\System32\smartscreen.exe -Embedding     |
| 1892186 | C:\Windows\System32\unregmp2.exe                  | "C:\Windows\System32\unregmp2.exe" /FirstLogon     |
| 1892187 | C:\Windows\System32\ie4uinit.exe                  | "C:\Windows\System32\ie4uinit.exe" -UserConfig     |
| 1893139 | C:\Windows\System32\ie4uinit.exe                  | C:\Windows\System32\ie4uinit.exe -ClearIconCache   |
| 1893140 | C:\Windows\System32\rundll32.exe                  | rundll32.exe AppXDeploymentExtensions.OneCore....  |
| 1893141 | C:\Windows\System32\ctfmon.exe                    | "ctfmon.exe"                                       |
| 1893143 | C:\Windows\System32\rundll32.exe                  | C:\Windows\system32\RunDll32.exe C:\Windows\sy...  |
| 1893231 | C:\Windows\System32\unregmp2.exe                  | "C:\Windows\System32\unregmp2.exe" /FirstLogon     |
| 1893512 | C:\Windows\System32\rundll32.exe                  | "C:\Windows\System32\rundll32.exe" "C:\Windows...  |
| 1893516 | C:\Windows\System32\rundll32.exe                  | "C:\Windows\System32\rundll32.exe" "C:\Windows...  |
| 1893901 | C:\Windows\System32\ServerManager.exe             | "C:\Windows\system32\ServerManager.exe"            |
| 1894242 | C:\Windows\System32\SettingSyncHost.exe           | C:\Windows\system32\SettingSyncHost.exe -Embed...  |
| 1894476 | C:\Windows\System32\fsquirt.exe                   | "C:\Windows\System32\fsquirt.exe" -Register        |
| 1897675 | C:\Windows\System32\SecurityHealthSystray.exe     | "C:\Windows\System32\SecurityHealthSystray.exe"    |
| 1897676 | C:\Windows\System32\vm3dservice.exe               | "C:\Windows\System32\vm3dservice.exe" -u           |
| 1898400 | C:\Program Files\VMware\VMware Tools\vmtoolsd.exe | "C:\Program Files\VMware\VMware Tools\vmtoolsd...  |
| 1900518 | C:\Windows\System32\rundll32.exe                  | C:\Windows\System32\rundll32.exe C:\Windows\Sy...  |
| 1903852 | C:\Windows\System32\notepad.exe                   | "C:\Windows\system32\NOTEPAD.EXE" C:\WishLists...  |
| 1907971 | C:\Windows\System32\rundll32.exe                  | rundll32.exe AppXDeploymentExtensions.OneCore....  |
| 2012271 | C:\Windows\System32\ApplicationFrameHost.exe      | C:\Windows\system32\ApplicationFrameHost.exe -...  |
| 2118209 | C:\Windows\System32\TSTheme.exe                   | C:\Windows\system32\TSTheme.exe -Embedding         |
| 2118212 | C:\Windows\System32\taskhostw.exe                 | taskhostw.exe KEYROAMING                           |
| 2202255 | C:\Windows\System32\taskhostw.exe                 | taskhostw.exe Install $(Arg0)                      |

{{< /collapsible-block >}}

Event `1903852` is interesting here, as it shows that Notepad was used. Let's take a closer look.

```py
events_df.loc[1903852]["message.CommandLine"]
```

```py
'"C:\\Windows\\system32\\NOTEPAD.EXE" C:\\WishLists\\santadms_only\\its_my_fakelst.txt'
```

Answer: `C:\WishLists\santadms_only\its_my_fakelst.txt`

### Question 21

**The Wombley faction has user accounts in our environment. How many unique Wombley faction users sent an email message within the domain?**

Let's first check what email addresses exist.

```py
email_df["message.From"].value_counts()
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

| message.From                     | count |
| -------------------------------- | ----- |
| elf_user04\@northpole.local      | 45    |
| elf_user09\@northpole.local      | 45    |
| elf_user03\@northpole.local      | 44    |
| asnowball08\@northpole.local     | 43    |
| elf_user05\@northpole.local      | 40    |
| ...                              | ...   |
| StarlightStrider\@nogfest.eggnog | 1     |
| YuleYodeller\@blizzard.north     | 1     |
| frostyMittens\@tinsel.town       | 1     |
| SnowySprinter\@northstar.nibbles | 1     |
| TinselTamer\@elf.toyshop         | 1     |

{{< /collapsible-block >}}

We are quite a few, but the ones ending in "@northpole.local" are from our environment. Let's filter on those.

```py
email_df[email_df["message.From"].str.endswith("@northpole.local")]["message.From"].value_counts()
```

{{< collapsible-block title="Output" isCollapsed="true" class="tight" >}}

| message.From                  | count |
| ----------------------------- | ----- |
| elf_user09\@northpole.local   | 45    |
| elf_user04\@northpole.local   | 45    |
| elf_user03\@northpole.local   | 44    |
| asnowball08\@northpole.local  | 43    |
| elf_user05\@northpole.local   | 40    |
| asnowball09\@northpole.local  | 39    |
| elf_user10\@northpole.local   | 37    |
| elf_user08\@northpole.local   | 36    |
| asnowball_05\@northpole.local | 35    |
| wcube311\@northpole.local     | 35    |
| elf_user01\@northpole.local   | 35    |
| elf_user00\@northpole.local   | 34    |
| elf_user02\@northpole.local   | 34    |
| elf_user11\@northpole.local   | 34    |
| asnowball04\@northpole.local  | 33    |
| wcub808\@northpole.local      | 33    |
| elf_user07\@northpole.local   | 32    |
| wcub303\@northpole.local      | 32    |
| elf_user06\@northpole.local   | 30    |
| wcub101\@northpole.local      | 23    |
| kriskring1e\@northpole.local  | 1     |

{{< /collapsible-block >}}

Now that we have all local email address, we can infer that the ones starting with "wcub" are from Wombley's faction. The question asked for local messages, so we also add the domain check for the `To` field.

```py
len(
    email_df[
        (email_df["message.From"].str.endswith("@northpole.local"))
        & (email_df["message.From"].str.startswith("wcub"))
        & (email_df["message.To"].str.endswith("@northpole.local"))
    ]["message.From"].unique()
)
```

```py
4
```

Answer: `4`

### Question 22

**The Alabaster faction also has some user accounts in our environment. How many emails were sent by the Alabaster users to the Wombley faction users?**

This question is very similar to the previous one, just replace "wcub" with "asnowball", and add another `To` check.

```py
len(
    email_df[
        (email_df["message.From"].str.endswith("@northpole.local"))
        & (email_df["message.From"].str.startswith("asnowball"))
        & (email_df["message.To"].str.endswith("@northpole.local"))
        & (email_df["message.To"].str.startswith("wcub"))
    ]
)
```

```py
22
```

Answer: `22`

### Question 23

**Of all the reindeer, there are only nine. What's the full domain for the one whose nose does glow and shine? To help you narrow your search, search the events in the 'SnowGlowMailPxy' event source.**

Let's start by listing all domains which had email activity.

```py
email_df[["message.From", "message.To"]].stack().reset_index()[0].apply(lambda v: v.split("@")[1]).unique()
```

```py
array(['northpole.local', 'merry.elves', 'santa.hut', 'rud01ph.glow',
       'sleigh.ride', 'blizzard.north', 'cheery.fireplace', 'holly.jolly',
       'icicle.light', 'twilight.star', 'candycane.factory', 'snowy.land',
       'bells.ring', 'elf.toyshop', 'yule.log', 'stocking.chimney',
       'snowflake.spark', 'frosty.north', 'ginger.snap',
       'toytinkers.land', 'mistlebranch.vixen', 'wreath.maker',
       'wicked.snow', 'gingerlane.dancer', 'evergreen.tree',
       'jolly.jingle', 'starlight.tree', 'northstar.nibbles',
       'snowflakekingdom.chill', 'gingerbread.house', 'pine.tree',
       'tinsel.town', 'pr4nc3r.trot', 'twinkle.light', 'nutcracker.tale',
       'reindeer.corral', 'snowdrift.globe', 'nogfest.eggnog',
       'tinsel.wrap', 'c0m3t.halleys', 'reindeers.fly'], dtype=object)
```

There are multiple reindeer domains in there, but obviously only Rudolph's nose glows and shines.

Answer: `rud01ph.glow`

### Question 24

**With a fiery tail seen once in great years, what's the domain for the reindeer who flies without fears? To help you narrow your search, search the events in the 'SnowGlowMailPxy' event source.**

We can use the previous result for this question as well. Comet is the reindeer that fiels without fears.

Answer: `c0m3t.halleys`

## Final elf message

> Unbelievable! You dissected the attack chain using advanced analysis—impressive work! With determination like yours, we might just fix the mess and get Santa smiling again.
