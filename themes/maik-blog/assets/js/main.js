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
        console.log(codeblock);
    }
});
