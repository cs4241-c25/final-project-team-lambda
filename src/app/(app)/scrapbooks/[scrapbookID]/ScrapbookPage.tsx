import { Page } from '@/lib/models';
import ScrapbookElement from './ScrapbookElement';
import { MouseEvent, useContext } from 'react';
import ScrapbookContext from './ScrapbookContext';

export default function ScrapbookPage({ page, zoom }: { page: Page, zoom: number }) {
    const { setSelectedElement } = useContext(ScrapbookContext);

    const size = {
        width: 17,
        height: 22
    }

    function handleClick(event: MouseEvent) {
        if (event.target == event.currentTarget)
            setSelectedElement(null);
    }
    
    return (
        <div id="canvas" className={`
            border-2 border-gray-300 rounded-sm mx-auto
            flex justify-center items-center text-gray-300 relative
        `}
        style={{
            aspectRatio: `${size.width} / ${size.height}`,
            width: zoom * 100 + "%"
        }}
        onClick={handleClick}>
            {page.elements.map((el, i) => (<ScrapbookElement key={i} el={el} />))}
            [canvas pg {page.number}]
        </div>
    );
}
