export default async function handler(req, res) {
    const { code } = req.query;
  
    const client_id = process.env.OAUTH_CLIENT_ID;
    const client_secret = process.env.OAUTH_CLIENT_SECRET;
  
    // 1) Pas de "code" → redirige vers GitHub pour autorisation
    if (!code) {
      const redirect = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`;
      return res.redirect(redirect);
    }
  
    // 2) Échange du "code" contre un access_token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ client_id, client_secret, code })
    });
  
    const data = await tokenRes.json();
  
    if (!data.access_token) {
      return res.status(401).json({ error: "OAuth failed", details: data });
    }
  
    // 3) Retourne le token à Decap CMS
    return res.json({ token: data.access_token });
  }
  