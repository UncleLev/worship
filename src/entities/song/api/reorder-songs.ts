import supabase from '@/shared/lib/supabase-browser';

export async function reorderSongsAlphabetically(): Promise<void> {
  const { data, error } = await supabase
    .from('songs')
    .select('id, name')
    .order('name', { ascending: true });

  if (error || !data) return;

  await Promise.all(
    data.map((s, i) =>
      supabase
        .from('songs')
        .update({ sort_order: i + 1 })
        .eq('id', s.id),
    ),
  );
}
