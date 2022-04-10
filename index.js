function bindButtonListener(id, fn){
  clickedArea = document.getElementById(id);
  clickedArea.addEventListener("click", (e) => { fn(clickedArea, e);}, false);
}

function bindFormattingListener(name, fn){
  node = document.querySelector(`#editor-toolbar > .fa-${name}`);
  node.addEventListener("click", (e) => { fn(name, e);}, false);
}

function bindUrlEditorListener(name, fn){
  node = document.querySelector(`#url-editor-toolbar .fa-${name}`);
  node.addEventListener("click", (e) => { fn(name, e);}, false);
}

function bindEditorModeListener(name, fn){
  node = document.querySelector(`#editor-mode-controls .fa-${name}`);
  node.addEventListener("click", (e) => { fn(name, e);}, false);
}



// clear selection
function clearSelection(){
  // https://stackoverflow.com/questions/6562727/is-there-a-function-to-deselect-all-text-using-javascript
  document.getSelection().collapseToEnd()
}

// get current block element. ignore inline elements like <span> or <a> used for formatting of text and get the surrounding semantic block instead. (not the structural block, which would be the <div> that holds the content)
function getCurrentBlock(node){
  // if input is a selection, then convert from a text node to a "real" HTML tag by getting the node where the selection started
  if(node instanceof Selection){
    node = node.anchorNode.parentElement;
  }
  
  // within the selection, there's a Text object, which holds the content of the "real" HTML tag. But I need to get the proper tag.
  if(node instanceof Text){
    node = node.parentElement;
  }
  
  // now the node must be a "real" HTML tag
  if(node.tagName == "SPAN" || node.tagName == "A"){
    return node.parentNode;
  }else{
    return node;
  }
}

// useful for converting classList to Array
// (the type is actually DOMTokenList, but this name is easier to remember)
function toArray(list){
  var array = Array(list.length);
  for(let i=0; i < list.length; i++){
    array[i] = list[i];
  }
  return array;
}

function eachEqual(a, b){
  // https://masteringjs.io/tutorials/fundamentals/compare-arrays
  if(a.length === b.length){
    return Array.from(a).every((val, index) => b.contains(val));
  }else{
    return false;
  }
}

// related to Node.nodeType, but different
// Returns #Text for text nodes, and the node name for HTML tags
function nodeType(node){
  if(node instanceof Text){
    return "#Text";
  }else{
    return node.nodeName;
  }
}

function nodesSimilar(n1, n2){
  let t1 = nodeType(n1);
  let t2 = nodeType(n2);
  
  if(t1 == t2){
    if(t1 == "#Text"){
      return true;
    }else{
      return eachEqual(n1.classList, n2.classList);
    }
  }
  else{
    return false;
  }
}


function mergeTagFragments(node){
  let children = node.childNodes;
  let classes = null;
  let type = null;
  
  let i=0;
  while(i < children.length){
    // find a cluster of similar nodes
    // + all text nodes are similar,
    // + all <span> tags with the same classes are similiar    
    type = nodeType(children[i]);
    classes = children[i].classList;
    
    console.log("cluster");
    let j = i+1;
    while(j < children.length){
      console.log(children[i], children[j]);
      if(nodesSimilar(children[i], children[j]))
      {
        console.log('similar');
        j++
      }else{
        break;
      }
    }
    
    
    // iterate over this cluster and merge them
    // (k is an index for elements of the cluster beyond the first)
      // TODO: figure out a way to do this with fewer DOM updates
    console.log('merge fragments', i,j);
    for(let k=i+1; k<j; k++){
      if(type == "#Text"){
        children[i].textContent += children[k].textContent;
      }else if(type == "SPAN"){
        console.log(children[k]);
        children[i].textContent += children[k].textContent;
      }
    }
    // if you remove an element from the DOM, it disappears from the list of children. Thus, you can't remove inside the loop above. You also need to start from the end and walk backwards, so that the indices of the things you want to remove don't get shuffled around.
    for(let k=j-1; k>i; k--){
      children[k].remove();
    }
    
    console.log('-----');
    
    // jump to next chunk
      // (wait, for the same reasons above, w.r.t to the indicies, shouldn't this be a problem too? why doesn't this cause problems? is it because of the outer loop invariant?)
    i = j;
  }
}

function removeEmptyChildren(node){
  let children = node.childNodes
  for(let i=children.length-1; i>=0; i--){
    // delete child if it is empty
    
    let child = children[i];
    // let type = nodeType(child);
    // if(type == "#Text"){
      
    // }else if(type == "SPAN"){
      
    // }
    if(child.innerText == ""){
      child.remove();
    }
  }
}

