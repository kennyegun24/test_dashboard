import React, { useCallback } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3,
  Highlighter,
  Italic,
  Strikethrough,
  Undo,
  Redo,
  Quote,
  Underline,
  Code,
  ListOrdered,
  List,
  Link,
} from "lucide-react";

const SlotBefore = ({ editor }) => {
  if (!editor) return null;
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert(e.message);
    }
  }, [editor]);
  return (
    <div className="px-0 md:px-2 flex justify-between items-start gap-5 w-full overflow-x-auto md:flex-wrap border border-[--foreground] bg-[#4A4949]">
      <div className="flex justify-start items-center gap-3 w-full flex-wrap">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Heading1Icon size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Heading2Icon className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Heading3 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <p className="w-5 h-5">P</p>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={
            editor.isActive("highlight")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Highlighter className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" })
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <AlignJustify className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          // className={
          //   editor.isActive('')
          //
          //                   ? "bg-[--foreground] textrimary-text-color] w-8 h-8 flex justify-center items-center rounded-lg"
          // : "text-sky-400 w-8 h-[--primary-text-color]-center items-center"
          // }
        >
          <Undo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          // className={
          //   editor.isActive('')
          //
          //                   ? "bg-[--foreground] textrimary-text-color] w-8 h-8 flex justify-center items-center rounded-lg"
          // : "text-sky-400 w-8 h-[--primary-text-color]-center items-center"
          // }
        >
          <Redo className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={
            editor.isActive("code")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={setLink}
          className={
            editor.isActive("link")
              ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
              : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
          }
        >
          <Link className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SlotBefore;

const Button = ({ editor }) => {
  const buttons = [
    {
      title: "heading",
      icon: <Heading1Icon />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      editor: editor,
    },
    {
      title: "heading",
      icon: <Heading2Icon />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      editor: editor,
    },
  ];
  return (
    <button
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      className={
        editor.isActive("heading", { level: 2 })
          ? "bg-[--foreground] text-[--text-color] w-8 h-8 flex justify-center items-center rounded-lg"
          : "text-[--primary-text-color] w-8 h-8 flex justify-center items-center"
      }
    >
      <Heading2Icon className="w-5 h-5" />
    </button>
  );
};
