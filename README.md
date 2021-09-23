# Personal Website

Link: <https://maik.dev>

## Goals

The goal of this website is mainly to post [CTF](https://ctftime.org/ctf-wtf/) writeups.

Besides that, its also made for the enjoyment of creating this website. To wit, I also set some technical goals for this website.

### Development goals

The website must comply with at least the following:

- The website is fully usable with JavaScript disabled.
  - JavaScript may only be used for graphical enhancements.
  - Where possible, JavaScript should be avoided.
- The website must have a usable Dark Theme.
  - This means all text and images are still readable, and the look and feel is the same are the regular theme (but dark ofcourse).
- The website must have a working RSS feed,
- The website must be static.
  - Self-hosted, dynamic components (like a comment system) can be used, but the main content is static. (see the first goal)
- All assets, libraries, whatever, must be hosted locally.
  - With the exception of Google Analytics. I am planning to replace this in the future.

## Installation

### Install Hugo

This website is made using the [Hugo static site generator](https://gohugo.io/).

On Arch Linux this is as easy as running the following:

```sh
pacman -S hugo
```

### Running locally

To see a preview of new posts, you can run the hugo development server.

```sh
hugo -DF server
```

The `-D` and `-F` flags are for building draft and future posts respectively.

## Publish

When a commit is pushed to the `master` branch, the new version of the website will automatically be deployed using GitHub Actions.
