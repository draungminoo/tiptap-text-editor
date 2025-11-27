import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import type { Editor } from "@tiptap/react";
import { useState, useEffect, useRef } from "react";

interface MenuBarProps {
  editor: Editor;
}

interface ColorPickerProps {
  editor: Editor;
}

function ColorPicker({ editor }: ColorPickerProps) {
  const [showColors, setShowColors] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Purple", value: "#a855f7" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
  ];

  const currentColor = editor.getAttributes("textStyle").color || "#000000";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowColors(false);
      }
    };

    if (showColors) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColors]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowColors(!showColors)}
        className={`px-2 py-1 text-sm border ${
          editor.isActive("textStyle", { color: currentColor }) ? "bg-gray-300" : ""
        }`}
        title="Text Color"
      >
        <span style={{ color: currentColor }}>A</span>
      </button>
      {showColors && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-20 grid grid-cols-4 gap-1 min-w-[140px]">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                editor.chain().focus().setColor(color.value).run();
                setShowColors(false);
              }}
              className="w-8 h-8 rounded border-2 border-gray-400 hover:scale-110 hover:border-gray-600 transition-all cursor-pointer"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
          <button
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setShowColors(false);
            }}
            className="w-8 h-8 rounded border-2 border-gray-400 hover:bg-gray-100 text-xs font-bold flex items-center justify-center"
            title="Remove color"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

interface HighlightPickerProps {
  editor: Editor;
}

function HighlightPicker({ editor }: HighlightPickerProps) {
  const [showColors, setShowColors] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const colors = [
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#fce7f3" },
    { name: "Orange", value: "#fed7aa" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Red", value: "#fecaca" },
    { name: "Gray", value: "#e5e7eb" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowColors(false);
      }
    };

    if (showColors) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColors]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowColors(!showColors)}
        className={`px-2 py-1 text-sm border ${
          editor.isActive("highlight") ? "bg-gray-300" : ""
        }`}
        title="Highlight Color"
      >
        <span className="bg-yellow-200">H</span>
      </button>
      {showColors && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-20 grid grid-cols-4 gap-1 min-w-[140px]">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                editor.chain().focus().toggleHighlight({ color: color.value }).run();
                setShowColors(false);
              }}
              className="w-8 h-8 rounded border-2 border-gray-400 hover:scale-110 hover:border-gray-600 transition-all cursor-pointer"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
          <button
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              setShowColors(false);
            }}
            className="w-8 h-8 rounded border-2 border-gray-400 hover:bg-gray-100 text-xs font-bold flex items-center justify-center"
            title="Remove highlight"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function MenuBar({ editor }: MenuBarProps) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-2 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          } disabled:opacity-50`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          } disabled:opacity-50`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("strike") ? "bg-gray-300" : ""
          } disabled:opacity-50`}
        >
          <s>S</s>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
          }`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
        >
          List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
        >
          1. 2. 3.
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ColorPicker editor={editor} />
        <HighlightPicker editor={editor} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <TableControls editor={editor} />
        <ImageButton editor={editor} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive("blockquote") ? "bg-gray-300" : ""
          }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 text-sm"
        >
          HR
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-2 py-1 text-sm disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-2 py-1 text-sm disabled:opacity-50"
        >
          Redo
        </button>
      </div>
    );
}

interface TableControlsProps {
  editor: Editor;
}