function splitNode(parent, range){
  // console.log("contained within span");
  let grandparent = parent.parentNode;
  
  let str = parent.innerText;
  console.log(str);
  
  var p1 = parent.cloneNode(); // don't copy inner text
  let p2 = parent.cloneNode(); // don't copy inner text
  let p3 = parent;
  
  grandparent.insertBefore(p2, p3);
  grandparent.insertBefore(p1, p2);
  
  // inclusive on bottom end, exclusive on top end
    // startOffset
    // endOffset
  
  p1.textContent = str.substring(0, range.startOffset);
  p2.textContent = str.substring(range.startOffset, range.endOffset);
  p3.textContent = str.substring(range.endOffset);
  
  // p1.textContent = p3.textContent;
  return {grandparent, p1, p2, p3};
}



console.log("init page");


bindButtonListener("editorjs", function(clickedArea, e){
  console.log("area clicked:", clickedArea, e);
  
  // 
  // enable editing
  // 
  
  clickedArea.setAttribute("contenteditable", true);
  activeArea = clickedArea; // global variable
  
  manageFormattingToolbar(clickedArea, e);
  
  manageUrlToolbar(clickedArea, e);
  
  manageEditorMode(clickedArea, e);
});














// manage formatting toolbar
function manageFormattingToolbar(clickedArea, e){  
  // make toolbar visible
  let toolbar_node = document.getElementById("editor-toolbar");
  toolbar_node.classList.remove('invisible')
    
  // do things with the toolbar
  let toolbar_width = 
        window
        .getComputedStyle(toolbar_node)
        .getPropertyValue('width')
        .match(/\d+/);
  
  let body = document.getElementsByTagName("body")[0];
  
  let rem = window
        .getComputedStyle(body)
        .getPropertyValue('font-size')
        .match(/\d+/);
  
  let currentBlock = getCurrentBlock(e.target);
  
  // move the toolbar
  toolbar_node.setAttribute(
    "style", 
    `left: ${currentBlock.offsetLeft + currentBlock.offsetWidth/2 - toolbar_width/2}px; top: calc(${currentBlock.offsetTop}px - ${2.0*rem}px)`
  );
}


// TODO: currently applying styles with css only. may want to look into ways to make this more accessible / add more semantic tags.


// TODO: prevent creation of zero-width spans (spans with no characters inside them)

function applyFormatting(name){
  activeArea; // global variable
  
  // console.log(name);
  
  // process the text
  // (click event returns text node)
  
  selection = window.getSelection()
  // console.log(activeArea);
  // console.log(selection);
  
  // for now, can't deal with selections that cross boundaries of different tags (like from h2 into p)
  
  var startNode = getCurrentBlock(selection.anchorNode);
  var endNode = getCurrentBlock(selection.focusNode);
  
  if(startNode == endNode){
    let block = startNode;
    
    // https://stackoverflow.com/questions/6328718/how-to-wrap-surround-highlighted-text-with-an-element
    
    
    // add formmating
    for(let i=0; i<selection.rangeCount; i++){
      let range = selection.getRangeAt(i);
      
      if(range.startContainer == range.endContainer){
        // selection is completely contained with some existing element
        let container = range.startContainer;
        let parent = container.parentNode;
        
        if(nodeType(container) == "#Text"){
          if(nodeType(parent) == "SPAN"){
            // there's already a styled span - need to split this
            split = splitNode(parent, range);
            
            // add formatting class to p2
            split.p2.classList.add(name);
          }else{
            // you're in completely unformatted territory
            let doc_fragment = range.extractContents();
            
            // console.log(doc_fragment);
            
            let node = doc_fragment.childNodes[0];
            
            // wrap text in <span>
            let span = document.createElement("span");
            span.classList.add(name)
            span.textContent = node.textContent;
            
            doc_fragment.replaceChild(span, node);
            
            range.insertNode(doc_fragment);
            
            // TODO: ^ is there a simpler way to do this without using a document fragment? I just used that technique because it's what I already had in the section below, but there may be cleaner way to implement this
          }
        }
        
      }else{
        // boundary between multiple elements
        
        let doc_fragment = range.extractContents();
        
        // console.log(doc_fragment);
        
        for(node of doc_fragment.childNodes){
          if(node instanceof Text){
            // this is raw text
            
            // wrap text in <span>
            let span = document.createElement("span");
            span.classList.add(name)
            span.textContent = node.textContent;
            
            doc_fragment.replaceChild(span, node);
            
          }else if(node.tagName == 'SPAN'){
            // if <span> exists, just add a new formatting class
            let span = node;
            span.classList.add(name);
          }
        }
        
        range.insertNode(doc_fragment);
      }
      
    }
    
    
    // clean up - merge tag fragments
    mergeTagFragments(block);
    
    
    
    
    // selection.anchorOffset
  }
  
  // clearSelection();
}

bindFormattingListener("bold", function(name, e){
  applyFormatting(name);
});

bindFormattingListener("italic", function(name, e){
  applyFormatting(name);
});

bindFormattingListener("underline", function(name, e){
  applyFormatting(name);
});

bindFormattingListener("highlighter", function(name, e){
  applyFormatting(name);
});

