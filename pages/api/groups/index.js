// pages/api/groups/index.js
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { groupName, members } = req.body;

  if (!groupName || !Array.isArray(members)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const groupId = uuidv4();

  try {
    // Supabaseのgroupsテーブルに保存
    const { data, error } = await supabase
      .from("groups")
      .insert([
        {
          group_id: groupId,
          group_name: groupName,
          members: members, // jsonb型で保存
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to create group" });
    }

    res.status(200).json({ groupId });
  } catch (err) {
    console.error("Failed to save group:", err);
    res.status(500).json({ error: "Failed to save group" });
  }
}
