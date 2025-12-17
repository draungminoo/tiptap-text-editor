import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
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
import type { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ResizableImage from "./image/image-extension";

export const textEditorExtensions: Extensions = [
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
  ResizableImage.configure({
    allowBase64: true,
  }),
];
