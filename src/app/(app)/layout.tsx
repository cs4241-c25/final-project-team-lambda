import Logout from "./Logout";
import Link from "next/link";

export default function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body className="flex flex-col h-screen">
            <nav>
                <ul className="flex items-center gap-4 px-4 py-2">
                    <li><Link href="/" className="no-underline"><h2>LifeLog</h2></Link></li>
                    <li><Link href="/scrapbooks" className="no-underline hover:underline">Scrapbooks</Link></li>
                    <li><Link href="/profile" className="no-underline hover:underline">Profile</Link></li>
                    <li className="ml-auto"><Logout /></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
