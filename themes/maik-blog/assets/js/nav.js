window.addEventListener("load", () => {
  const terminal = document.getElementById('nav-terminal')

  const keyDown = (e) => {
    if (e.keyCode === 13) {
      if (document.activeElement !== document.body) return
      if (terminal.textContent.length === 0) return

      if (terminal.textContent.includes("~")) terminal.textContent = ""

      window.location.href = window.location.origin + "/" + terminal.textContent
      return
    }

    if (e.keyCode === 8) {
      terminal.textContent = terminal.textContent.slice(0, -1)
      return
    }

    if (e.keyCode === 192) {
      if (terminal.textContent.length !== 0) return

      terminal.textContent += "~"
      return
    }

    if (e.keyCode === 191) {
      terminal.textContent += "/"
      return
    }

    if (e.keyCode < 65 || e.keyCode > 90) return

    terminal.textContent += e.key.toLowerCase()
  }

  document.addEventListener('keydown', keyDown)
})
