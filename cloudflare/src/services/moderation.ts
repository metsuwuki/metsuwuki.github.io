const BLOCKED_PATTERNS = [/<\/?[a-z][^>]*>/i, /javascript\s*:/i, /data\s*:\s*text\/html/i];

export const ALLOWED_AVATARS = new Set(["profile", "profile1", "profile2", "profile3", "profile4", "profile5", "profile6", "profile7"]);

type GuestbookValidation =
  | { error: string }
  | { name: string; message: string; avatar: string };

export function validateGuestbook(nameValue: unknown, messageValue: unknown, avatarValue: unknown): GuestbookValidation {
  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  const message = typeof messageValue === "string" ? messageValue.trim() : "";
  const avatar = typeof avatarValue === "string" ? avatarValue : "";
  if (name.length < 2 || name.length > 50) return { error: "Имя должно содержать от 2 до 50 символов." };
  if (message.length < 2 || message.length > 500) return { error: "Сообщение должно содержать от 2 до 500 символов." };
  if (!ALLOWED_AVATARS.has(avatar)) return { error: "Выбран неизвестный аватар." };
  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(name) || pattern.test(message))) return { error: "HTML и исполняемый код запрещены." };
  return { name, message, avatar };
}
