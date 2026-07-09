import Link from "next/link";
import Image from "next/image";
import WalletConnectButton from "@/components/WalletConnectButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="flex items-center gap-3">

          <Image
           src="/milestack-icon.png"
            alt="MileStack Logo"
           width={38}
height={38}
className="object-contain"
          />

          <span className="text-2xl font-bold tracking-tight">
            <span className="text-white">Mile</span>
            <span className="text-blue-500">Stack</span>
          </span>

        </Link>

        <WalletConnectButton />

      </div>
    </header>
  );
}
