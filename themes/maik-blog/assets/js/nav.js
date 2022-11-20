window.addEventListener("load", () => {
  const terminalCommand = document.getElementById("terminal-command")
  const terminalInput = document.getElementById("terminal-input")

  const onSubmit = () => {
    if (document.activeElement !== document.body) return
    if (terminalInput.textContent.length === 0) return

    terminalCommand.click()
  }

  const handleKey = (e) => {
    if (e.keyCode === 13) return onSubmit()

    if (e.keyCode === 8) {
      terminalInput.textContent = terminalInput.textContent.slice(0, -1)
      return
    }

    if (e.keyCode === 192) {
      if (terminalInput.textContent.length !== 0) return

      terminalInput.textContent += "~"
      return
    }

    if (e.keyCode === 189) {
      terminalInput.textContent += "-"
      return
    }

    if (e.keyCode === 191) {
      let lastChar = terminalInput.textContent.slice(-1)
      if (lastChar === "/") return

      terminalInput.textContent += "/"
      return
    }

    if (e.keyCode === 190) {
      let lastChar = terminalInput.textContent.slice(-1)
      if (terminalInput.textContent.length > 0 && lastChar !== "/" && lastChar !== ".") return

      if (terminalInput.textContent.length >= 2 && lastChar === "." && terminalInput.textContent.slice(-2)[0] === ".") return

      terminalInput.textContent += "."
      return
    }

    if (e.keyCode >= 65 && e.keyCode <= 90) {
      let lastChar = terminalInput.textContent.slice(-1)
      if (lastChar === "." || lastChar === "~") return

      terminalInput.textContent += e.key.toLowerCase()
    }
  }

  const updateCommandHref = () => {
    let href = terminalInput.textContent

    if (href.includes("~")) href = "/" + href.substring(1)

    if (href.length === 0)
      href = window.location.origin
    else if (href[0] === "/")
      href = window.location.origin + href
    else
      href = window.location.href + href

    terminalCommand.href = href
  }

  const keyDown = (e) => {
    handleKey(e)
    updateCommandHref()
  }

  // terminalCommand.addEventListener("click", onSubmit)
  document.addEventListener("keydown", keyDown)
})
