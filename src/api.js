import {siteContentDefaults} from "./data";

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const sampleImage = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80";
const sampleArticles = [
  {
    id: "demo-ev-market-outlook",
    category: "MARKET",
    title: "India's electric mobility transition",
    excerpt: "A sample story preview for the frontend-only Humans of EV experience.",
    body: "This is demonstration content for the frontend UI only.\n\nConnect a publishing service to use real newsroom stories.",
    author: "Humans of EV Demo",
    readTime: "4 min read",
    time: "4 min read",
    image: sampleImage,
    placements: "[]",
    status: "published",
    accessLevel: "free",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-battery-innovation",
    category: "BATTERY",
    title: "Inside the next generation of battery innovation",
    excerpt: "An illustrative article card showing how editorial content appears across the site.",
    body: "This is demonstration content for the frontend UI only.\n\nNo article data is being loaded from a server.",
    author: "Humans of EV Demo",
    readTime: "6 min read",
    time: "6 min read",
    image: sampleImage,
    placements: "[]",
    status: "published",
    accessLevel: "free",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-charging-network",
    category: "CHARGING",
    title: "Building a more connected charging network",
    excerpt: "Sample content for checking the news listing and article-detail layouts.",
    body: "This is demonstration content for the frontend UI only.\n\nSubmissions and edits are not saved.",
    author: "Humans of EV Demo",
    readTime: "5 min read",
    time: "5 min read",
    image: sampleImage,
    placements: "[]",
    status: "published",
    accessLevel: "free",
    createdAt: new Date().toISOString()
  }
];

const clone = (value) => JSON.parse(JSON.stringify(value));
let siteContent = clone(siteContentDefaults);
let articles = clone(sampleArticles);
let managedContent = { podcast: [], video: [], magazine: [], cxo: [] };
let adminUser = null;
let profile = { email: "", recoveryEmail: "", recoveryPhone: "", recoveryEmailVerifiedAt: null, recoveryPhoneVerifiedAt: null };
let admins = [];
let nextId = 1;

