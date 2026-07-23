update storage.buckets
set allowed_mime_types = array[
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-quicktime',
  'application/octet-stream'
]
where id = 'course-videos';
