import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, ADMIN_COOKIE } from "@/lib/admin-session";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";
  const error = params.error;

  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      redirect(`/admin/login?next=${encodeURIComponent(next)}&error=1`);
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, createSessionToken(adminPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    redirect(next);
  }

  return (
    <div className="admin-shell min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-script text-4xl text-rose mb-1">little charlie&apos;s</p>
          <p className="text-xs tracking-[0.3em] uppercase text-brown">Admin</p>
        </div>

        <form action={login} className="bg-warm-white border border-parchment p-8 space-y-5">
          <div>
            <label htmlFor="password" className="block text-xs tracking-widest uppercase text-brown mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full border border-parchment bg-cream px-4 py-3 text-sm text-mocha focus:outline-none focus:border-rose transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">Incorrect password. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full bg-rose text-cream py-3 text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
