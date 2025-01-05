const throttle = (func, timeFrame) => {
    let lastTime = 0;
    return () => {
        let now = new Date();
        if (now - lastTime >= timeFrame) {
            func();
            lastTime = now;
        }
    };
};

window.addEventListener("load", () => {
    // Enlarged floating figures
    for (let figure of document.getElementsByTagName("figure")) {
        if (
            figure.classList.contains("post-cover") ||
            figure.classList.contains("portfolio-cover")
        )
            continue;

        figure.addEventListener("click", () => {
            figure.classList.toggle("floated-focus");
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.keyCode !== 27) return;

        for (let figure of document.getElementsByClassName("floated-focus")) {
            figure.classList.remove("floated-focus");
        }
    });

    // Add anchors to article headings
    for (let article of document.getElementsByTagName("article")) {
        for (let heading of article.querySelectorAll(
            "h1, h2, h3, h4, h5, h6"
        )) {
            if (!heading.id) continue;

            let anchor = document.createElement("a");
            anchor.innerHTML = heading.innerHTML;
            anchor.href = "#" + heading.id;
            heading.innerHTML = "";
            heading.appendChild(anchor);
            heading.classList.add("article-heading");

            anchor.addEventListener("click", (e) => {
                e.preventDefault();

                window.history.replaceState({}, "", anchor.href);
                navigator.clipboard.writeText(anchor.href);

                document
                    .querySelectorAll(".current-heading")
                    .forEach((elem) =>
                        elem.classList.remove("current-heading")
                    );

                anchor.classList.add("current-heading");
            });
        }
    }

    // set active toc heading
    const toc = document.getElementById("toc");
    const tocNav = toc.getElementsByTagName("nav")[0];
    const headingsForToc = [
        ...document.getElementsByTagName("article"),
    ].flatMap((article) =>
        [...article.querySelectorAll("h1, h2, h3, h4")]
            .filter((heading) => heading.offsetParent.tagName === "MAIN")
            .reverse()
    );
    const onTocScroll = () => {
        for (const heading of headingsForToc) {
            if (window.scrollY + window.innerHeight / 3 > heading.offsetTop) {
                const headingAnchor = heading.getElementsByTagName("a")[0];

                for (const tocAnchor of toc.getElementsByTagName("a")) {
                    tocAnchor.classList.remove("current-toc");

                    if (tocAnchor.href !== headingAnchor.href) continue;

                    tocAnchor.classList.add("current-toc");

                    // Scroll toc element into view
                    const tocNavRect = tocNav.getBoundingClientRect();
                    const tocAnchorRect = tocAnchor.getBoundingClientRect();

                    const offset =
                        tocAnchorRect.top -
                        tocNavRect.top -
                        tocNav.clientHeight / 2;

                    const direction = offset / Math.abs(offset);
                    const limit = (tocNav.clientHeight / 2) * 0.5;

                    if (Math.abs(offset) > limit)
                        tocNav.scrollTop += offset - direction * limit;
                }
                return;
            }
        }
    };
    window.addEventListener("scroll", throttle(onTocScroll, 50));
    onTocScroll();

    // Code copy button
    for (let codeblock of document.querySelectorAll(".highlight pre")) {
        if (codeblock.querySelector(".lnt")) continue; // skip line numbers

        let button = document.createElement("button");
        button.classList.add("codeblock-copy");
        codeblock.appendChild(button);

        button.addEventListener("click", (e) => {
            e.preventDefault();

            navigator.clipboard.writeText(codeblock.innerText);

            document
                .querySelectorAll(".current-code")
                .forEach((elem) => elem.classList.remove("current-code"));

            button.classList.add("current-code");
        });
    }
});
