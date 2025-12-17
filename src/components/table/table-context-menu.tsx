import {
  DeleteColumnOutlined,
  DeleteRowOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type { Editor } from "@tiptap/react";
import { Button, Divider, Space, theme } from "antd";
import { useEffect, useRef } from "react";

export interface TableContextMenuProps {
  editor: Editor;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

function TableContextMenu({
  editor,
  position,
  onClose,
}: TableContextMenuProps) {
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
        {/* Column actions */}
        <div
          style={{
            fontSize: token.fontSizeSM,
            fontWeight: 500,
            color: token.colorTextSecondary,
          }}
        >
          Column actions
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
            icon={<InsertRowLeftOutlined />}
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
              onClose();
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Add column left
          </Button>
          <Button
            size='small'
            type='text'
            block
            icon={<InsertRowRightOutlined />}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
              onClose();
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Add column right
          </Button>
          <Button
            size='small'
            type='text'
            block
            danger
            icon={<DeleteColumnOutlined />}
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
              onClose();
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Delete column
          </Button>
        </Space>

        <Divider style={{ margin: 0 }} />

        {/* Row actions */}
        <div
          style={{
            fontSize: token.fontSizeSM,
            fontWeight: 500,
            color: token.colorTextSecondary,
          }}
        >
          Row actions
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
            icon={<InsertRowAboveOutlined />}
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
              onClose();
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Add row above
          </Button>
          <Button
            size='small'
            type='text'
            block
            icon={<InsertRowBelowOutlined />}
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
              onClose();
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Add row below
          </Button>
          <Button
            size='small'
            type='text'
            block
            danger
            icon={<DeleteRowOutlined />}
            onClick={() => {
              editor.chain().focus().deleteRow().run();
              onClose();
            }}
            style={{ justifyContent: "flex-start" }}
          >
            Delete row
          </Button>
        </Space>

        <Divider style={{ margin: 0 }} />

        {/* Delete table */}
        <Button
          size='small'
          type='text'
          block
          danger
          icon={<TableOutlined />}
          onClick={() => {
            editor.chain().focus().deleteTable().run();
            onClose();
          }}
          style={{
            justifyContent: "flex-start",
            width: "100%",
            fontWeight: 500,
          }}
        >
          Delete table
        </Button>
      </Space>
    </div>
  );
}

export default TableContextMenu;
