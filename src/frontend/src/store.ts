import type {
  Commission,
  PaymentStatus,
  User,
  UserStatus,
  Video,
} from "./types";

const USERS_KEY = "tm11_users";
const COMMISSIONS_KEY = "tm11_commissions";
const VIDEOS_KEY = "tm11_videos";
const CURRENT_USER_KEY = "tm11_current_user";
const INITIALIZED_KEY = "tm11_initialized";

const SAMPLE_VIDEOS: Video[] = [
  // Tutorial
  {
    id: "v1",
    title: "How to Register on TM11 PrimeTime",
    category: "Tutorial",
    url: "#",
    thumbnail: "https://picsum.photos/seed/tut1/320/180",
    description:
      "Step-by-step guide to register and activate your TM11 account.",
  },
  {
    id: "v2",
    title: "How to Share Your Referral Code",
    category: "Tutorial",
    url: "#",
    thumbnail: "https://picsum.photos/seed/tut2/320/180",
    description:
      "Learn how to share your referral code via WhatsApp and grow your network.",
  },
  // Tourism
  {
    id: "v3",
    title: "Explore God's Own Country — Kerala",
    category: "Tourism",
    url: "#",
    thumbnail: "https://picsum.photos/seed/tour1/320/180",
    description:
      "Discover the breathtaking backwaters, spices, and culture of Kerala.",
  },
  {
    id: "v4",
    title: "Rajasthan Heritage Tour",
    category: "Tourism",
    url: "#",
    thumbnail: "https://picsum.photos/seed/tour2/320/180",
    description:
      "A grand journey through forts, palaces, and the golden Thar Desert.",
  },
  // Devotional
  {
    id: "v5",
    title: "Morning Prayer & Meditation",
    category: "Devotional",
    url: "#",
    thumbnail: "https://picsum.photos/seed/dev1/320/180",
    description:
      "Start your day with peace and divine energy through guided morning prayers.",
  },
  {
    id: "v6",
    title: "Sacred Temple Tour of India",
    category: "Devotional",
    url: "#",
    thumbnail: "https://picsum.photos/seed/dev2/320/180",
    description:
      "Visit the most revered temples across India — a spiritual pilgrimage.",
  },
  // Entertainment
  {
    id: "v7",
    title: "Best Comedy Show Highlights 2025",
    category: "Entertainment",
    url: "#",
    thumbnail: "https://picsum.photos/seed/ent1/320/180",
    description:
      "Top hilarious moments that will leave you in splits — pure joy!",
  },
  {
    id: "v8",
    title: "Grand Dance Performance Showcase",
    category: "Entertainment",
    url: "#",
    thumbnail: "https://picsum.photos/seed/ent2/320/180",
    description:
      "Stunning classical and contemporary dance performances from top artists.",
  },
  // Education
  {
    id: "v9",
    title: "Financial Literacy for Beginners",
    category: "Education",
    url: "#",
    thumbnail: "https://picsum.photos/seed/edu1/320/180",
    description:
      "Master the basics of saving, investing, and growing your wealth.",
  },
  {
    id: "v10",
    title: "Health & Wellness Fundamentals",
    category: "Education",
    url: "#",
    thumbnail: "https://picsum.photos/seed/edu2/320/180",
    description:
      "Science-backed tips for a healthier, longer, and more energetic life.",
  },
  // Wellness
  {
    id: "v11",
    title: "Morning Yoga for Energy & Balance",
    category: "Wellness",
    url: "#",
    thumbnail: "https://picsum.photos/seed/well1/320/180",
    description:
      "20-minute morning yoga flow to energize your body and calm your mind.",
  },
  {
    id: "v12",
    title: "Deep Mindfulness Meditation Guide",
    category: "Wellness",
    url: "#",
    thumbnail: "https://picsum.photos/seed/well2/320/180",
    description:
      "A guided mindfulness session to reduce stress and find inner peace.",
  },
];

