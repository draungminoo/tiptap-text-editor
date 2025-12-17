import type { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";

export interface ImageContextMenuProps {
  editor: Editor;
  position: { x: number; y: number; image: HTMLImageElement } | null;
  onClose: () => void;
}

function ImageContextMenu({
  editor,
  position,
  onClose,
}: ImageContextMenuProps) {
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
    // First, try to find the image using DOM (most reliable)
    const view = editor.view;

    // Try to find image from the DOM at selection position
    let imagePos: number | null = null;
    let imageNode: {
      type: { name: string };
      attrs: Record<string, unknown>;
    } | null = null;

    imagePos = view.posAtDOM(position?.image, 0);
    if (imagePos !== null) {
      const node = editor.state.doc.nodeAt(imagePos);
      if (node && node.type.name === "image") {
        imageNode = node;
      }
    }

    // If not found via DOM, search the document
    if (!imageNode) {
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          const nodeDom = view.nodeDOM(pos);
          if (nodeDom) {
            imageNode = node as {
              type: { name: string };
              attrs: Record<string, unknown>;
            };
            imagePos = pos;
            return false;
          }
        }
      });
    }

    if (imageNode && imagePos !== null) {
      const src = imageNode.attrs.src as string;
      const currentAttrs = imageNode.attrs;
      const currentHTMLAttrs = (currentAttrs.HTMLAttributes as Record<string, string>) || {};

      // Build style string
      let styleString = currentHTMLAttrs.style || "";

      // Handle width - update style string
      if (typeof width === "string" && width.includes("%")) {
        // Remove existing width from style
        styleString = styleString.replace(/width:\s*[^;]+;?/g, "").trim();
        styleString = (styleString ? styleString + " " : "") + `width: ${width};`;
      } else if (typeof width === "number") {
        // Remove width from style when using numeric width
        styleString = styleString.replace(/width:\s*[^;]+;?/g, "").trim();
      } else {
        // String width (e.g., "300px")
        styleString = styleString.replace(/width:\s*[^;]+;?/g, "").trim();
        styleString = (styleString ? styleString + " " : "") + `width: ${width};`;
      }

      // Handle height
      if (height) {
        if (typeof height === "string" && height.includes("%")) {
          styleString = styleString.replace(/height:\s*[^;]+;?/g, "").trim();
          styleString = (styleString ? styleString + " " : "") + `height: ${height};`;
        } else if (typeof height === "number") {
          styleString = styleString.replace(/height:\s*[^;]+;?/g, "").trim();
        } else {
          styleString = styleString.replace(/height:\s*[^;]+;?/g, "").trim();
          styleString = (styleString ? styleString + " " : "") + `height: ${height};`;
        }
      }

      // Build new attributes
      const newAttrs: {
        src: string;
        width?: number;
        height?: number;
        HTMLAttributes?: Record<string, string>;
      } = {
        src: src,
      };

      // Add width/height if numeric
      if (typeof width === "number") {
        newAttrs.width = width;
      }
      if (height && typeof height === "number") {
        newAttrs.height = height;
      }

      // Add HTMLAttributes with style
      if (styleString.trim()) {
        newAttrs.HTMLAttributes = {
          ...currentHTMLAttrs,
          style: styleString.trim(),
        };
      } else if (Object.keys(currentHTMLAttrs).length > 0) {
        // Preserve other HTMLAttributes even if no style
        newAttrs.HTMLAttributes = currentHTMLAttrs;
      }

      // Use transaction to update the image node
      const tr = editor.state.tr;
      tr.setNodeMarkup(imagePos, null, {
        ...currentAttrs,
        ...newAttrs,
      });
      editor.view.dispatch(tr);

      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className='fixed bg-white border border-gray-300 rounded shadow-lg z-50 py-1 min-w-[200px]'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className='text-xs font-semibold text-gray-700 px-3 py-1 border-b border-gray-200'>
        Image Size
      </div>
      <button
        onClick={() => resizeImage("25%")}
        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
        title='25% width'
      >
        Small (25%)
      </button>
      <button
        onClick={() => resizeImage("50%")}
        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
        title='50% width'
      >
        Medium (50%)
      </button>
      <button
        onClick={() => resizeImage("75%")}
        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
        title='75% width'
      >
        Large (75%)
      </button>
      <button
        onClick={() => resizeImage("100%")}
        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
        title='100% width'
      >
        Full Width (100%)
      </button>
      <div className='border-t border-gray-200 mt-1'></div>
      <div className='text-xs font-semibold text-gray-700 px-3 py-1 border-b border-gray-200 mt-1'>
        Custom Size
      </div>
      <button
        onClick={() => {
          const width = window.prompt("Enter width (px or %):", "300");
          if (width) {
            resizeImage(width);
          }
        }}
        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
        title='Custom width'
      >
        Set Width...
      </button>
      <button
        onClick={() => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node && node.type.name === "image") {
            const attrs: { src: string } = {
              src: node.attrs.src as string,
            };
            // Remove width, height, and style to reset
            editor.chain().focus().setImage(attrs).run();
            onClose();
          }
        }}
        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
        title='Reset to original size'
      >
        Reset Size
      </button>
    </div>
  );
}

export default ImageContextMenu;
