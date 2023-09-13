import { Post } from "@/lib/types/post/index";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";
import styles from "./index.module.scss";

export const Layout: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const PostComponent: FunctionComponent<{
  post: Post;
}> = ({ post }) => {
  return (
    <div className={styles.post} key={post.id}>
      <h1 className={styles.title}>
        <Link href={`/post/${encodeURIComponent(post.slug ?? "")}`}>
          {post.title}
        </Link>
      </h1>
      <div className={styles.timestampWrapper}>
        <div>
          <div className={styles.timestamp}>
            作成日時: {post.createdTsViewFmt}
          </div>
          <div className={styles.timestamp}>
            更新日時: {post.lastEditedTsViewFmt}
          </div>
        </div>
      </div>
      <div>
        {post.contents.map((content, index) => {
          const key = `${post.id}_${index}`;
          switch (content.type) {
            case "heading_2":
              return (
                <h2 key={key} className={styles.heading2}>
                  {content.text}
                </h2>
              );
            case "heading_3":
              return (
                <h3 key={key} className={styles.heading3}>
                  {content.text}
                </h3>
              );
            case "paragraph":
              return (
                <p key={key} className={styles.paragraph}>
                  {content.text}
                </p>
              );
            case "code":
              return (
                <pre
                  key={key}
                  className={`${styles.code} lang-${content.language}`}
                >
                  <code>{content.text}</code>
                </pre>
              );
            case "quote":
              return (
                <blockquote key={key} className={styles.quote}>
                  {content.text}
                </blockquote>
              );
          }
        })}
      </div>
    </div>
  );
};
