function bindButtonListener(id, fn){
  button = document.getElementById(id);
  button.addEventListener("click", (e) => { fn(id, e);}, false);
}




console.log("init page");


bindButtonListener("editorjs", function(id, e){
  console.log("area clicked:", id, e);
  
  editor_id = "editor-toolbar";
  
  toolbar_node = document.getElementById(editor_id);
  // => return 'null' if element with ID not found
  console.log(toolbar_node);
  
  if(toolbar_node == null){
    // create a new toolbar
    node = document.getElementsByTagName("body")[0];
      child = document.createElement("div");
      child.appendChild(document.createTextNode("hello world!"));
      child.id = editor_id;
    node.appendChild(child);
  }else{
    // do things with the toolbar
  }
    
  
});
