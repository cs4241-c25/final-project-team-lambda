export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body>
            <nav>
                <ul className="flex items-center gap-4 px-4 py-2">
                    <li><a href="/scrapbooks" className="no-underline"><h2>LifeLog</h2></a></li>
                    <li className="ml-auto"><a href="/profile" className="no-underline hover:underline">Profile</a></li>
                    <li><a href="/" className="no-underline hover:underline">Logout</a></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
