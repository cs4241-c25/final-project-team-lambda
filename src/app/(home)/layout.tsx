const navigation = [
    { name: 'Log In', href: '/login' },
    { name: 'Register', href: '/register' },
];

export default function HomeLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <body>
        <nav className="bg-[var(--mediumgreen)]">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="no-underline">
                            <h2 className="text-black text-2xl font-bold">LifeLog</h2>
                        </a>
                    </div>
                    <div className="ml-auto flex space-x-4">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-black bg-[var(--darkgreen)] hover:text-white rounded-md px-3 py-2 text-lg font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
        <main>{children}</main>
        </body>
    );
}
