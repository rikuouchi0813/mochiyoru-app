import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { groupId } = req.query;

  console.log("Group update API called:", { groupId, method: req.method });

  if (!groupId) {
    return res.status(400).json({ error: "Group ID is required" });
  }

  // GET: グループ情報取得
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("group_id", groupId)
        .single();

      if (error) {
        console.error("Supabase select error:", error);
        return res.status(404).json({ error: "Group not found" });
      }

      return res.status(200).json({
        groupId: data.group_id,
        groupName: data.group_name,
        members: data.members,
        createdAt: data.created_at,
      });
    } catch (err) {
      console.error("GET group error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // POST: グループ情報更新（編集モード用）
  if (req.method === "POST") {
    const { groupName, members } = req.body;

    if (!groupName || !Array.isArray(members)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    try {
      const { error } = await supabase
        .from("groups")
        .update({
          group_name: groupName,
          members: members,
        })
        .eq("group_id", groupId);

      if (error) {
        console.error("Supabase update error:", error);
        return res.status(500).json({ error: "Failed to update group" });
      }

      console.log("Group updated successfully:", {
        groupId,
        groupName,
        members,
      });
      return res.status(200).json({
        message: "Group updated successfully",
        groupId: groupId,
        groupName: groupName,
        members: members,
      });
    } catch (err) {
      console.error("Update group error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // その他のメソッド
  return res.status(405).json({ error: "Method not allowed" });
}
