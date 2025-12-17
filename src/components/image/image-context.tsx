import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  ColumnWidthOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { Editor } from "@tiptap/react";
import { Button, Divider, Space, theme } from "antd";
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
  const { token } = theme.useToken();
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

  const alignImage = (align: "left" | "center" | "right") => {
    const { from } = editor.state.selection;
    const node = editor.state.doc.nodeAt(from);

    if (!node || node.type.name !== "image") {
      return;
    }

    const currentAttrs = node.attrs as {
      src: string;
      width?: number | string;
      height?: number | string;
      style?: string;
    };

    let style = currentAttrs.style || "";

    // Remove previous alignment-related styles
    style = style
      .replace(/margin-left:\s*[^;]+;?/g, "")
      .replace(/margin-right:\s*[^;]+;?/g, "")
      .replace(/text-align:\s*[^;]+;?/g, "")
      .replace(/display:\s*[^;]+;?/g, "")
      .trim();

    let alignStyle = "";
    if (align === "left") {
      alignStyle = "display: block; margin-left: 0; margin-right: auto;";
    } else if (align === "center") {
      alignStyle = "display: block; margin-left: auto; margin-right: auto;";
    } else {
      // right
      alignStyle = "display: block; margin-left: auto; margin-right: 0;";
    }

    style = (style ? style + " " : "") + alignStyle;

    const tr = editor.state.tr;
    tr.setNodeMarkup(from, null, {
      ...currentAttrs,
      style: style.trim(),
    });
    editor.view.dispatch(tr);
    onClose();
  };

  const resizeImage = (width: number | string, height?: number | string) => {
    const view = editor.view;

    // Try to find image node and DOM element using the context menu position
    let imagePos: number | null = null;
    let imageNode: {
      type: { name: string };
      attrs: Record<string, unknown>;
    } | null = null;
    let imgElement: HTMLImageElement | null = null;

    if (position?.image) {
      imgElement = position.image;
      const posFromDom = view.posAtDOM(position.image, 0);
      if (posFromDom !== null) {
        imagePos = posFromDom;
        const node = editor.state.doc.nodeAt(imagePos);
        if (node && node.type.name === "image") {
          imageNode = node as {
            type: { name: string };
            attrs: Record<string, unknown>;
          };
        }
      }
    }

    // Fallback: search the document for the image node
    if (!imageNode || imagePos === null) {
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          const dom = view.nodeDOM(pos);
          if (dom && dom === position?.image) {
            imageNode = node as {
              type: { name: string };
              attrs: Record<string, unknown>;
            };
            imagePos = pos;
            imgElement = dom as HTMLImageElement;
            return false;
          }
        }
      });
    }

    if (!imageNode || imagePos === null) {
      return;
    }

    const currentAttrs = imageNode.attrs as {
      src: string;
      width?: number | string;
      height?: number | string;
      style?: string;
    };

    // If width is a percentage string, apply it as CSS relative to parent
    if (typeof width === "string" && width.trim().endsWith("%")) {
      const trimmed = width.trim();
      let style = currentAttrs.style || "";

      // Remove existing width style
      style = style.replace(/width:\s*[^;]+;?/g, "").trim();
      // Append new width
      style = (style ? style + " " : "") + `width: ${trimmed};`;

      const transaction = editor.state.tr;
      transaction.setNodeMarkup(imagePos, null, {
        ...currentAttrs,
        // clear numeric width/height when using percentage so CSS controls size
        width: null,
        height: height ?? null,
        style: style.trim(),
      });
      editor.view.dispatch(transaction);
      onClose();
      return;
    }

    // Otherwise, treat as absolute pixel size (px)
    let targetWidth: number | null = null;

    if (typeof width === "number") {
      targetWidth = Math.max(10, width);
    } else if (typeof width === "string") {
      const trimmed = width.trim();
      if (trimmed.endsWith("px")) {
        const val = parseInt(trimmed.slice(0, -2), 10);
        if (!Number.isNaN(val)) {
          targetWidth = Math.max(10, val);
        }
      } else {
        const val = parseInt(trimmed, 10);
        if (Number.isNaN(val)) {
          return;
        }
        targetWidth = Math.max(10, val);
      }
    }

    if (!targetWidth) {
      return;
    }

    // Optionally compute height to keep aspect ratio if height is not provided
    let targetHeight: number | undefined;
    if (height !== undefined) {
      if (typeof height === "number") {
        targetHeight = height;
      } else {
        const trimmed = height.trim();
        if (trimmed.endsWith("px")) {
          const val = parseInt(trimmed.slice(0, -2), 10);
          if (!Number.isNaN(val)) {
            targetHeight = Math.max(10, val);
          }
        } else {
          const val = parseInt(trimmed, 10);
          if (!Number.isNaN(val)) {
            targetHeight = Math.max(10, val);
          }
        }
      }
    } else if (
      imgElement &&
      imgElement.naturalWidth &&
      imgElement.naturalHeight
    ) {
      const aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight;
      if (Number.isFinite(aspectRatio) && aspectRatio > 0) {
        targetHeight = Math.max(10, Math.round(targetWidth / aspectRatio));
      }
    }

    const transaction = editor.state.tr;
    transaction.setNodeMarkup(imagePos, null, {
      ...currentAttrs,
      width: targetWidth,
      ...(targetHeight ? { height: targetHeight } : {}),
    });
    editor.view.dispatch(transaction);

    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 1000,
        minWidth: 220,
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        padding: token.paddingXS,
      }}
    >
      <Space
        orientation='vertical'
        size={token.marginXS}
        style={{ width: "100%" }}
      >
        <div
          style={{
            fontSize: token.fontSizeSM,
            fontWeight: 500,
            color: token.colorTextSecondary,
          }}
        >
          Image size
        </div>

        {/* Preset sizes */}
        <Space
          orientation='vertical'
          size={token.marginXXS}
          style={{ width: "100%" }}
        >
          <Button
            size='small'
            type='text'
            block
            icon={<ColumnWidthOutlined />}
            onClick={() => resizeImage("25%")}
            style={{ justifyContent: "flex-start" }}
          >
            Small (25%)
          </Button>
          <Button
            size='small'
            type='text'
            block
            icon={<ColumnWidthOutlined />}
            onClick={() => resizeImage("50%")}
            style={{ justifyContent: "flex-start" }}
          >
            Medium (50%)
          </Button>
          <Button
            size='small'
            type='text'
            block
            icon={<ColumnWidthOutlined />}
            onClick={() => resizeImage("75%")}
            style={{ justifyContent: "flex-start" }}
          >
            Large (75%)
          </Button>
          <Button
            size='small'
            type='text'
            block
            icon={<ColumnWidthOutlined />}
            onClick={() => resizeImage("100%")}
            style={{ justifyContent: "flex-start" }}
          >
            Full width (100%)
          </Button>

          {/* Reset size */}
          <Button
            size='small'
            type='text'
            block
            icon={<ReloadOutlined />}
            onClick={() => {
              const { from } = editor.state.selection;
              const node = editor.state.doc.nodeAt(from);
              if (node && node.type.name === "image") {
                const attrs: { src: string } = {
                  src: node.attrs.src as string,
                };
                editor.chain().focus().setImage(attrs).run();
                onClose();
              }
            }}
            style={{
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            Reset size
          </Button>
        </Space>

        <Divider style={{ margin: 0 }} />

        {/* Alignment */}
        <div
          style={{
            fontWeight: 500,
            fontSize: token.fontSizeSM,
            color: token.colorTextSecondary,
          }}
        >
          Alignment
        </div>
        <Space size={token.marginXXS}>
          <Button
            size='small'
            icon={<AlignLeftOutlined />}
            onClick={() => alignImage("left")}
          />
          <Button
            size='small'
            icon={<AlignCenterOutlined />}
            onClick={() => alignImage("center")}
          />
          <Button
            size='small'
            icon={<AlignRightOutlined />}
            onClick={() => alignImage("right")}
          />
        </Space>

        <Divider style={{ margin: 0 }} />

        {/* Custom size */}
        <div
          style={{
            fontSize: token.fontSizeSM,
            fontWeight: 500,
            color: token.colorTextSecondary,
          }}
        >
          Custom size
        </div>
        <Space
          orientation='vertical'
          size={token.marginXXS}
          style={{ width: "100%" }}
        >
          <Button
            size='small'
            type='text'
            block
            icon={<ColumnWidthOutlined />}
            onClick={() => {
              const width = window.prompt("Enter width (px or %):", "300");
              if (width) {
                resizeImage(width);
              }
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Set width…
          </Button>
        </Space>

        <Divider style={{ margin: 0 }} />

        {/* Delete image */}
        <Button
          size='small'
          type='text'
          block
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            const { from } = editor.state.selection;
            const node = editor.state.doc.nodeAt(from);
            if (node && node.type.name === "image") {
              editor.chain().focus().deleteSelection().run();
              onClose();
            }
          }}
          style={{
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          Delete image
        </Button>
      </Space>
    </div>
  );
}

export default ImageContextMenu;
