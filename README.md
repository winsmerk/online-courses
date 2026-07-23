# 知序课堂

基于 Next.js、Vercel 与 Supabase 的独立在线课程网站。包含品牌首页、课程列表与详情、学员登录、学习进度、视频与附件，以及管理员课程上传。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

未配置 Supabase 时，网站自动使用演示课程和演示管理员账号，方便直接查看全部页面。

## Supabase 配置

1. 新建 Supabase 项目。
2. 在 SQL Editor 执行：
   - `supabase/migrations/202607230001_initial_schema.sql`
   - 可选执行 `supabase/seed.sql`
3. 在 Authentication 中创建第一个账号。
4. 将该账号升级为管理员：

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = '你的管理员邮箱'
);
```

5. 配置 `.env.local`：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` 只能配置在 Vercel 服务端环境变量中，不能使用 `NEXT_PUBLIC_` 前缀。

## 报名与开课

当前报名采用官方微信人工确认：

1. 管理员在 Supabase Authentication 创建学员账号。
2. 复制学员 UUID 与课程 UUID。
3. 添加报名关系：

```sql
insert into public.enrollments (user_id, course_id)
values ('学员 UUID', '课程 UUID')
on conflict (user_id, course_id)
do update set status = 'active';
```

后续可以在管理员后台增加“创建学员”和“分配课程”界面，无需修改数据库结构。

## Vercel 部署

1. 将仓库推送到 GitHub。
2. 在 Vercel 导入仓库。
3. 添加与 `.env.example` 对应的四个环境变量。
4. 将 `NEXT_PUBLIC_SITE_URL` 改为正式域名。
5. 部署。

生产环境建议使用 Vercel Pro 与 Supabase Pro，并在 Supabase 中开启数据库备份和邮件服务配置。

## 视频说明

当前 MVP 将压缩后的 MP4/WebM 上传到私有 `course-videos` Bucket，学习页面使用短时签名 URL 播放。视频数量或观看量增长后，可将 `lessons.video_path` 替换为 Cloudflare Stream/Mux 的视频 ID，页面结构无需重做。
