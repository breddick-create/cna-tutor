do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles own insert'
  ) then
    create policy "profiles own insert"
    on public.profiles
    for insert
    with check (auth.uid() = id or public.is_admin());
  end if;
end
$$;
