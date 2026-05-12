import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose';

const ALG = 'RS256';

/**
 * Import the RS256 private key from PEM-encoded env var.
 */
async function getPrivateKey() {
  const pem = process.env.JWT_PRIVATE_KEY;
  if (!pem) throw new Error('JWT_PRIVATE_KEY environment variable is not set');
  return importPKCS8(pem, ALG);
}

/**
 * Import the RS256 public key from PEM-encoded env var.
 */
async function getPublicKey() {
  const pem = process.env.JWT_PUBLIC_KEY;
  if (!pem) throw new Error('JWT_PUBLIC_KEY environment variable is not set');
  return importSPKI(pem, ALG);
}

export interface ExtensionTokenPayload {
  sub: string;       // user_id
  ext: string;       // extension_id
  iat: number;
  exp: number;
}

/**
 * Sign a new extension JWT (RS256).
 * Token is valid for 365 days — revocation is handled via the database.
 */
export async function signExtensionToken(
  userId: string,
  extensionId: string
): Promise<string> {
  const privateKey = await getPrivateKey();

  const token = await new SignJWT({
    ext: extensionId,
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('365d')
    .setIssuer('soc-browser-shield')
    .setAudience('extension')
    .sign(privateKey);

  return token;
}

/**
 * Verify an extension JWT. Returns the decoded payload.
 * Throws if the signature is invalid or the token is expired.
 */
export async function verifyExtensionToken(
  token: string
): Promise<ExtensionTokenPayload> {
  const publicKey = await getPublicKey();

  const { payload } = await jwtVerify(token, publicKey, {
    issuer: 'soc-browser-shield',
    audience: 'extension',
    algorithms: [ALG],
  });

  return {
    sub: payload.sub as string,
    ext: payload.ext as string,
    iat: payload.iat as number,
    exp: payload.exp as number,
  };
}
