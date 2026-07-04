import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">MileStack</h1>
      <p className="mt-2 text-white/60">
        Milestone-based programmable escrow, powered by FlowVault.
      </p>
      <Link
        href="/projects"
        className="mt-6 inline-block rounded-md bg-vault-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        View Projects
      </Link>
    </div>
  );
}
