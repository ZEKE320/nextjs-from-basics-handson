import { Client } from "@notionhq/client";
import dayjs from "dayjs";
import { GetStaticProps, NextPage } from "next";
import prism from "prismjs";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { Content, Post } from "../types/api/Post";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

type StaticProps = {
  post: Post | null;
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const database = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID || "",
    filter: {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });

  const page = database.results[0];
  if (!page) {
    return {
      props: {
        post: null,
      },
    };
  }
  if (!("properties" in page)) {
    return {
      props: {
        post: {
          id: page.id,
          title: null,
          slug: null,
          createdTs: null,
          lastEditedTs: null,
          contents: [],
        },
      },
    };
  }

  let title: string | null = null;
  if (
    page.properties["Name"].type === "title" &&
    Array.isArray(page.properties["Name"].title)
  ) {
    title = page.properties["Name"].title[0]?.plain_text ?? null;
  }
  let slug: string | null = null;
  if (
    page.properties["Slug"].type === "rich_text" &&
    Array.isArray(page.properties["Slug"].rich_text)
  ) {
    slug = page.properties["Slug"].rich_text[0]?.plain_text ?? null;
  }

  const blocks = await notion.blocks.children.list({
    block_id: page.id,
  });

  const contents: Content[] = [];
  blocks.results.forEach((block) => {
    if (!("type" in block)) {
      return;
    }
    switch (block.type) {
      case "paragraph":
        contents.push({
          type: "paragraph",
          text: block.paragraph.rich_text[0]?.plain_text ?? null,
        });
        break;
      case "heading_2":
        contents.push({
          type: "heading_2",
          text: block.heading_2.rich_text[0]?.plain_text ?? null,
        });
        break;
      case "heading_3":
        contents.push({
          type: "heading_3",
          text: block.heading_3.rich_text[0]?.plain_text ?? null,
        });
        break;
      case "quote":
        contents.push({
          type: "quote",
          text: block.quote.rich_text[0]?.plain_text ?? null,
        });
        break;
      case "code":
        contents.push({
          type: "code",
          text: block.code.rich_text[0]?.plain_text ?? null,
          language: block.code.language,
        });
    }
  });

  const post: Post = {
    id: page.id,
    title,
    slug,
    createdTs: "created_time" in page ? page.created_time : null,
    lastEditedTs: "last_edited_time" in page ? page.last_edited_time : null,
    contents,
  };

  return {
    props: { post },
  };
};

const Home: NextPage<StaticProps> = ({ post }) => {
  useEffect(() => {
    prism.highlightAll();
  }, []);

  if (!post) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.post}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.timestampWrapper}>
          <div>
            <div className={styles.timestamp}>
              作成日時: {dayjs(post.createdTs).format("YYYY-MM-DD HH:mm:ss")}
            </div>
            <div className={styles.timestamp}>
              更新日時: {dayjs(post.lastEditedTs).format("YYYY-MM-DD HH:mm:ss")}
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
    </div>
  );
};

export default Home;
