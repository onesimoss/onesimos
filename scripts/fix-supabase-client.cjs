const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "..", "lib", "supabase");
const filePath = path.join(dirPath, "client.ts");

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const clientCode = `import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
`;

fs.writeFileSync(filePath, clientCode, "utf8");
console.log("Successfully created lib/supabase/client.ts");
