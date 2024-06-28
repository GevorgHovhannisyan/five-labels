const scrollFunction = (top, height) => {
  window.scrollTo({
    top: top - height,
    behavior: "smooth"
  })
}

export { scrollFunction }
