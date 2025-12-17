import { BgColorsOutlined, CloseOutlined } from "@ant-design/icons";
import type { Editor } from "@tiptap/react";
import { Button, Popover, Space, theme, Tooltip } from "antd";
import { useState } from "react";

interface HighlightPickerProps {
  editor: Editor;
}

function HighlightPicker({ editor }: HighlightPickerProps) {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);

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

  const currentHighlight = (editor.getAttributes("highlight").color ||
    "#fef08a") as string;

  const handleSelectColor = (value: string) => {
    editor.chain().focus().toggleHighlight({ color: value }).run();
    setOpen(false);
  };

  const handleClearHighlight = () => {
    editor.chain().focus().unsetHighlight().run();
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
        Highlight color
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: token.marginXXS,
        }}
      >
        {colors.map((color) => {
          const isActive =
            editor.isActive("highlight", { color: color.value }) ||
            currentHighlight === color.value;
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
          onClick={handleClearHighlight}
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
      <Tooltip title='Highlight color'>
        <Button
          size='small'
          icon={<BgColorsOutlined />}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            paddingInline: 8,
            borderColor: editor.isActive("highlight")
              ? token.colorPrimary
              : undefined,
          }}
        >
          <span
            style={{
              width: 16,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentHighlight,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          />
        </Button>
      </Tooltip>
    </Popover>
  );
}

export default HighlightPicker;
