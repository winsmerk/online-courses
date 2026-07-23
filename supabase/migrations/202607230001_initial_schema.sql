create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'admin');
create type public.course_status as enum ('draft', 'published');
create type public.enrollment_status as enum ('active', 'inactive');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  cover_url text,
  instructor text not null default '',
  category text not null default '通识',
  level text not null default '通用',
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  status public.course_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_images (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null default '',
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  video_path text,
  is_preview boolean not null default false,
  sort_order integer not null default 0
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  filename text not null,
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  progress_seconds integer not null default 0 check (progress_seconds >= 0),
  completed boolean not null default false,
  last_viewed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index courses_status_idx on public.courses(status);
create index chapters_course_id_idx on public.chapters(course_id, sort_order);
create index lessons_chapter_id_idx on public.lessons(chapter_id, sort_order);
create index enrollments_user_id_idx on public.enrollments(user_id);
create index progress_user_id_idx on public.lesson_progress(user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_images enable row level security;
alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.attachments enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

create policy "profiles_read_own_or_admin"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "published_courses_are_public"
on public.courses for select to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "admins_manage_courses"
on public.courses for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "published_course_images_are_public"
on public.course_images for select to anon, authenticated
using (
  exists (
    select 1 from public.courses
    where courses.id = course_images.course_id
      and (courses.status = 'published' or public.is_admin())
  )
);

create policy "admins_manage_course_images"
on public.course_images for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "published_chapters_are_public"
on public.chapters for select to anon, authenticated
using (
  exists (
    select 1 from public.courses
    where courses.id = chapters.course_id
      and (courses.status = 'published' or public.is_admin())
  )
);

create policy "admins_manage_chapters"
on public.chapters for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "published_lesson_metadata_is_public"
on public.lessons for select to anon, authenticated
using (
  exists (
    select 1
    from public.chapters
    join public.courses on courses.id = chapters.course_id
    where chapters.id = lessons.chapter_id
      and (courses.status = 'published' or public.is_admin())
  )
);

create policy "admins_manage_lessons"
on public.lessons for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "enrolled_users_read_attachments"
on public.attachments for select to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.lessons
    join public.chapters on chapters.id = lessons.chapter_id
    join public.enrollments on enrollments.course_id = chapters.course_id
    where lessons.id = attachments.lesson_id
      and enrollments.user_id = auth.uid()
      and enrollments.status = 'active'
  )
);

create policy "admins_manage_attachments"
on public.attachments for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users_read_own_enrollments"
on public.enrollments for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "admins_manage_enrollments"
on public.enrollments for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users_manage_own_progress"
on public.lesson_progress for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('course-images', 'course-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('course-files', 'course-files', false, 104857600, null),
  ('course-videos', 'course-videos', false, 1073741824, array['video/mp4', 'video/webm', 'video/quicktime', 'video/x-quicktime', 'application/octet-stream'])
on conflict (id) do nothing;

create policy "public_course_images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'course-images');

create policy "admins_upload_course_assets"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('course-images', 'course-files', 'course-videos')
  and public.is_admin()
);

create policy "admins_update_course_assets"
on storage.objects for update to authenticated
using (
  bucket_id in ('course-images', 'course-files', 'course-videos')
  and public.is_admin()
)
with check (
  bucket_id in ('course-images', 'course-files', 'course-videos')
  and public.is_admin()
);

create policy "admins_delete_course_assets"
on storage.objects for delete to authenticated
using (
  bucket_id in ('course-images', 'course-files', 'course-videos')
  and public.is_admin()
);
