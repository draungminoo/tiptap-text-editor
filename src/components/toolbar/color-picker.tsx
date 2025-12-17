import { CloseOutlined, FontColorsOutlined } from "@ant-design/icons";
import type { Editor } from "@tiptap/react";
import { Button, Popover, Space, theme, Tooltip } from "antd";
import { useState } from "react";

interface ColorPickerProps {
  editor: Editor;
}

function ColorPicker({ editor }: ColorPickerProps) {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);

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

  const currentColor = (editor.getAttributes("textStyle").color ||
    "#000000") as string;

  const handleSelectColor = (value: string) => {
    editor.chain().focus().setColor(value).run();
    setOpen(false);
  };

  const handleClearColor = () => {
    editor.chain().focus().unsetColor().run();
    setOpen(false);
  };

  const content = (
    <Space
      orientation='vertical'
      size={token.marginXXS}
      style={{ width: "fit-content" }}
    >
      <div
        style={{
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
        }}
      >
        Text color
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: token.marginXXS,
        }}
      >
        {colors.map((color) => {
          const isActive = currentColor === color.value;
          return (
            <Button
              key={color.value}
              type={isActive ? "primary" : "default"}
              shape='circle'
              size='small'
              style={{
                backgroundColor: color.value,
                borderColor: isActive
                  ? token.colorPrimaryBorder
                  : token.colorBorder,
                width: 24,
                height: 24,
                padding: 0,
              }}
              onClick={() => handleSelectColor(color.value)}
              title={color.name}
            />
          );
        })}
        <Button
          size='small'
          shape='circle'
          onClick={handleClearColor}
          style={{ width: 24, height: 24, padding: 0, fontSize: 10 }}
          icon={<CloseOutlined />}
          danger
        />
      </div>
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
      <Tooltip title='Text color'>
        <Button
          size='small'
          icon={<FontColorsOutlined />}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            paddingInline: 8,
            borderColor: editor.isActive("textStyle", { color: currentColor })
              ? token.colorPrimary
              : undefined,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: currentColor,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          />
        </Button>
      </Tooltip>
    </Popover>
  );
}

export default ColorPicker;
