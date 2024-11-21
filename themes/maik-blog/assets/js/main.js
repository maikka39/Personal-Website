window.addEventListener("load", () => {
    for (let figure of document.getElementsByTagName("figure")) {
        if (figure.classList.contains("post-cover"))
            continue

        figure.addEventListener("click", () => {
            figure.classList.toggle("floated-focus")
        })
    }

    document.addEventListener('keydown', (e) => {
        if (e.keyCode !== 27)
            return

        for (let figure of document.getElementsByClassName("floated-focus")) {
            figure.classList.remove("floated-focus")
        }

    })
})
