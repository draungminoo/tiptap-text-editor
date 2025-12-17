import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { theme } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageContextMenu from "./image/image-context";
import TableContextMenu from "./table/table-context-menu";
import EditorToolbar from "./toolbar/editor-toolbar";

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
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        // inline: true,
        allowBase64: true,
        resize: {
          enabled: true,
          directions: [
            "bottom-left",
            "bottom-right",
            "bottom",
            "left",
            "right",
            "top-left",
            "top-right",
            "top",
          ],
          minWidth: 100,
          minHeight: 100,
          alwaysPreserveAspectRatio: false,
        },
        // HTMLAttributes: {
        //   class: "resizable-image",
        // },
      }),
    ],
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
          editor.chain().setTextSelection(pos).run();
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
          editor.chain().setTextSelection(pos).run();
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

