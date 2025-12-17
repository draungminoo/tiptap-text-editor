import { PictureOutlined } from "@ant-design/icons";
import type { Editor } from "@tiptap/react";
import { Button, Tooltip } from "antd";
import { useRef } from "react";

export interface ImageButtonProps {
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

  const handleClick = () => {
    const choice = window.confirm(
      "Click OK to upload from file, Cancel to enter URL",
    );

    if (choice) {
      fileInputRef.current?.click();
    } else {
      insertImageFromUrl();
    }
  };

  return (
    <div>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept='image/*'
        style={{ display: "none" }}
      />
      <Tooltip title='Insert image'>
        <Button
          size='small'
          icon={<PictureOutlined />}
          onClick={handleClick}
        />
      </Tooltip>
    </div>
  );
}

export default ImageButton;
