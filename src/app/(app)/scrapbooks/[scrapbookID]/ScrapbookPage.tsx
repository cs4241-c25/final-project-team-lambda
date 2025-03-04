import { Page } from '@/lib/models';
import ScrapbookElement from './ScrapbookElement';
import { MouseEvent, useContext } from 'react';
import ScrapbookContext from './ScrapbookContext';


export default function ScrapbookPage({ size, page, zoom }: { size: {width: number, height: number}, page: Page, zoom: number }) {
    const { setSelectedElement } = useContext(ScrapbookContext);

    function handleClick(event: MouseEvent) {
        if (event.target == event.currentTarget)
            setSelectedElement(null);
    }
    
    return (
        <div id="canvas" className="border-2 border-gray-300 rounded-sm text-gray-300 absolute"
        style={{
            width: size.width,
            height: size.height,
            transform: `scale(${zoom})`,
            transformOrigin: "top left"
        }}
        onClick={handleClick}>
            {page.elements.map((el, i) => (<ScrapbookElement key={i} el={el} />))}
        </div>
    );
}
