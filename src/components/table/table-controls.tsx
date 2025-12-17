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
import { Button, Divider, Popover, Space, theme, Tooltip } from "antd";
import { useState } from "react";

export interface TableControlsProps {
  editor: Editor;
}

function TableControls({ editor }: TableControlsProps) {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setOpen(false);
    setHoveredCell(null);
  };

  const isCellSelected = (cellRow: number, cellCol: number) => {
    if (!hoveredCell) return false;
    return cellRow <= hoveredCell.row && cellCol <= hoveredCell.col;
  };

  const content = (
    <Space orientation='vertical' size={token.marginXS}>
      <div
        style={{
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
        }}
      >
        Insert table
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: token.marginXXS,
        }}
      >
        {Array.from({ length: 25 }).map((_, index) => {
          const row = Math.floor(index / 5) + 1;
          const col = (index % 5) + 1;
          const selected = isCellSelected(row, col);
          return (
            <Button
              key={index}
              type={selected ? "primary" : "default"}
              style={{
                width: 24,
                height: 24,
                padding: 0,
              }}
              onClick={() => insertTable(row, col)}
              onMouseEnter={() => setHoveredCell({ row, col })}
              onMouseLeave={() => setHoveredCell(null)}
            />
          );
        })}
      </div>
      <div
        style={{
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
          textAlign: "center",
        }}
      >
        {hoveredCell
          ? `${hoveredCell.row} × ${hoveredCell.col}`
          : "Select size"}
      </div>

      {editor.isActive("table") && (
        <>
          <Divider style={{ margin: 0 }} />
          <div
            style={{
              fontSize: token.fontSizeSM,
              fontWeight: 500,
              color: token.colorTextSecondary,
            }}
          >
            Row actions
          </div>
          <Space size={token.marginXXS} wrap>
            <Tooltip title='Add row above'>
              <Button
                size='small'
                icon={<InsertRowAboveOutlined />}
                onClick={() => editor.chain().focus().addRowBefore().run()}
              />
            </Tooltip>

            <Tooltip title='Add row below'>
              <Button
                size='small'
                icon={<InsertRowBelowOutlined />}
                onClick={() => editor.chain().focus().addRowAfter().run()}
              />
            </Tooltip>

            <Tooltip title='Delete row'>
              <Button
                size='small'
                icon={<DeleteRowOutlined />}
                danger
                onClick={() => editor.chain().focus().deleteRow().run()}
              />
            </Tooltip>
          </Space>

          <Divider style={{ margin: 0 }} />

          <div
            style={{
              fontSize: token.fontSizeSM,
              fontWeight: 500,
              color: token.colorTextSecondary,
            }}
          >
            Column actions
          </div>

          <Space size={token.marginXXS} wrap>
            <Tooltip title='Add column left'>
              <Button
                size='small'
                icon={<InsertRowLeftOutlined />}
                onClick={() => editor.chain().focus().addColumnBefore().run()}
              />
            </Tooltip>

            <Tooltip title='Add column right'>
              <Button
                size='small'
                icon={<InsertRowRightOutlined />}
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              />
            </Tooltip>

            <Tooltip title='Delete column'>
              <Button
                size='small'
                icon={<DeleteColumnOutlined />}
                danger
                onClick={() => editor.chain().focus().deleteColumn().run()}
              />
            </Tooltip>
          </Space>

          <Divider style={{ margin: 0 }} />

          <Button
            size='small'
            icon={<TableOutlined />}
            danger
            onClick={() => {
              editor.chain().focus().deleteTable().run();
              setOpen(false);
            }}
            style={{ width: "100%" }}
          >
            Delete table
          </Button>
        </>
      )}
    </Space>
  );

  return (
    <Popover
      content={content}
      trigger='click'
      open={open}
      onOpenChange={setOpen}
      placement='bottomLeft'
    >
      <Tooltip title='Table'>
        <Button
          size='small'
          icon={<TableOutlined />}
          type={editor.isActive("table") ? "primary" : "default"}
        />
      </Tooltip>
    </Popover>
  );
}

export default TableControls;
