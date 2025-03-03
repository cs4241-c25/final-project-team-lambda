import Link from "next/link";

export default function Home() {
return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center justify-between w-full mb-10 lg:flex-row">
            <div className="mb-16 lg:mb-0 lg:max-w-lg lg:pr-5">
                <div className="max-w-xl mb-6">
                        <img
                            className="h-64 w-64 transition-all duration-300 rounded-lg"
                            src="https://i.ibb.co/bjyttMmp/Life-Log-Logo-5.png"
                            alt="Life-Log-Logo-5"
                        />
                    <br></br>
                    <p className="text-gray-700 text-base md:text-lg">DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white no-underline transition duration-200 rounded shadow-md bg-[var(--mediumgreen)] hover:bg-[var(--darkgreen)] focus:shadow-outline focus:outline-none"
                    >
                        Start Creating
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-center lg:w-full">
                <div className="w-full ml-auto">
                    <img
                        className="h-auto max-w-full transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0"
                        src="https://i.ibb.co/ksV7BSbq/First-Neat-Scrapbook-Collage.png"
                        alt="First-Neat-Scrapbook-Collage"
                    />
                </div>
            </div>
        </div>
    </div>
);
};