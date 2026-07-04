import WalletConnectButton from "@/components/WalletConnectButton";

export default function Navbar() {
  // TODO: Nav links (Projects, Vault Dashboard) + wallet connect
  return (
    <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <span className="font-semibold">MileStack</span>
      <WalletConnectButton />
    </nav>
  );
}
