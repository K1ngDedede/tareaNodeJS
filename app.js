const axios = require("axios")
const httpclient = require("http")
const fs = require("fs")
const promises = fs.promises;
const leUrl= "https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/9ed13fd53a144528568d1187c1d34073b36101fd/categories.json"



httpclient.createServer(async function(message,response){
    try {
        const data = await promises.readFile('menu.html');
        let res = await axios.get(leUrl);
        response.writeHead(200, {'Content-Type': 'text/html'});
        //Cambios en el archivo HTML
        let fullmenu = res.data;
        let htmlsheet = escribirHTML(fullmenu);
        //Escritura del HTML y despliegue
        //console.log(data)
        menu = data.toString();
        console.log(htmlsheet);
        menu = menu.replace("{{buenastardes}}",htmlsheet)
        var buf = Buffer.from(menu, 'utf8');
        //console.log(buf)
        response.write(buf)
        response.end();
    } catch(e) {
        response.writeHead(500);
        response.write(e.message);
        response.end();
    }
}).listen(8080)

function escribirHTML(fullmenu) {
    let htmlsheet = "";
    htmlsheet = "<h1>Menu</h1> \n <div class=\"accordion\" id=\"menu\"> \n";
    for (let y = 0; y < Object.keys(fullmenu).length; y++){
        let temp = fullmenu[y];
        //Creación de la tarjeta expandible
        htmlsheet = htmlsheet + "<div class=\"card\"> \n <div class=\"card-header\" id=\"acc"+y+"\"> \n <h2 class=\"mb-0\"> \n";
        htmlsheet = htmlsheet + "<button class=\"btn btn-link\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse"+y+"\" aria-expanded=\"true\" aria-controls=\"collapse"+y+"\"> \n";
        htmlsheet = htmlsheet + temp.name + "\n";
        htmlsheet = htmlsheet + "</button> \n </h2> \n </div> \n";
        //Contenido de la tarjeta
        htmlsheet = htmlsheet + "<div id=\"collapse"+y+"\" class=\"collapse\" aria-labelledby=\"acc"+y+"\" data-parent=\"#menu\"> \n <div class=\"card-body\"> \n";
        htmlsheet = htmlsheet + "<div class=\"row\"> \n";
        for(let x=0; x< Object.keys(temp.products).length; x++){
            //Creación de cada subtarjeta
            htmlsheet = htmlsheet + "<div class=\"col\"> \n <div class=\"card\"> \n ";
            let img = temp.products[x].image;
            htmlsheet = htmlsheet + "<img class=\"card-img-top\" src=\""+img+"\"> \n";
            let title = temp.products[x].name;
            htmlsheet = htmlsheet + "<div class=\"card-body\" \n> <h5 class=\"card-title\">"+title+"</h5> \n";
            let desc = temp.products[x].description;
            htmlsheet = htmlsheet + "<p class=\"card-text\">"+desc+"</p> \n";
            let prs = temp.products[x].price;
            htmlsheet = htmlsheet + "<h6>"+prs+"</h6> \n <a class=\"btn btn-primary\">Add to car</a> \n";
            htmlsheet = htmlsheet + "</div> \n </div> \n </div>";
        }
        htmlsheet = htmlsheet + "</div> \n </div> \n </div> \n </div> \n";
    }
    htmlsheet=htmlsheet+"</div> \n";
    return htmlsheet;
}
