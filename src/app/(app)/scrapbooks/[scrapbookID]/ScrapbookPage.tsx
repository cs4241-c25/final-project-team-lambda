import { Page } from '@/lib/models';

export default function ScrapbookPage({ page, numPages }: { page: Page, numPages: number }) {
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="relative w-full h-full mt-8">
                <div id="canvas" className="absolute inset-0 bg-white m-auto aspect-[17/22] max-h-full"></div>
            </div>
            <p className="text-right h-8">{page.number} / {numPages}</p>
        </div>
    );
}
