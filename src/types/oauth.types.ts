export interface OAuthTransaction {
  state: string;
  nonce: string;
  codeVerifier: string;
}