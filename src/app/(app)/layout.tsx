import Link from "next/link";
import Logout from "./Logout";

const navigation = [
    { name: 'Scrapbooks', href: '/scrapbooks' },
    { name: 'Profile', href: '/profile' },
];

function classNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function AppLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    // Get current path
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    console.log("Current path: ", currentPath);

    return (
        <body>
        <nav className="bg-[var(--mediumgreen)]">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="no-underline">
                            <h2 className="text-black text-2xl font-bold">LifeLog</h2>
                        </Link>
                        <div className="ml-6 flex space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-current={currentPath === item.href ? 'page' : undefined}
                                    className={classNames(
                                        currentPath === item.href
                                            ? 'bg-[var(--darkestgreen)] text-white' // active link - not working
                                            : 'text-black bg-[var(--darkgreen)] hover:text-white', // default styles - do we want this to be hover only, or stay with the buttons around them all the time?
                                        'rounded-md px-3 py-2 text-lg font-medium'
                                    )}
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
