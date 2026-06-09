import { getSession } from '../../lib/session';

export default function handler(req, res) {
  const session = getSession(req);
  res.status(200).json({ loggedIn: !!session, id: session?.id ?? null });
}
