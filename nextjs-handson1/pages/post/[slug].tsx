import { Layout } from "@/lib/component/Layout";
import { PostComponent } from "@/lib/component/Post";
import { Post } from "@/lib/types/Post/index";
import { getPostContents, getPosts } from "@/pages/index";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Prism from "@/prismjs.config";
import { useEffect } from "react";

type StaticPathsParams = {
  slug: string;
};

type StaticProps = {
  posts: Post[];
};

export const getStaticPaths: GetStaticPaths<StaticPathsParams> = async () => {
  const posts = await getPosts();
  const paths: {
    params: { slug: string };
  }[] = [];

  posts.forEach((post) => {
    const slug = post.slug;
    if (slug) {
      paths.push({
        params: { slug },
      });
    }
  });
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  StaticProps,
  StaticPathsParams
> = async ({ params }) => {
  const notFoundProps = {
    props: { posts: [] },
    redirect: { destination: "/404" },
  };

  if (!params) {
    return notFoundProps;
  }

  const { slug } = params;
  const posts = await getPosts(slug);
  if (posts.length === 0) {
    return notFoundProps;
  }

  await Promise.all(
    posts.map(async (post) => {
      const contents = await getPostContents(post);
      post.contents = contents;
    })
  );

  return {
    props: { posts },
    revalidate: 60,
  };
};

const PostPage: NextPage<StaticProps> = ({ posts }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [posts]);

  return (
    <Layout>
      {posts.map((post) => {
        return <PostComponent post={post} key={post.id} />;
      })}
    </Layout>
  );
};

export default PostPage;
