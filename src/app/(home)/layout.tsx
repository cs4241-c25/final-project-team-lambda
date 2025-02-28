import Link from "next/link";

export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body>
            <nav>
                <ul className="flex items-center gap-4 px-4 py-2 [&_a]no-underline">
                    <li><Link href="/" className="no-underline"><h2>LifeLog</h2></Link></li>
                    <li className="ml-auto"><Link href="/login" className="no-underline hover:underline">Login</Link></li>
                    <li><Link href="/register" className="no-underline hover:underline">Register</Link></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
