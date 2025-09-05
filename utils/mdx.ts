// Function to sanitize markdown content to prevent parsing errors
export const sanitizeMarkdown = (content: string): string => {
  if (!content) return "";

  try {
    // Fix common markdown parsing issues
    let sanitized = content;

    // Fix code blocks without language specification
    sanitized = sanitized.replace(/```(\s*\n)/g, "```txt$1");

    // Fix malformed code blocks
    sanitized = sanitized.replace(
      /```(\w*)\s*\n([\s\S]*?)```/g,
      (match, lang, code) => {
        const cleanLang = lang || "txt";

        return `\`\`\`${cleanLang}\n${code}\`\`\``;
      }
    );

    // Remove any problematic characters that might cause parsing issues
    sanitized = sanitized.replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    );

    return sanitized;
  } catch (error) {
    console.error("Error sanitizing markdown:", error);

    // Return a safe fallback
    return "# Content Error\n\nThere was an issue loading the content. Please edit in source mode to fix any formatting issues.";
  }
};