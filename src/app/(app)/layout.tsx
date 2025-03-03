import Link from "next/link";
import Logout from "./Logout";

const navigation = [
    { name: 'Scrapbooks', href: '/scrapbooks' },
    { name: 'Profile', href: '/profile' },
];

export default function AppLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <body>
        <nav className="bg-[var(--mediumgreen)]">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <img
                                className="h-16 w-16 transition-all duration-300 rounded-lg"
                                src="https://i.ibb.co/pvbHqjj5/Life-Log-Logo-8.png"
                                alt="Life-Log-Logo-8"
                            />
                            <Link href="/" className="no-underline">
                                <h2 className="text-black text-2xl font-bold">LifeLog</h2>
                            </Link>
                        </div>
                        <div className="ml-6 flex space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-black bg-[var(--darkgreen)] hover:text-white rounded-md px-3 py-2 text-lg font-medium no-underline"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Logout />
                </div>
            </div>
        </nav>
        <main>{children}</main>
        </body>
    );
}