function TableControls({ editor }: TableControlsProps) {
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowTableMenu(false);
      }
    };

    if (showTableMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTableMenu]);

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  };

  const isCellSelected = (cellRow: number, cellCol: number) => {
    if (!hoveredCell) return false;
    return cellRow <= hoveredCell.row && cellCol <= hoveredCell.col;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowTableMenu(!showTableMenu)}
        className={`px-2 py-1 text-sm border ${
          editor.isActive("table") ? "bg-gray-300" : ""
        }`}
        title="Table"
      >
        Table
      </button>
      {showTableMenu && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 p-3 rounded shadow-lg z-20 min-w-[180px]">
          <div className="text-xs mb-2 font-semibold text-gray-700">Insert Table</div>
          <div className="grid grid-cols-5 gap-1 mb-2 w-fit">
            {Array.from({ length: 25 }).map((_, index) => {
              const row = Math.floor(index / 5) + 1;
              const col = (index % 5) + 1;
              const isSelected = isCellSelected(row, col);
              return (
                <button
                  key={index}
                  onClick={() => insertTable(row, col)}
                  onMouseEnter={() => setHoveredCell({ row, col })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-7 h-7 min-w-[28px] min-h-[28px] border-2 transition-all cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? "border-blue-500 bg-blue-200"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  title={`${row}x${col}`}
                />
              );
            })}
          </div>
          <div className="text-xs text-gray-500 text-center">
            {hoveredCell ? `${hoveredCell.row}x${hoveredCell.col} table` : "Select size"}
          </div>
          {editor.isActive("table") && (
            <>
              <div className="border-t my-2 pt-2 mt-2">
                <div className="text-xs mb-2 font-semibold text-gray-700">Row Actions</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <button
                    onClick={() => {
                      editor.chain().focus().addRowBefore().run();
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-100"
                    title="Add Row Before"
                  >
                    + Row Before
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-100"
                    title="Add Row After"
                  >
                    + Row After
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 hover:bg-red-50 hover:border-red-300"
                    title="Delete Row"
                  >
                    - Delete Row
                  </button>
                </div>
                <div className="text-xs mb-2 font-semibold text-gray-700">Column Actions</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <button
                    onClick={() => {
                      editor.chain().focus().addColumnBefore().run();
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-100"
                    title="Add Column Before"
                  >
                    + Col Before
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-100"
                    title="Add Column After"
                  >
                    + Col After
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 hover:bg-red-50 hover:border-red-300"
                    title="Delete Column"
                  >
                    - Delete Col
                  </button>
                </div>
                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                    className="px-2 py-1 text-xs border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 w-full"
                    title="Delete Table"
                  >
                    Delete Table
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface ImageButtonProps {
  editor: Editor;
}

function ImageButton({ editor }: ImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageFromUrl = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => {
          const choice = window.confirm(
            "Click OK to upload from file, Cancel to enter URL"
          );
          if (choice) {
            fileInputRef.current?.click();
          } else {
            insertImageFromUrl();
          }
        }}
        className="px-2 py-1 text-sm border"
        title="Insert Image"
      >
        Image
      </button>
    </div>
  );
}

interface TableContextMenuProps {
  editor: Editor;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

function TableContextMenu({ editor, position, onClose }: TableContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, onClose]);

  if (!position) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 py-1 min-w-[180px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-xs font-semibold text-gray-700 px-3 py-1 border-b border-gray-200">
        Column Actions
      </div>
      <button
        onClick={() => {
          editor.chain().focus().addColumnBefore().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="Add Column Before"
      >
        + Add Column Before
      </button>
      <button
        onClick={() => {
          editor.chain().focus().addColumnAfter().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="Add Column After"
      >
        + Add Column After
      </button>
      <button
        onClick={() => {
          editor.chain().focus().deleteColumn().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-700"
        title="Delete Column"
      >
        - Delete Column
      </button>
      <div className="text-xs font-semibold text-gray-700 px-3 py-1 border-t border-b border-gray-200 mt-1">
        Row Actions
      </div>
      <button
        onClick={() => {
          editor.chain().focus().addRowBefore().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="Add Row Before"
      >
        + Add Row Before
      </button>
      <button
        onClick={() => {
          editor.chain().focus().addRowAfter().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="Add Row After"
      >
        + Add Row After
      </button>
      <button
        onClick={() => {
          editor.chain().focus().deleteRow().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-700"
        title="Delete Row"
      >
        - Delete Row
      </button>
      <div className="border-t border-gray-200 mt-1"></div>
      <button
        onClick={() => {
          editor.chain().focus().deleteTable().run();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-700 font-semibold"
        title="Delete Table"
      >
        Delete Table
      </button>
    </div>
  );
}

interface ImageContextMenuProps {
  editor: Editor;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

function ImageContextMenu({ editor, position, onClose }: ImageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, onClose]);

  if (!position) {
    return null;
  }

  const resizeImage = (width: number | string, height?: number | string) => {
    const { selection } = editor.state;
    const { $from } = selection;
    
    // Find the image node - it might be the current node or a parent
    let imageNode = $from.node();
    let imagePos = $from.pos;
    
    // If current node is not an image, check parent
    if (imageNode.type.name !== 'image') {
      const parent = $from.parent;
      if (parent && parent.type.name === 'image') {
        imageNode = parent;
        imagePos = $from.before($from.depth);
      } else {
        // Try to find image in the document
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && pos <= $from.pos && pos + node.nodeSize >= $from.pos) {
            imageNode = node;
            imagePos = pos;
            return false; // Stop searching
          }
        });
      }
    }
    
    if (imageNode && imageNode.type.name === 'image') {
      const src = imageNode.attrs.src as string;
      const attrs: { src: string; width?: number; height?: number; style?: string } = {
        src: src,
      };
      
      // Handle width - convert percentage strings to numbers or use style
      if (typeof width === 'string' && width.includes('%')) {
        attrs.style = `width: ${width};`;
      } else if (typeof width === 'number') {
        attrs.width = width;
      } else {
        attrs.style = `width: ${width};`;
      }
      
      // Handle height
      if (height) {
        if (typeof height === 'string' && height.includes('%')) {
          attrs.style = (attrs.style || '') + ` height: ${height};`;
        } else if (typeof height === 'number') {
          attrs.height = height;
        } else {
          attrs.style = (attrs.style || '') + ` height: ${height};`;
        }
      }
      
      // Use transaction to update the image
      const tr = editor.state.tr;
      tr.setNodeMarkup(imagePos, null, attrs);
      editor.view.dispatch(tr);
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 py-1 min-w-[200px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-xs font-semibold text-gray-700 px-3 py-1 border-b border-gray-200">
        Image Size
      </div>
      <button
        onClick={() => resizeImage('25%')}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="25% width"
      >
        Small (25%)
      </button>
      <button
        onClick={() => resizeImage('50%')}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="50% width"
      >
        Medium (50%)
      </button>
      <button
        onClick={() => resizeImage('75%')}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="75% width"
      >
        Large (75%)
      </button>
      <button
        onClick={() => resizeImage('100%')}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="100% width"
      >
        Full Width (100%)
      </button>
      <div className="border-t border-gray-200 mt-1"></div>
      <div className="text-xs font-semibold text-gray-700 px-3 py-1 border-b border-gray-200 mt-1">
        Custom Size
      </div>
      <button
        onClick={() => {
          const width = window.prompt("Enter width (px or %):", "300");
          if (width) {
            resizeImage(width);
          }
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="Custom width"
      >
        Set Width...
      </button>
      <button
        onClick={() => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node && node.type.name === 'image') {
            const attrs: { src: string } = {
              src: node.attrs.src as string,
            };
            // Remove width, height, and style to reset
            editor.chain().focus().setImage(attrs).run();
            onClose();
          }
        }}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
        title="Reset to original size"
      >
        Reset Size
      </button>
    </div>
  );
}

function TextEditorComponent() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [imageContextMenu, setImageContextMenu] = useState<{ x: number; y: number } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
    ],
    content: "<p>Start typing...</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px] p-4",
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
      const image = target.closest('img');
      if (image) {
        event.preventDefault();
        // Select the image in the editor
        const view = editor.view;
        const pos = view.posAtDOM(image, 0);
        if (pos !== null) {
          editor.chain().setTextSelection(pos).run();
        }
        setImageContextMenu({
          x: event.clientX,
          y: event.clientY,
        });
        return;
      }
      
      // Check if the click is on a table cell or table element
      const tableCell = target.closest('td, th');
      const table = target.closest('table');
      
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
      const image = target.closest('img');
      
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
    editorElement.addEventListener('contextmenu', handleContextMenu);
    editorElement.addEventListener('click', handleImageClick);

    return () => {
      editorElement.removeEventListener('contextmenu', handleContextMenu);
      editorElement.removeEventListener('click', handleImageClick);
    };
  }, [editor]);


  if (!editor) {
    return null;
  }

  return (
    <div>
      <MenuBar editor={editor} />
      <div 
        ref={editorRef}
        className="mt-12 border border-gray-300"
      >
        <EditorContent editor={editor} />
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

export default TextEditorComponent;
