export const SITE_NAME = "Stream CMS";
export const SITE_DESCRIPTION = "B2B 影音內容管理平台";

export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

export const VIDEO_STATUSES = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已發布" },
  { value: "archived", label: "已封存" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "首頁" },
  { href: "/videos", label: "影片" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/videos", label: "影片管理" },
] as const;
