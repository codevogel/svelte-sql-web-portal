import { GitHub } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

// If null, use the redirect URI provided in the github OAuth app.
const redirectURI: string | null = null;
export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, redirectURI);
