import Link from "next/link";
import Image from "next/image";

export default function HomeLayout({
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
                    <li className="ml-auto"><Link href="/login" className="bg-[--darkgreen] no-underline px-4 py-2 rounded-md hover:text-white">Log In</Link></li>
                    <li><Link href="/register" className="bg-[--darkgreen] no-underline px-4 py-2 rounded-md hover:text-white">Register</Link></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
