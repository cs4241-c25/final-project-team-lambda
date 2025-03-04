import Link from "next/link";
import Image from "next/image";
import Logout from "./Logout";

export default function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body className="flex flex-col h-screen">
            <nav className="bg-[--mediumgreen]">
                <ul className="flex items-center gap-4 [&_a]no-underline px-4 py-2">
                    <li>
                        <Link href="/" className="flex items-center gap-2 no-underline">
                            <Image
                                src="/images/logo-small.png"
                                alt="The LifeLog logo depicting an outline of an open book."
                                width="50"
                                height="50"
                            />
                            <h2>LifeLog</h2>
                        </Link>
                    </li>
                    <li><Link href="/scrapbooks" className="bg-[--darkgreen] no-underline px-4 py-2 rounded-md hover:text-white">Scrapbooks</Link></li>
                    <li><Link href="/profile" className="bg-[--darkgreen] no-underline px-4 py-2 rounded-md hover:text-white">Profile</Link></li>
                    <li className="ml-auto"><Logout /></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
