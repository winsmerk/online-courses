insert into public.courses (
  id, slug, title, subtitle, description, cover_url, instructor, category,
  level, duration_minutes, status
) values (
  '11111111-1111-4111-8111-111111111111',
  'personal-brand-system',
  '从专业到影响力：个人品牌系统课',
  '找到清晰定位，用稳定表达建立长期可信度。',
  '这是一门为专业人士设计的系统课程。你将从定位、内容结构到传播节奏，搭建一套可以长期运行的个人品牌系统。',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85',
  '林知遥',
  '品牌策略',
  '进阶',
  280,
  'published'
) on conflict (id) do nothing;

insert into public.chapters (id, course_id, title, sort_order) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111111', '第一章｜找到你的专业坐标', 1),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-1111-4111-8111-111111111111', '第二章｜建立内容表达系统', 2)
on conflict (id) do nothing;

insert into public.lessons (
  id, chapter_id, slug, title, description, duration_minutes, is_preview, sort_order
) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'why-personal-brand', '为什么专业能力需要被看见', '理解个人品牌的本质，并识别你已经拥有的专业资产。', 18, true, 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'positioning', '提炼差异化定位', '从服务对象、关键问题和独特方法三个维度完成定位。', 32, false, 2),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'content-pillars', '设计你的三条内容主线', '让选题不再依靠灵感，而是持续积累品牌认知。', 36, false, 1)
on conflict (id) do nothing;
