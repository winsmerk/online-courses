create policy "admins_read_private_course_assets"
on storage.objects for select to authenticated
using (
  bucket_id in ('course-files', 'course-videos')
  and public.is_admin()
);
