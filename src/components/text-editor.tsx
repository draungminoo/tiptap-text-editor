import { EditorContent, useEditor } from "@tiptap/react";
import { theme } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageContextMenu from "./image/image-context";
import TableContextMenu from "./table/table-context-menu";
import EditorToolbar from "./toolbar/editor-toolbar";
import { textEditorExtensions } from "./text-editor-extensions";

function TextEditor() {
  const { token } = theme.useToken();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [imageContextMenu, setImageContextMenu] = useState<{
    image: HTMLImageElement;
    x: number;
    y: number;
  } | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: textEditorExtensions,
    content: "<p>Start typing...</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[700px] p-1",
      },
    },
  });

  useEffect(() => {
    if (!editor || !editorRef.current) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the click is on an image
      const image = target.closest("img");
      if (image) {
        event.preventDefault();
        // Select the image in the editor
        const view = editor.view;
        const pos = view.posAtDOM(image, 0);
        if (pos !== null) {
          editor.chain().setNodeSelection(pos).run();
        }
        setImageContextMenu({
          image: image,
          x: event.clientX,
          y: event.clientY,
        });
        return;
      }

      // Check if the click is on a table cell or table element
      const tableCell = target.closest("td, th");
      const table = target.closest("table");

      if (tableCell || table) {
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const handleImageClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const image = target.closest("img");

      if (image) {
        // Select the image in the editor
        const view = editor.view;
        const pos = view.posAtDOM(image, 0);
        if (pos !== null) {
          editor.chain().setNodeSelection(pos).run();
        }
      }
    };

    const editorElement = editorRef.current;
    editorElement.addEventListener("contextmenu", handleContextMenu);
    editorElement.addEventListener("click", handleImageClick);

    return () => {
      editorElement.removeEventListener("contextmenu", handleContextMenu);
      editorElement.removeEventListener("click", handleImageClick);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: token.colorBgLayout,
        }}
      >
        <div
          ref={editorRef}
          style={{
            width: 800,
            backgroundColor: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadow,
            margin: "34px auto",
            padding: 56,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <EditorContent
            editor={editor}
            style={{
              border: `1px dotted ${token.colorBorder}`,
            }}
          />
        </div>
      </div>

      {contextMenu && (
        <TableContextMenu
          editor={editor}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}

      {imageContextMenu && (
        <ImageContextMenu
          editor={editor}
          position={imageContextMenu}
          onClose={() => setImageContextMenu(null)}
        />
      )}
    </div>
  );
}

export default TextEditor;

