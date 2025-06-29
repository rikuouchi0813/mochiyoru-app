// pages/api/groups/[groupId]/items.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  console.log("=== API Route Called ===");
  console.log("Method:", req.method);
  console.log("Query:", req.query);
  console.log("Body:", req.body);

  const {
    query: { groupId },
    method,
    body,
  } = req;

  if (!groupId) {
    console.error("No groupId provided");
    return res.status(400).json({ error: "no groupId" });
  }

  // 取得 -----------------------------------------------------
  if (method === "GET") {
    try {
      console.log("GET request for groupId:", groupId);

      const { data, error } = await supabase
        .from("items")
        .select("item_name, quantity, assignee")
        .eq("group_id", groupId);

      if (error) {
        console.error("Supabase GET error:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("Supabase data:", data);

      const items = data.map((d) => ({
        name: d.item_name,
        quantity: d.quantity,
        assignee: d.assignee,
      }));

      console.log("Returning items:", items);
      return res.status(200).json(items);
    } catch (err) {
      console.error("GET items error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // 追加／更新（upsert）--------------------------------------
  if (method === "POST") {
    const { name: item_name, quantity = null, assignee = "" } = body;

    console.log("POST request with item:", { item_name, quantity, assignee });

    if (!item_name) {
      return res.status(400).json({ error: "item name required" });
    }

    try {
      const { error } = await supabase.from("items").upsert(
        [
          {
            group_id: groupId,
            item_name,
            quantity,
            assignee,
          },
        ],
        { onConflict: ["group_id", "item_name"] }
      );

      if (error) {
        console.error("Supabase POST error:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("Item saved successfully");
      return res.status(200).json({ message: "saved" });
    } catch (err) {
      console.error("POST items error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // それ以外
  return res.status(405).json({ error: "Method Not Allowed" });
}
