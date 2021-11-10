window.addEventListener("load", () => {
  document.querySelectorAll("figure.enlargable").forEach(node => {
    node.addEventListener("click", () => {
      console.log("Hey");
      node.classList.toggle("enlarged")
    })
  })

  const keyDown = (e) => {
    if (e.keyCode !== 27) {
      return
    }

    document.querySelectorAll("figure.enlarged").forEach(node => {
      node.classList.remove("enlarged")
    })
  }

  document.addEventListener('keydown', keyDown)
})
