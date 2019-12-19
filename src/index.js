import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from "react-dom/server";
import App from './App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import canvgX from 'canvg';


var doc = new jsPDF();
// debugger
// html2canvas(document.getElementById('root'), {
//     // this does not work
//     onrendered: function(canvas) {
//         // debugger
//         var img = canvas.toDataURL(); //image data of canvas
//         var doc = new jsPDF();
//         doc.addImage(img, 10, 10);
//         //doc.save('test.pdf');
//     }
// })

// html2canvas(document.getElementById('mypie1'), {
//         scale: 2
//     }
// ).then(function(canvas) {
//     //debugger
//     var img = canvas.toDataURL(); //image data of canvas
//     var doc = new jsPDF();
//     doc.addImage(img, 10, 10);
//     //doc.save('test.pdf');    
// });
// doc.fromHTML(ReactDOMServer.renderToStaticMarkup(<App/>));

//doc.save("myDocument.pdf");

const covertToMm = val => val / 3.7795275591;
  
const onSave = () => {
    console.log('start save');
    let p1 = html2canvas(document.getElementById('mypie1'));
    let p2 = html2canvas(document.getElementById('imagemapwrapper'));
    let p3 = html2canvas(document.getElementById('myPieChartId'));    
    //let p4 = html2canvas(document.getElementById('myTableId'));
    let p5 = html2canvas(document.getElementById('mybar1'));

    Promise.all([p1,p2]).then(function(allPromises) {
        let y = 10;
        var pageHeight= doc.internal.pageSize.height;
        console.log('All promises done', allPromises);
        //addSvg(doc);
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


    console.log('end save');
}

const addSvg = (doc) => {
    debugger
    let elem = document.getElementById('myImageMap');
    // var svgAsText = new XMLSerializer().serializeToString(elem);
    // doc.addSVG(svgAsText, 10, 10, 100, 100)
    
    
    var svg = elem.innerHTML;
    svg = svg.replace(/\r?\n|\r/g, '').trim();
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvgX.fromString(context, svg);
    debugger

    var imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 0, 0, 100, 100);
}



ReactDOM.render(<App onSave={onSave}/>, document.getElementById('root'));
