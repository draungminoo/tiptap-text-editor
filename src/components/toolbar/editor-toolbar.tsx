import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  LineOutlined,
  LinkOutlined,
  MenuOutlined,
  OrderedListOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { Editor } from "@tiptap/react";
import { Button, Select, theme, Tooltip } from "antd";
import { useEffect, useState } from "react";
import TableControls from "../table/table-controls";
import ColorPicker from "./color-picker";
import HighlightPicker from "./highlight-picker";
import ImageButton from "./image-button";

export interface EditorToolbarProps {
  editor: Editor;
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  const { token } = theme.useToken();

  // Force re-render on editor updates so active states & heading Select stay in sync
  const [, setEditorStateVersion] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setEditorStateVersion((v) => v + 1);
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        padding: token.paddingXS,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: token.marginXXS,
          margin: "0 auto",
        }}
      >
        {/* Bold */}
        <Tooltip title='Bold'>
          <Button
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            type={editor.isActive("bold") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>

        {/* Italic */}
        <Tooltip title='Italic'>
          <Button
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            type={editor.isActive("italic") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>

        {/* Strikethrough */}
        <Tooltip title='Strikethrough'>
          <Button
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            type={editor.isActive("strike") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>

        {/* Underline */}
        <Tooltip title='Underline'>
          <Button
            icon={<UnderlineOutlined />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            type={editor.isActive("underline") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>

        {/* Subscript */}
        <Tooltip title='Subscript'>
          <Button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            disabled={!editor.can().chain().focus().toggleSubscript().run()}
            type={editor.isActive("subscript") ? "primary" : "default"}
            size='small'
          >
            x<sub>2</sub>
          </Button>
        </Tooltip>

        {/* Superscript */}
        <Tooltip title='Superscript'>
          <Button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            disabled={!editor.can().chain().focus().toggleSuperscript().run()}
            type={editor.isActive("superscript") ? "primary" : "default"}
            size='small'
          >
            x<sup>2</sup>
          </Button>
        </Tooltip>

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Heading / Paragraph Select */}
        <Tooltip title='Text style'>
          <Select
            size='small'
            style={{ width: 140 }}
            value={
              editor.isActive("heading", { level: 1 })
                ? "heading-1"
                : editor.isActive("heading", { level: 2 })
                ? "heading-2"
                : editor.isActive("heading", { level: 3 })
                ? "heading-3"
                : editor.isActive("heading", { level: 4 })
                ? "heading-4"
                : editor.isActive("heading", { level: 5 })
                ? "heading-5"
                : editor.isActive("heading", { level: 6 })
                ? "heading-6"
                : "paragraph"
            }
            onChange={(value) => {
              const chain = editor.chain().focus();

              if (value === "paragraph") {
                chain.setParagraph().run();
                return;
              }

              const level = Number(value.split("-")[1]) as
                | 1
                | 2
                | 3
                | 4
                | 5
                | 6;
              chain.toggleHeading({ level }).run();
            }}
            options={[
              { label: "Normal text", value: "paragraph" },
              { label: "Heading 1", value: "heading-1" },
              { label: "Heading 2", value: "heading-2" },
              { label: "Heading 3", value: "heading-3" },
              { label: "Heading 4", value: "heading-4" },
              { label: "Heading 5", value: "heading-5" },
              { label: "Heading 6", value: "heading-6" },
            ]}
          />
        </Tooltip>

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Lists */}
        <Tooltip title='Bullet List'>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            type={editor.isActive("bulletList") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>
        <Tooltip title='Ordered List'>
          <Button
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type={editor.isActive("orderedList") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Text Alignment */}
        <Tooltip title='Align Left'>
          <Button
            icon={<AlignLeftOutlined />}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            type={
              editor.isActive({ textAlign: "left" }) ? "primary" : "default"
            }
            size='small'
          />
        </Tooltip>
        <Tooltip title='Align Center'>
          <Button
            icon={<AlignCenterOutlined />}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            type={
              editor.isActive({ textAlign: "center" }) ? "primary" : "default"
            }
            size='small'
          />
        </Tooltip>
        <Tooltip title='Align Right'>
          <Button
            icon={<AlignRightOutlined />}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            type={
              editor.isActive({ textAlign: "right" }) ? "primary" : "default"
            }
            size='small'
          />
        </Tooltip>
        <Tooltip title='Justify'>
          <Button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            type={
              editor.isActive({ textAlign: "justify" }) ? "primary" : "default"
            }
            size='small'
            icon={<MenuOutlined />}
          />
        </Tooltip>

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        <ColorPicker editor={editor} />
        <HighlightPicker editor={editor} />

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        <TableControls editor={editor} />
        <ImageButton editor={editor} />

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Blockquote */}
        <Tooltip title='Blockquote'>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            type={editor.isActive("blockquote") ? "primary" : "default"}
            size='small'
          >
            “”
          </Button>
        </Tooltip>

        {/* Horizontal Rule */}
        <Tooltip title='Horizontal Line'>
          <Button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            size='small'
            icon={<LineOutlined />}
          />
        </Tooltip>

        {/* Link */}
        <Tooltip title='Insert / Edit Link'>
          <Button
            icon={<LinkOutlined />}
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href as
                | string
                | undefined;
              const url = window.prompt("Enter URL", previousUrl ?? "");

              if (url === null) {
                return;
              }

              if (url === "") {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                return;
              }

              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }}
            type={editor.isActive("link") ? "primary" : "default"}
            size='small'
          />
        </Tooltip>

        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Undo / Redo */}
        <Tooltip title='Undo'>
          <Button
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            size='small'
          />
        </Tooltip>
        <Tooltip title='Redo'>
          <Button
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            size='small'
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default EditorToolbar;
