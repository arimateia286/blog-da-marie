import { getGlobalData } from '../../utils/global-data';
import {
  getPostById,
  getNextPostById,
  getPreviousPostById,
} from '../../utils/mdx-utils';

import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Link from 'next/link';
import ArrowIcon from '../../components/ArrowIcon';
import CustomLink from '../../components/CustomLink';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Layout, { GradientBackground } from '../../components/Layout';
import SEO from '../../components/SEO';

const components = {
  a: CustomLink,
  Head,
};

export default function PostPage({
  source,
  frontMatter,
  prevPost,
  nextPost,
  globalData,
}) {
  return (
    <Layout>
      <SEO
        title={`${frontMatter.title} - ${globalData.name}`}
        description={frontMatter.description}
      />
      <Header name={globalData.name} />
      <article className="px-6 md:px-0">
        <header>
          <h1 className="text-3xl md:text-5xl dark:text-white text-left mb-12">
            {frontMatter?.title}
          </h1>
          {frontMatter?.description && (
            <p className="text-xl mb-4">{frontMatter?.description}</p>
          )}
        </header>
        <main>
          {frontMatter?.cover && (
            <img
              src={frontMatter.cover}
              alt={frontMatter.title}
              className="w-auto h-auto mb-8"
            />
          )}
          <article className="prose dark:prose-dark">
            <MDXRemote {...source} components={components} />
          </article>
        </main>
        <div className="grid mt-12 md:grid-cols-2 lg:-mx-24">
          {prevPost && (
            <Link href={`/posts/${prevPost.id}`} passHref>
              <div className="flex flex-col px-10 py-8 text-center transition border border-gray-800/10 bg-white/10 md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg last:rounded-b-lg backdrop-blur-lg dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/50 dark:border-white/10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none">
                <p className="mb-4 text-gray-500 uppercase dark:text-white dark:opacity-60">
                  Anterior
                </p>
                <h4 className="mb-6 text-2xl text-gray-700 dark:text-white">
                  {prevPost.title}
                </h4>
                <ArrowIcon className="mx-auto mt-auto transform rotate-180 md:mr-0" />
              </div>
            </Link>
          )}
          {nextPost && (
            <Link href={`/posts/${nextPost.id}`} passHref>
              <div className="flex flex-col px-10 py-8 text-center transition border border-gray-800/10 bg-white/10 md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg last:rounded-b-lg backdrop-blur-lg dark:bg-black/30 hover:bg-white/20 dark:hover:bg-black/50 dark:border-white/10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none">
                <p className="mb-4 text-gray-500 uppercase dark:text-white dark:opacity-60">
                  Próximo
                </p>
                <h4 className="mb-6 text-2xl text-gray-700 dark:text-white">
                  {nextPost.title}
                </h4>
                <ArrowIcon className="mx-auto mt-auto md:mr-0" />
              </div>
            </Link>
          )}
        </div>
      </article>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="absolute -top-32 opacity-30 dark:opacity-50"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export const getServerSideProps = async ({ params }) => {
  const globalData = getGlobalData();

  try {
    const postData = await getPostById(params.id);

    if (!postData) {
      return { notFound: true };
    }

    const prevPost = await getPreviousPostById(params.id);
    const nextPost = await getNextPostById(params.id);

    const props = {
      globalData,
      source: postData.mdxSource,
      frontMatter: postData.data,
      prevPost: prevPost || null,
      nextPost: nextPost || null,
    };

    return {
      props: JSON.parse(JSON.stringify(props)),
    };
  } catch (error) {
    console.error('Erro no getServerSideProps:', error);
    return { notFound: true };
  }
};
