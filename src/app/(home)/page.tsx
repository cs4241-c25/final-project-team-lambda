import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex m-8 gap-8 h-full items-center justify-around">
      <section className="flex flex-col items-center gap-8">
        <Image
          src="/images/logo-large.png"
          alt="An outline of an open book with simple doodles floating out"
          width="250" height="250"
        />
        <p className="max-w-80">
          Welcome to LifeLog! A scrapbook creation platform where you create your own
          multi-page scrapbooks with text, shapes, and stickers!
        </p>
        <Link href="/register" className="bg-[--mediumgreen] no-underline px-4 py-2 rounded-md text-white">Start Creating</Link>
      </section>
      <section>
        <Image
          src="/images/collage.png" alt="A collage of scrapbook pages"
          width="640" height="360"
          className="m-auto grayscale hover:filter-none transition-all duration-300"
        />
      </section>
    </main>
  );
}
