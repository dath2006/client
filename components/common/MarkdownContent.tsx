"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        components={{
          // Custom code block rendering with syntax highlighting
          code(props: any) {
            const { node, inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow as any}
                language={match[1]}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-surface px-2 py-1 rounded text-sm font-mono text-primary"
                {...rest}
              >
                {children}
              </code>
            );
          },
          // Custom link rendering
          a(props: any) {
            const { href, children, ...rest } = props;
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors underline"
                {...rest}
              >
                {children}
              </a>
            );
          },
          // Custom heading rendering
          h1(props: any) {
            const { children, ...rest } = props;
            return (
              <h1
                className="text-3xl font-bold text-text-primary mb-6 mt-8 first:mt-0"
                {...rest}
              >
                {children}
              </h1>
            );
          },
          h2(props: any) {
            const { children, ...rest } = props;
            return (
              <h2
                className="text-2xl font-bold text-text-primary mb-4 mt-6 first:mt-0"
                {...rest}
              >
                {children}
              </h2>
            );
          },
          h3(props: any) {
            const { children, ...rest } = props;
            return (
              <h3
                className="text-xl font-bold text-text-primary mb-3 mt-5 first:mt-0"
                {...rest}
              >
                {children}
              </h3>
            );
          },
          h4(props: any) {
            const { children, ...rest } = props;
            return (
              <h4
                className="text-lg font-bold text-text-primary mb-2 mt-4 first:mt-0"
                {...rest}
              >
                {children}
              </h4>
            );
          },
          h5(props: any) {
            const { children, ...rest } = props;
            return (
              <h5
                className="text-base font-bold text-text-primary mb-2 mt-3 first:mt-0"
                {...rest}
              >
                {children}
              </h5>
            );
          },
          h6(props: any) {
            const { children, ...rest } = props;
            return (
              <h6
                className="text-sm font-bold text-text-primary mb-2 mt-3 first:mt-0"
                {...rest}
              >
                {children}
              </h6>
            );
          },
          // Custom paragraph rendering
          p(props: any) {
            const { children, ...rest } = props;
            return (
              <p className="text-text-primary leading-relaxed mb-4" {...rest}>
                {children}
              </p>
            );
          },
          // Custom list rendering
          ul(props: any) {
            const { children, ...rest } = props;
            return (
              <ul
                className="list-disc list-inside mb-4 space-y-1 text-text-primary pl-4"
                {...rest}
              >
                {children}
              </ul>
            );
          },
          ol(props: any) {
            const { children, ...rest } = props;
            return (
              <ol
                className="list-decimal list-inside mb-4 space-y-1 text-text-primary pl-4"
                {...rest}
              >
                {children}
              </ol>
            );
          },
          li(props: any) {
            const { children, ...rest } = props;
            return (
              <li className="text-text-primary" {...rest}>
                {children}
              </li>
            );
          },
          // Custom blockquote rendering
          blockquote(props: any) {
            const { children, ...rest } = props;
            return (
              <blockquote
                className="border-l-4 border-primary bg-surface pl-4 py-2 my-4 italic text-text-secondary"
                {...rest}
              >
                {children}
              </blockquote>
            );
          },
          // Custom table rendering
          table(props: any) {
            const { children, ...rest } = props;
            return (
              <div className="overflow-x-auto mb-4">
                <table
                  className="min-w-full border-collapse border border-border"
                  {...rest}
                >
                  {children}
                </table>
              </div>
            );
          },
          th(props: any) {
            const { children, ...rest } = props;
            return (
              <th
                className="border border-border bg-surface px-4 py-2 text-left font-semibold text-text-primary"
                {...rest}
              >
                {children}
              </th>
            );
          },
          td(props: any) {
            const { children, ...rest } = props;
            return (
              <td
                className="border border-border px-4 py-2 text-text-primary"
                {...rest}
              >
                {children}
              </td>
            );
          },
          // Custom horizontal rule rendering
          hr(props: any) {
            return (
              <hr className="border-0 border-t border-border my-6" {...props} />
            );
          },
          // Custom image rendering
          img(props: any) {
            const { src, alt, ...rest } = props;
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg border border-border my-4"
                loading="lazy"
                {...rest}
              />
            );
          },
          // Custom strong/bold rendering
          strong(props: any) {
            const { children, ...rest } = props;
            return (
              <strong className="font-bold text-text-primary" {...rest}>
                {children}
              </strong>
            );
          },
          // Custom emphasis/italic rendering
          em(props: any) {
            const { children, ...rest } = props;
            return (
              <em className="italic text-text-primary" {...rest}>
                {children}
              </em>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
