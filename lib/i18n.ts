export type Locale = "zh" | "en";

export const LOCALE_COOKIE = "beyond_wild_locale";

const english: Record<string, string> = {
  首页: "Home",
  全部课程: "All courses",
  微信报名: "WeChat enrollment",
  管理中心: "Admin center",
  我的学习: "My learning",
  登录: "Log in",
  账号登录: "Account login",
  报名方式: "Enrollment",
  退出登录: "Log out",
  课程管理: "Course management",
  学员管理: "Student management",
  管理员账号: "Admin accounts",
  账号设置: "Account settings",
  返回首页: "Back to home",
  学员中心导航: "Learning center navigation",
  主导航: "Main navigation",
  页面加载中: "Loading page",
  "把经验变成方法，把学习变成能力。":
    "Turn experience into methods, and learning into capability.",
  "与真正做过、想清楚、讲明白的人一起学习。用系统课程跨过试错，建立属于自己的专业路径。":
    "Learn with people who have done the work, thought it through, and can explain it clearly. Build your own professional path through structured courses.",
  探索课程: "Explore courses",
  添加微信报名: "Enroll via WeChat",
  讲师与课程: "Instructors and courses",
  品牌策略讲师: "Brand strategy instructor",
  "把专业沉淀成长期影响力": "Turn expertise into lasting influence",
  品牌策略: "Brand strategy",
  "AI 效率讲师": "AI productivity instructor",
  "让 AI 成为可靠的工作伙伴": "Make AI a reliable work partner",
  "AI 工作流": "AI workflow",
  沟通表达讲师: "Communication instructor",
  "把复杂的想法讲得清楚": "Explain complex ideas with clarity",
  沟通表达: "Communication",
  "专注可以被实践、验证与复用的知识":
    "Knowledge designed to be practiced, tested, and reused",
  系统: "Structured",
  不堆砌碎片知识: "No fragmented information",
  实战: "Practical",
  来自真实项目经验: "Built from real project experience",
  长期: "Long-term",
  随时回看持续学习: "Revisit and keep learning anytime",
  "从一个关键问题开始，完成一次真正的成长。":
    "Start with one important question and make meaningful progress.",
  "每门课程都围绕真实目标设计，用清晰章节、视频讲解与练习资料陪你完成学习。":
    "Every course is designed around a real goal, with clear chapters, video lessons, and practical resources.",
  "按自己的节奏，完成有结构的学习。":
    "Learn at your own pace with a clear structure.",
  看得懂: "Understand clearly",
  "每个复杂主题都被拆成清晰章节，并配合真实案例讲解。":
    "Complex topics are broken into clear chapters and explained through real examples.",
  做得出: "Put it into practice",
  "课程附件、行动清单与练习，帮助知识真正进入工作。":
    "Resources, action lists, and exercises help turn knowledge into real work.",
  看得到: "Track progress",
  "自动记录学习进度，清楚知道待学习、学习中与已完成。":
    "Progress is saved automatically, so you always know what is not started, in progress, or completed.",
  准备好开始了吗: "Ready to begin?",
  "准备好开始了吗？": "Ready to begin?",
  "添加官方微信，告诉我们你感兴趣的课程。确认报名后，我们会为你开通学习账号。":
    "Add our official WeChat and tell us which course interests you. We will create your learning account after enrollment is confirmed.",
  人工确认课程与账号: "Course and account confirmed by our team",
  官方微信二维码: "Official WeChat QR code",
  "把真实经验整理成清晰方法，让每一次学习都能沉淀为长期能力。":
    "Turn real experience into clear methods, so every lesson builds lasting capability.",
  保留所有权利: "All rights reserved",
  查看课程: "View course",
  节课: "lessons",
  小时: "hours",
  "选择一个值得投入的方向，开始系统学习。":
    "Choose a direction worth investing in and start learning systematically.",
  "每门课都提供清晰章节、视频讲解和课程附件，登录后自动保存学习进度。":
    "Every course includes clear chapters, video lessons, and downloadable resources. Your progress is saved after login.",
  课程分类: "Course categories",
  "AI 效率": "AI productivity",
  "课程正在准备中，敬请期待。": "New courses are being prepared. Stay tuned.",
  "添加官方微信，确认课程并开通账号。":
    "Add our official WeChat to confirm your course and activate your account.",
  "目前采用人工报名方式。添加微信时请备注“课程报名”，我们会协助你选择课程并完成账号开通。":
    'Enrollment is currently handled manually. Add us on WeChat with the note "Course enrollment", and we will help you select a course and activate your account.',
  添加官方微信: "Add official WeChat",
  "扫描右侧二维码，添加时备注“课程报名”。":
    'Scan the QR code and add the note "Course enrollment".',
  确认课程与身份: "Confirm course and identity",
  "告诉我们你想学习的课程，客服会确认报名信息。":
    "Tell us which course you want to study and our team will confirm your enrollment.",
  收到账号开始学习: "Receive your account and start learning",
  "账号开通后即可登录，课程会自动出现在学员中心。":
    "Once activated, log in and your courses will appear automatically in the learning center.",
  替换为官方微信二维码: "Official WeChat QR code",
  "服务时间：周一至周五 10:00–18:00":
    "Service hours: Monday–Friday, 10:00–18:00",
  已有账号直接登录: "Already have an account? Log in",
  "已有账号，直接登录": "Already have an account? Log in",
  "继续学习，让每一步都有积累。":
    "Keep learning and make every step count.",
  "系统课程 · 随时回看 · 自动保存进度":
    "Structured courses · Learn anytime · Automatic progress",
  登录学习账号: "Log in to your learning account",
  "请输入管理员为你开通的邮箱和密码。":
    "Enter the email and password created for you by an administrator.",
  邮箱: "Email",
  密码: "Password",
  输入密码: "Enter password",
  进入演示账号: "Enter demo account",
  "还没有账号？请前往": "Don't have an account? Go to the",
  微信报名页面: "WeChat enrollment page",
  "，由管理员确认后开通。": " and an administrator will activate it for you.",
  "你好，{name}": "Hello, {name}",
  "继续今天的学习，把一点进步积累成长期能力。":
    "Continue learning today and turn small steps into lasting capability.",
  我的课程: "My courses",
  学习中: "In progress",
  已完成: "Completed",
  待学习: "Not started",
  全部课程权限: "All course access",
  "已完成 {progress}%": "{progress}% completed",
  继续学习: "Continue",
  开始学习: "Start learning",
  "学习状态：{status}": "Learning status: {status}",
  学习数据: "Learning statistics",
  官方微信: "Official WeChat",
  "更新显示名称或修改登录密码。":
    "Update your display name or change your login password.",
  基本信息: "Profile information",
  显示名称: "Display name",
  登录邮箱: "Login email",
  修改密码: "Change password",
  "不需要修改密码时保持为空即可。":
    "Leave these fields blank if you do not want to change your password.",
  新密码: "New password",
  确认新密码: "Confirm new password",
  至少8位: "At least 8 characters",
  "至少 8 位": "At least 8 characters",
  再次输入新密码: "Enter the new password again",
  保存账号设置: "Save account settings",
  "两次输入的新密码不一致。": "The two new passwords do not match.",
  "账号服务尚未配置。": "Account service is not configured.",
  "账号信息已保存。": "Account settings saved.",
  "确认退出登录？": "Log out?",
  "退出后需要重新输入邮箱和密码才能进入学习与管理中心。":
    "You will need to enter your email and password again to access the learning and admin centers.",
  取消: "Cancel",
  确认退出: "Log out",
  返回我的学习: "Back to my learning",
  课程视频: "Course video",
  管理员上传视频后将在这里播放:
    "The video will appear here after it is uploaded by an administrator.",
  课程附件: "Course resources",
  下载: "Download",
  标记为已完成: "Mark as completed",
  课程目录: "Course curriculum",
  第: "Chapter",
  章: "",
  分钟: "min",
  关于这门课程: "About this course",
  试看: "Preview",
  你将获得: "What you will get",
  结构清晰的视频课程: "Clearly structured video lessons",
  配套文档与练习附件: "Supporting documents and exercises",
  永久记录学习进度: "Persistent learning progress",
  随时回看按自己的节奏学习: "Learn anytime at your own pace",
  "随时回看，按自己的节奏学习": "Learn anytime at your own pace",
  咨询并报名: "Ask and enroll",
  课程数量: "Courses",
  已发布: "Published",
  总课时: "Total lessons",
  新建课程: "New course",
  "创建课程、组织章节并上传视频。":
    "Create courses, organize chapters, and upload videos.",
  "课程已成功更新。": "Course updated successfully.",
  "课程已成功创建。": "Course created successfully.",
  草稿: "Draft",
  个章节: "chapters",
  编辑: "Edit",
  查看详情: "View details",
  "创建普通学员账号，并为每位学员分配一门或多门课程。":
    "Create student accounts and assign one or more courses to each student.",
  "创建后台管理员账号，并在需要时重设密码。":
    "Create admin accounts and reset passwords when needed.",
  创建管理员账号: "Create admin account",
  "管理员可以管理课程与学员。邮箱会自动确认，不发送注册邮件。":
    "Administrators can manage courses and students. Email is confirmed automatically and no registration email is sent.",
  姓名: "Name",
  "例如：陈默": "e.g. Alex Chen",
  初始密码: "Initial password",
  创建账号: "Create account",
  管理员列表: "Administrators",
  刷新: "Refresh",
  用户: "User",
  角色: "Role",
  创建时间: "Created",
  操作: "Actions",
  管理员: "Administrator",
  普通学员: "Student",
  重设密码: "Reset password",
  确认重设: "Reset password",
  账号列表加载失败: "Failed to load accounts",
  账号创建失败: "Failed to create account",
  "账号已创建，用户可立即使用邮箱和密码登录。":
    "Account created. The user can log in immediately with their email and password.",
  密码重设失败: "Failed to reset password",
  "已重设 {email} 的密码。": "Password reset for {email}.",
  创建学员账号: "Create student account",
  "账号创建后邮箱会自动确认，学员可使用邮箱和初始密码登录。":
    "Email is confirmed automatically. The student can log in with their email and initial password.",
  创建学员: "Create student",
  搜索姓名或邮箱: "Search name or email",
  搜索学员: "Search students",
  刷新学员列表: "Refresh student list",
  暂无符合条件的学员: "No matching students.",
  "暂无符合条件的学员。": "No matching students.",
  "已分配 {count} 门课程": "{count} courses assigned",
  课程: "Course",
  尚未分配课程: "No courses assigned",
  分配课程: "Assign courses",
  "已选择 {count} 门": "{count} selected",
  "暂无已发布课程，请先发布课程。":
    "No published courses. Publish a course first.",
  保存分配: "Save assignments",
  重设学员密码: "Reset student password",
  学员列表加载失败: "Failed to load students",
  学员账号创建失败: "Failed to create student account",
  "学员账号已创建，可立即分配课程。":
    "Student account created. You can assign courses now.",
  课程分配失败: "Failed to assign courses",
  "已更新 {name} 的课程权限。": "Course access updated for {name}.",
  编辑课程: "Edit course",
  "修改课程信息、章节、视频和附件。":
    "Edit course information, chapters, videos, and resources.",
  "填写课程信息，并按章节上传视频内容。":
    "Enter course information and upload video lessons by chapter.",
  课程名称: "Course title",
  "URL 标识": "URL slug",
  讲师: "Instructor",
  分类: "Category",
  难度: "Level",
  入门: "Beginner",
  进阶: "Advanced",
  通用: "All levels",
  状态: "Status",
  发布: "Published",
  一句话简介: "Short description",
  "课程介绍图片（可多选）": "Course introduction images (multiple)",
  "当前已有 {count} 张介绍图片；重新选择后将整体替换。":
    "{count} introduction images uploaded. Selecting new images will replace all of them.",
  "已上传的课程介绍图片 {index}": "Uploaded introduction image {index}",
  "已上传图片 {index}": "Uploaded image {index}",
  课程介绍: "Course description",
  "支持多段文字。课程介绍图片可作为课程封面和后续内容区扩展。":
    "Multiple paragraphs are supported. Introduction images can extend the cover and content sections.",
  课程封面: "Course cover",
  "未选择新图片时保留当前课程封面。":
    "The current cover will be kept if no new image is selected.",
  课程封面预览: "Course cover preview",
  当前课程封面: "Current course cover",
  课程章节: "Course chapters",
  "每个章节可添加多个视频课时。":
    "Each chapter can contain multiple video lessons.",
  "第 {index} 章标题": "Chapter {index} title",
  删除章节: "Delete chapter",
  "课时 {index} 标题": "Lesson {index} title",
  "时长（分钟）": "Duration (minutes)",
  课时说明: "Lesson description",
  "课程附件（文档或压缩包，可多选）":
    "Course resources (documents or archives, multiple)",
  "已保留：": "Kept:",
  视频文件: "Video file",
  "未选择新视频时保留当前视频。":
    "The current video will be kept if no new video is selected.",
  添加课时: "Add lesson",
  添加章节: "Add chapter",
  "正在上传并保存…": "Uploading and saving…",
  保存修改: "Save changes",
  保存课程: "Save course",
  "正在加载已上传的视频…": "Loading uploaded video…",
  已上传视频: "Uploaded video",
  "若当前浏览器无法播放 MOV，仍可正常上传保存。":
    "If this browser cannot play MOV files, the file can still be uploaded and saved.",
  "演示模式不会写入数据。配置 Supabase 后即可创建课程。":
    "Demo mode does not save data. Configure Supabase to create courses.",
  "正在上传视频：{name}": "Uploading video: {name}",
  课程保存失败: "Failed to save course",
  "保存失败，请重试": "Save failed. Please try again.",
  无权执行此操作: "You do not have permission to perform this action",
  账号信息不完整: "Account information is incomplete",
  密码信息不完整: "Password information is incomplete",
  提交信息不完整: "Submitted information is incomplete",
  只能分配已发布的课程: "Only published courses can be assigned",
  数据加载失败: "Failed to load data",
  学员数据加载失败: "Failed to load student data",
  课程数据不完整: "Course data is incomplete",
  "Supabase 尚未配置": "Supabase is not configured",
  登录状态已失效请重新登录: "Your session has expired. Please log in again.",
  "登录状态已失效，请重新登录": "Your session has expired. Please log in again.",
  正在加载: "Loading",
  正在加载管理中心: "Loading admin center",
  "页面加载中，请稍候…": "Loading, please wait…",
  "当前为演示模式：配置 Supabase 环境变量后将自动切换为真实数据与账号。":
    "Demo mode is active. Configure Supabase to use live data and accounts.",
  服务尚未配置: "Service is not configured",
  邮箱或密码不正确: "Incorrect email or password",
  中文: "中文",
  English: "English",
  切换到英文: "Switch to English",
  切换到中文: "Switch to Chinese",
  选择语言: "Select language",
};

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "zh";
}

export function translate(
  locale: Locale,
  key: string,
  variables?: Record<string, string | number>,
) {
  let value = locale === "en" ? english[key] ?? key : key;
  for (const [name, replacement] of Object.entries(variables ?? {})) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}
