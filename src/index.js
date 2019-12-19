import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from "react-dom/server";
import App from './App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import canvgX from 'canvg';


var doc = new jsPDF();

const covertToMm = val => val / 3.7795275591;
  
const onSave = () => {
    console.log('start save');
    //tryRenderSvgElems();
    tryHtmlRender();

    console.log('end save');
}

// Manually render items
const tryRenderSvgElems = () => {
    let p1 = html2canvas(document.getElementById('mypie1'));
    let p2 = html2canvas(document.getElementById('imagemapwrapper'));
    let p3 = html2canvas(document.getElementById('myPieChartId'));    
    //let p4 = html2canvas(document.getElementById('myTableId'));
    let p5 = html2canvas(document.getElementById('mybar1'));

    Promise.all([p1,p2]).then(function(allPromises) {
        let y = 10;
        var pageHeight= doc.internal.pageSize.height;
        console.log('All promises done', allPromises);
        allPromises.forEach(canvas => {
            
            if (y >= pageHeight)
            {
                doc.addPage();
                y = 0 // Restart height position
            }

            var img = canvas.toDataURL();
            var height = covertToMm(canvas.height)
            doc.addImage(img, 10, y);            
            y += height;
        })

        
        doc.save('test.pdf');
    });
}

// Try jsPdf's toHtml function
// Result: All CSS styling not applied
// But the text data are there, and there is pagination
const tryHtmlRender = () => {
    let rootElem = document.getElementById('root');
    doc.fromHTML(rootElem);
    doc.save('testHtml.pdf');
}


ReactDOM.render(<App onSave={onSave}/>, document.getElementById('root'));
//ReactDOM.render(<ReportApp/>, document.getElementById('root'));
