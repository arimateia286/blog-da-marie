import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

  if (error) {
    console.error('Erro ao buscar post:', error);
    return null;
  }

  return post;
};
