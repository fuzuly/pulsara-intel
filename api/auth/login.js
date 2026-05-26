export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const validUsername = process.env.DASHBOARD_USERNAME;
  const validPassword = process.env.DASHBOARD_PASSWORD;

  if (username === validUsername && password === validPassword) {
    return res.status(200).json({
      success: true,
      token: Buffer.from(`${username}:${Date.now()}`).toString('base64')
    });
  }

  return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
}