function readBody(body) {
  if (body instanceof FormData) return body;
  if (typeof body !== "string") return body || {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function requireAdmin() {
  if (!adminUser) throw new ApiError("Demo admin sign-in is required.", 401);
}

function articleForPublic(article) {
  return { ...article, time: article.time || article.readTime || "5 min read" };
}

function getSummary() {
  const count = (kind) => {
    const items = managedContent[kind] || [];
    return { kind, total: items.length, published: items.filter((item) => item.status === "published").length, drafts: items.filter((item) => item.status !== "published").length };
  };
  const published = articles.filter((article) => article.status === "published").length;
  return {
    articles: { total: articles.length, published, drafts: articles.length - published },
    enquiries: { total: 0, new: 0 },
    managedContent: ["podcast", "video", "magazine", "cxo"].map(count)
  };
}

function createArticle(input) {
  const article = {
    ...input,
    id: nextId++,
    time: input.readTime || "5 min read",
    createdAt: new Date().toISOString()
  };
  articles = [article, ...articles];
  return article;
}

function createManagedItem(kind, input) {
  const item = { ...input, id: nextId++, kind, createdAt: new Date().toISOString() };
  managedContent[kind] = [item, ...(managedContent[kind] || [])];
  return item;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = readBody(options.body);
  const cleanPath = path.split("?")[0];

  if (cleanPath === "/api/status") return { localDemoMode: true };
  if (cleanPath === "/api/site-content" && method === "GET") return { content: clone(siteContent) };
  if (cleanPath === "/api/articles" && method === "GET") return { articles: articles.filter((item) => item.status === "published").map(articleForPublic) };
  if (cleanPath.startsWith("/api/articles/") && method === "GET") {
    const id = decodeURIComponent(cleanPath.slice("/api/articles/".length));
    const article = articles.find((item) => String(item.id) === id && item.status === "published");
    if (!article) throw new ApiError("This sample article is not available.", 404);
    return { article: articleForPublic(article) };
  }
  if (cleanPath.startsWith("/api/content/") && method === "GET") {
    const kind = cleanPath.slice("/api/content/".length);
    const items = (managedContent[kind] || []).filter((item) => item.status === "published");
    return { items };
  }

  if (cleanPath === "/api/auth/csrf") return { csrfToken: "frontend-demo" };
  if (cleanPath === "/api/auth/login" || cleanPath === "/api/auth/signup") {
    const email = String(body.email || "").trim();
    if (!email) throw new ApiError("Enter an email address.");
    adminUser = { id: 1, email, role: "owner" };
    profile = { ...profile, email };
    if (!admins.length) admins = [{ ...adminUser, createdAt: new Date().toISOString() }];
    return { user: adminUser };
  }
  if (cleanPath === "/api/admin/session" && method === "GET") {
    requireAdmin();
    return { user: adminUser };
  }
  if (cleanPath === "/api/auth/logout" && method === "POST") {
    adminUser = null;
    return null;
  }
  if (cleanPath === "/api/admin/recovery/request") return { message: "Frontend demo only: no recovery message was sent. No information was saved." };
  if (cleanPath === "/api/admin/recovery/reset") throw new ApiError("Password recovery is not available in the frontend-only demo.", 501);

  if (cleanPath.startsWith("/api/admin/")) requireAdmin();
  if (cleanPath === "/api/admin/summary") return getSummary();
  if (cleanPath === "/api/admin/articles") {
    if (method === "GET") return { articles: clone(articles) };
    if (method === "POST") return { article: createArticle(body) };
  }
  const articleId = cleanPath.match(/^\/api\/admin\/articles\/([^/]+)$/);
  if (articleId) {
    const index = articles.findIndex((item) => String(item.id) === articleId[1]);
    if (index < 0) throw new ApiError("Article not found.", 404);
    if (method === "PUT") {
      articles[index] = { ...articles[index], ...body, time: body.readTime || articles[index].time };
      return { article: articles[index] };
    }
    if (method === "DELETE") {
      articles = articles.filter((item) => String(item.id) !== articleId[1]);
      return null;
    }
  }
  if (cleanPath === "/api/admin/site-content" && method === "GET") return { content: clone(siteContent) };
  const siteSection = cleanPath.match(/^\/api\/admin\/site-content\/([^/]+)$/);
  if (siteSection && method === "PUT") {
    const section = siteSection[1];
    siteContent = { ...siteContent, [section]: clone(body.content) };
    return { section, content: clone(siteContent[section]) };
  }
  const managedCollection = cleanPath.match(/^\/api\/admin\/content\/([^/]+)$/);
  if (managedCollection) {
    const kind = managedCollection[1];
    if (method === "GET") return { items: clone(managedContent[kind] || []) };
    if (method === "POST") return { item: createManagedItem(kind, body) };
  }
  const managedItem = cleanPath.match(/^\/api\/admin\/content\/([^/]+)\/([^/]+)$/);
  if (managedItem) {
    const [, kind, id] = managedItem;
    const items = managedContent[kind] || [];
    const index = items.findIndex((item) => String(item.id) === id);
    if (index < 0) throw new ApiError("Content item not found.", 404);
    if (method === "PUT") {
      items[index] = { ...items[index], ...body };
      return { item: items[index] };
    }
    if (method === "DELETE") {
      managedContent[kind] = items.filter((item) => String(item.id) !== id);
      return null;
    }
  }
  if (cleanPath === "/api/admin/enquiries" && method === "GET") return { enquiries: [] };
  if (cleanPath === "/api/admin/newsletter-subscribers" && method === "GET") return { subscribers: [] };
  if (cleanPath === "/api/admin/team" && method === "GET") return { admins: clone(admins) };
  if (cleanPath === "/api/admin/team" && method === "POST") {
    const admin = { id: nextId++, email: body.email, role: body.role, createdAt: new Date().toISOString() };
    admins.push(admin);
    return { admin };
  }
  const teamRole = cleanPath.match(/^\/api\/admin\/team\/([^/]+)\/role$/);
  if (teamRole && method === "PATCH") {
    const admin = admins.find((item) => String(item.id) === teamRole[1]);
    if (admin) admin.role = body.role;
    return { admin };
  }
  const teamMember = cleanPath.match(/^\/api\/admin\/team\/([^/]+)$/);
  if (teamMember && method === "DELETE") {
    admins = admins.filter((item) => String(item.id) !== teamMember[1]);
    return null;
  }
  if (cleanPath === "/api/admin/profile" && method === "GET") return { profile: { ...profile } };
  if (cleanPath === "/api/admin/profile" && method === "PUT") {
    profile = { ...profile, recoveryEmail: body.recoveryEmail, recoveryPhone: body.recoveryPhone };
    return { profile: { ...profile } };
  }
  if (cleanPath.startsWith("/api/admin/profile/recovery/") && cleanPath.endsWith("/request-verification")) {
    return { message: "Frontend demo only: no verification code was sent." };
  }
  if (cleanPath.startsWith("/api/admin/profile/recovery/") && cleanPath.endsWith("/verify")) return { verified: true };
  if (cleanPath === "/api/admin/profile/password" && method === "POST") return { changed: true };
  if (cleanPath === "/api/admin/uploads/images" || cleanPath === "/api/admin/uploads/media") {
    const file = body.get?.("image") || body.get?.("media");
    if (!file) throw new ApiError("Choose a file first.");
    const url = URL.createObjectURL(file);
    return cleanPath.endsWith("/images") ? { image: { url } } : { media: { url } };
  }
  if (cleanPath === "/api/contact" && method === "POST") {
    return { notification: { simulated: true, adminNotified: false, senderAcknowledged: false } };
  }
  if (cleanPath === "/api/newsletter/subscribe" && method === "POST") {
    return { simulated: true, subscribed: true, emailSent: false };
  }
  if (cleanPath.startsWith("/api/admin/enquiries/") || cleanPath.startsWith("/api/admin/newsletter-subscribers/")) return null;
  if (cleanPath === "/api/member/payment-config") return { razorpayEnabled: false };
  if (cleanPath === "/api/member/checkout" || cleanPath === "/api/member/checkout/verify") {
    throw new ApiError("Payments are not available in the frontend-only demo.", 501);
  }

  throw new ApiError(`No frontend demo handler is defined for ${method} ${cleanPath}.`, 404);
}
