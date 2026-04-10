import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import rehypeUnwrapImages from 'rehype-unwrap-images';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export const getPosts = async () => {
  let { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }

  return posts;
};

export const getPostById = async (id) => {
  let { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    console.error('Erro ao buscar post:', error);
    return null;
  }

  const { content, ...data } = post;

  const mdxSource = await serialize(content || '', {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism, rehypeUnwrapImages],
    },
    scope: data,
  });

  return JSON.parse(
    JSON.stringify({
      mdxSource,
      data,
      postFilePath: null,
    }),
  );
};

export const getPreviousPostById = async (id) => {
  let { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .lt('id', id)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar post anterior:', error);
    return null;
  }

  return post;
};

export const getNextPostById = async (id) => {
  let { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .gt('id', id)
    .order('id', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar próximo post:', error);
    return null;
  }

  return post;
};
