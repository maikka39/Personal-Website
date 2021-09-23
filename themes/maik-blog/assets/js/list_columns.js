function resizeItem(masonry, item){
  let rowHeight = parseInt(window.getComputedStyle(masonry).getPropertyValue('grid-auto-rows'));
  let rowGap = parseInt(window.getComputedStyle(masonry).getPropertyValue('grid-row-gap'));
  let rowSpan = Math.ceil((item.querySelector('.masonry-item-content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  item.style.gridRowEnd = "span "+rowSpan;
}

function resizeAll(){
  let masonry = document.getElementsByClassName("masonry")[0];
  masonry.style.gridAutoRows = "20px"
  masonry.style.marginBottom = "80px"
  let allItems = document.getElementsByClassName("masonry-item");

  for (const item of allItems) {
    resizeItem(masonry, item)
  }
}

window.addEventListener("load", () => {
  resizeAll()

  window.addEventListener("resize", resizeAll);
})
