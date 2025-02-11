export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body>
            <nav>
                <ul className="flex items-center gap-4 px-4 py-2 [&_a]no-underline">
                    <li><a href="/" className="no-underline"><h2>LifeLog</h2></a></li>
                    <li className="ml-auto"><a href="/login" className="no-underline hover:underline">Login</a></li>
                    <li><a href="/register" className="no-underline hover:underline">Register</a></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
