export async function sendMagicLinkEmail({
  email,
  code,
  magicLink,
}: {
  email: string;
  code: string;
  magicLink: string;
}) {
  console.log("Sending verification email to:", email);
  console.log("Code:", code);
  console.log("Magic link:", magicLink);
}
