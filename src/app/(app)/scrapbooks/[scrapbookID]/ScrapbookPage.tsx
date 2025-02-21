import { Page } from '@/lib/models';

export default function ScrapbookPage({ page }: { page: Page }) {
    const size = {
        width: 17,
        height: 22
    }
    
    return (
        <div id="canvas" className={`
            border-2 border-gray-300 rounded-sm
            flex justify-center items-center text-gray-300
        `}
        style={{
            aspectRatio: `${size.width} / ${size.height}`
        }}>
            [canvas pg {page.number}]
        </div>
    );
}
