
// https://javascript.plainenglish.io/build-a-rich-text-editor-with-editor-js-b31a28583015
// ^ tutorial for EditorJS that actually explains how to do things, from a rookie perspective

const editor = new EditorJS({
  holder: 'editorjs',

  tools:{
    header:Header,
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    }
  }
 }
);
