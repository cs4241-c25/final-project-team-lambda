import Logout from "./Logout";

export default function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body className="flex flex-col h-screen">
            <nav>
                <ul className="flex items-center gap-4 px-4 py-2">
                    <li><a href="/scrapbooks" className="no-underline"><h2>LifeLog</h2></a></li>
                    <li><a href="/profile" className="no-underline hover:underline">Profile</a></li>
                    <li className="ml-auto"><Logout /></li>
                </ul>
            </nav>
            {children}
        </body>
    );
}