// TODO: implement adding links to existing text
// TODO: implement removing links
// TODO: implement editing existing links
bindFormattingListener("link", function(name, e){
  console.log(name);
});


bindFormattingListener("window-close", function(name, e){
  console.log(name);
  
  let classes = document.querySelector("#editor-toolbar").classList;
  classes.add("invisible");
});







function stripFormatting(node){
  if(node instanceof Text){
    // base case
    return node.textContent;
  }else{
    // recursive case?
    return node.innerText;
  }
}

bindFormattingListener("remove-format", function(name, e){
  console.log(name);
  
  // Find any span tags within the selected region that include the classes bold, italic, underline, or highligher, and remove them. Don't just remove the classes - actually remove the entire tags.
  
  
  // process the text
  // (click event returns text node)
  
  selection = window.getSelection()
  console.log(activeArea);
  console.log(selection);
  
  // for now, can't deal with selections that cross boundaries of different tags (like from h2 into p)
  
  var startNode = getCurrentBlock(selection.anchorNode);
  var endNode = getCurrentBlock(selection.focusNode);
  
  if(startNode == endNode){
    let node = startNode;
    
    console.log('node: ', node);
    
    
    let range = selection.getRangeAt(0);
    
    
    // 
    // clear formatting
    // 
    
    // https://stackoverflow.com/questions/15001625/clear-format-in-range
    
    console.log(range);
    
    if(range.startContainer == range.endContainer){
      // selection is completely contained with some existing element
      let container = range.startContainer;
      
      if(nodeType(container.parentNode) == "SPAN"){
        let parent = container.parentNode;
        split = splitNode(parent, range);
        
        // replace the p2 with just a Text node to remove formatting
        let text = document.createTextNode(split.p2.textContent);
        split.grandparent.replaceChild(text, split.p2);
      }
      
    }else{
      // selection is on the boundary between tags
      // so creating a doc fragment will create the pieces we need
      let doc_fragment = range.extractContents();
      
      console.log(doc_fragment);
      
      let text = document.createTextNode(doc_fragment.textContent);
      range.deleteContents();
      range.insertNode(text);
      range.selectNodeContents(text);
    }
    
    
    
    mergeTagFragments(node);
    removeEmptyChildren(node);
    
    
    // 
    // remove <span> tags that are empty (contain 0 characters)
    // 
    
    // node.childNodes.forEach(function(child, i){
    //   if(child.nodeName == "SPAN"){
    //     if(child.innerHTML == ""){
    //       child.remove();
    //     }
    //   }
    // });
  }
  
  
  
  // clearSelection();
});












// manage url toolbar
function manageUrlToolbar(clickedArea, e){
  console.log("area event:", e);
  let toolbar_node = document.getElementById("url-editor-toolbar");
  
  toolbar_node.classList.remove('invisible')
  
  let toolbar_width = 
        window
        .getComputedStyle(toolbar_node)
        .getPropertyValue('width')
        .match(/\d+/);
  
  let body = document.getElementsByTagName("body")[0];
  
  let rem = window
        .getComputedStyle(body)
        .getPropertyValue('font-size')
        .match(/\d+/);
  
  // move the toolbar
  toolbar_node.setAttribute(
    "style", 
    `left: ${e.layerX - toolbar_width/2}px; top: calc(${e.layerY}px + ${1.0*rem}px)`
  );
}

// click events don't allow you to use links as links. perhaps because contenteditable == true? perhaps because of the JS events that are bound?

bindUrlEditorListener("arrow-left", function(name, e){
  console.log(name);
});

bindUrlEditorListener("window-close", function(name, e){
  console.log(name);
  
  let classes = document.querySelector("#url-editor-toolbar").classList;
  classes.add("invisible");
});
















// manage editor mode controls
function manageEditorMode(clickedArea, e){
  // let currentBlock = getCurrentBlock(e.target);
  
  console.log("area event:", e);
  let toolbar_node = document.getElementById("editor-mode-controls");
  
  toolbar_node.classList.remove('invisible');
  
  let toolbar_width = 
        window
        .getComputedStyle(toolbar_node)
        .getPropertyValue('width')
        .match(/\d+/);
  
  let body = document.getElementsByTagName("body")[0];
  
  let rem = window
        .getComputedStyle(body)
        .getPropertyValue('font-size')
        .match(/\d+/);
  
  // move the toolbar
  toolbar_node.setAttribute(
    "style", 
    `left: ${clickedArea.offsetLeft + clickedArea.offsetWidth - toolbar_width}px; top: calc(${clickedArea.offsetTop}px - ${2.0*rem}px)`
  );
}

// click events don't allow you to use links as links. perhaps because contenteditable == true? perhaps because of the JS events that are bound?

bindEditorModeListener("check", function(name, e){
  // console.log(name);
  console.log("save edits");
});

bindEditorModeListener("xmark", function(name, e){
  // console.log(name);
  console.log("cancel edits");
  
  // let classes = document.querySelector("#url-editor-toolbar").classList;
  // classes.add("invisible");
});
