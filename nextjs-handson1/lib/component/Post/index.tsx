import { Post } from "@/lib/types/Post";
import dayjs from "dayjs";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import styles from "./index.module.scss";

export const PostComponent: FunctionComponent<{
  post: Post;
}> = ({ post }) => {
  const [createdTsForView, setCreatedTsForView] = useState("");
  const [lastEditedTsForView, setLastEditedTsForView] = useState("");

  useEffect(() => {
    setCreatedTsForView(dayjs(post.createdTs).format("YYYY/MM/DD HH:mm:ss"));
    setLastEditedTsForView(
      dayjs(post.lastEditedTs).format("YYYY/MM/DD HH:mm:ss")
    );
  }, [post]);

  return (
    <div className={styles.post} key={post.id}>
      <h1 className={styles.title}>
        <Link href={`/post/${encodeURIComponent(post.slug ?? "")}`}>
          {post.title}
        </Link>
      </h1>
      <div className={styles.timestampWrapper}>
        <div>
          <div className={styles.timestamp}>作成日時: {createdTsForView}</div>
          <div className={styles.timestamp}>
            更新日時: {lastEditedTsForView}
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
