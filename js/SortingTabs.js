const dragArea = document.querySelector(".tabs");
new Sortable(dragArea, {
  animation: 500
});
const dragpinArea = document.querySelector(".itemContainer");
new Sortable(dragpinArea, {
  animation: 500
});