const SAMPLE_USERS: User[] = [
  {
    id: "u1",
    name: "Ravi Kumar",
    mobile: "9876543210",
    email: "ravi@example.com",
    referralCode: "RAVI01",
    referredBy: null,
    status: "approved",
    paymentStatus: "confirmed",
    utrNumber: "UTR987654321",
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    commissionBalance: 10,
    matrixLevel: 1,
  },
  {
    id: "u2",
    name: "Priya Sharma",
    mobile: "9876543211",
    email: "priya@example.com",
    referralCode: "PRIY02",
    referredBy: "RAVI01",
    status: "pending",
    paymentStatus: "pending",
    utrNumber: "UTR123456789",
    joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    commissionBalance: 0,
    matrixLevel: null,
  },
];

export function initializeStore(): void {
  if (localStorage.getItem(INITIALIZED_KEY)) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(SAMPLE_USERS));
  localStorage.setItem(COMMISSIONS_KEY, JSON.stringify([]));
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(SAMPLE_VIDEOS));
  localStorage.setItem(INITIALIZED_KEY, "true");
}

export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCommissions(): Commission[] {
  const raw = localStorage.getItem(COMMISSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCommissions(commissions: Commission[]): void {
  localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(commissions));
}

export function getVideos(): Video[] {
  const raw = localStorage.getItem(VIDEOS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveVideos(videos: Video[]): void {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(id: string | null): void {
  if (id) {
    localStorage.setItem(CURRENT_USER_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const users = getUsers();
  const existing = new Set(users.map((u) => u.referralCode));
  let code: string;
  do {
    code = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  } while (existing.has(code));
  return code;
}

export function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(updated: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
    saveUsers(users);
  }
}

export function removeUser(id: string): void {
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
}

export function approveUser(userId: string): void {
  const users = getUsers();
  const userIdx = users.findIndex((u) => u.id === userId);
  if (userIdx === -1) return;

  const user = { ...users[userIdx] };
  user.status = "approved" as UserStatus;
  if (user.paymentStatus === "pending") {
    user.paymentStatus = "confirmed" as PaymentStatus;
  }

  // Find referrer chain and assign matrix level
  let referrerLevel = 0;
  if (user.referredBy) {
    const referrer = users.find((u) => u.referralCode === user.referredBy);
    if (referrer) {
      referrerLevel = referrer.matrixLevel ?? 1;
    }
  }
  user.matrixLevel = Math.min(referrerLevel + 1, 3);

  users[userIdx] = user;
  saveUsers(users);

  // Credit commissions up the referral chain
  const commissions = getCommissions();
  const COMMISSION_AMOUNTS = [10, 5, 3];
  let currentRef = user.referredBy;

  for (let level = 0; level < 3 && currentRef; level++) {
    const ancestor = users.find((u) => u.referralCode === currentRef);
    if (!ancestor) break;

    const amount = COMMISSION_AMOUNTS[level];
    commissions.push({
      id: generateId(),
      toUserId: ancestor.id,
      fromUserId: user.id,
      level: level + 1,
      amount,
      date: new Date().toISOString(),
    });

    // Update ancestor's commission balance in users array
    const ancestorIdx = users.findIndex((u) => u.id === ancestor.id);
    if (ancestorIdx !== -1) {
      users[ancestorIdx] = {
        ...users[ancestorIdx],
        commissionBalance: (users[ancestorIdx].commissionBalance ?? 0) + amount,
      };
    }

    currentRef = ancestor.referredBy;
  }

  saveUsers(users);
  saveCommissions(commissions);
}

export function getUserCommissions(userId: string): Commission[] {
  return getCommissions().filter((c) => c.toUserId === userId);
}

export interface MatrixNode {
  user: User | null;
  children: MatrixNode[];
}

export function buildMatrixTree(rootUserId: string, depth = 0): MatrixNode {
  if (depth >= 3) {
    return { user: null, children: [] };
  }

  const users = getUsers();
  const root = users.find((u) => u.id === rootUserId);
  if (!root) return { user: null, children: [] };

  const directReferrals = users
    .filter((u) => u.referredBy === root.referralCode)
    .slice(0, 3);

  const children: MatrixNode[] = directReferrals.map((child) =>
    buildMatrixTree(child.id, depth + 1),
  );

  // Pad to 3 children
  while (children.length < 3) {
    children.push({ user: null, children: [] });
  }

  return { user: root, children };
}
