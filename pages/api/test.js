export default function handler(req, res) {
  res.status(200).json({
    message: "Next.js API is working!",
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: "production",
  });
}
