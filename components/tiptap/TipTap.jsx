"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SlotBefore from "./SlotBefore";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import HardBreak from "@tiptap/extension-hard-break";

const Tiptap = ({ content, setContent, onSave }) => {
  // const [purifiedContent, setPurifiedContent] = useState(null);
  const onChange = (e) => {
    setContent(e);
    console.log(e);
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HardBreak.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          let consecutiveEnterCount = 1;

          return {
            Enter: (event) => {
              const { editor } = this;
              const { $head } = editor.state.selection;
              const isCurrentLineEmpty = $head.parent.textContent.trim() === "";

              if (
                this.editor.isActive("orderedList") ||
                this.editor.isActive("bulletList")
              ) {
                return this.editor.chain().createParagraphNear().run();
              }
              consecutiveEnterCount += 1;

              if (isCurrentLineEmpty) {
                if (consecutiveEnterCount >= 1) {
                  if (event && event.preventDefault) {
                    event.preventDefault(); // Prevent default behavior
                  }
                  console.log(event);
                  consecutiveEnterCount = 1;
                  return editor
                    .chain()
                    .exitCode()
                    .insertContent("<br />")
                    .run();
                }
              } else {
                consecutiveEnterCount = 0;
              }

              return false;
            },
          };
        },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch (error) {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch (error) {
            return false;
          }
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "h-[350px] md:h-[500px] 2xl:h-[700px] overflow-y-auto cursor-text rounded-md border border-[--foreground] p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // useEffect(() => {
  // const _purifiedContent = DOMPurify?.sanitize(content);
  // setPurifiedContent(_purifiedContent);
  // }, [content]);

  return (
    <div className="tiptap w-full flex flex-col bg-[#383737]">
      <SlotBefore editor={editor} />
      <EditorContent editor={editor} className="w-full" />
      <div>{content && parse(content)}</div>
    </div>
  );
};

export default Tiptap;
