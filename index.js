function bindButtonListener(id, fn){
  button = document.getElementById(id);
  button.addEventListener("click", (e) => { fn(id, e);}, false);
}




console.log("init page");


bindButtonListener("editorjs", function(id, e){
  console.log("area clicked:", id);
});
