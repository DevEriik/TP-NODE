import { createServer } from "node:http";
import characters from "./data/characters.js";
import fs from "node:fs";
import path from "node:path";
import mimeTypes from "./utils/mimeTypes.js";
import { parseBody } from "./utils/parseBody.js";

const server = createServer(async (req, res) => {
  //! Aca verifico la ruta y tambien verifico el metodo por el que se envia.
  if (req.url === "/api/characters" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(characters));
  } else if (req.url.startsWith("/api/characters/") && req.method === "GET") {
    let id = req.url.split("/").pop();
    let personajeEncontrado = characters.find((agente) => agente.id === id);

    if (personajeEncontrado) {
      //! Esta esla respuesta y avisamos que mandamos el json.
      res.writeHead(200, { "Content-Type": "application/json" });

      //! Aca envio los datos y cierro las respuestas.
      res.end(JSON.stringify(personajeEncontrado));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Personaje no encontrado" }));
    }
  } else if (req.url === "/api/characters" && req.method === "POST") {
    try {
      const bodyData = await parseBody(req);

      if (
        !bodyData.name ||
        !bodyData.race ||
        !bodyData.role ||
        !bodyData.level ||
        !bodyData.universe
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Faltan campos obligatorios" }));
      }

      const nuevoAgente = {
        id: Date.now().toString(),
        ...bodyData,
      };
      characters.push(nuevoAgente);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(nuevoAgente));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Datos invalidos" }));
    }
  } else if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } else {
    //! Si piden el archivo raiz los mando al index.html
    let fileName = req.url === "/" ? "index.html" : req.url;

    //! Armo la ruta absoluta del archivo
    let filePath = path.join(process.cwd(), "public", fileName);

    //!Averiguo la extension para saber el Content-Type
    let extName = path.extname(filePath);
    let contentType = mimeTypes[extName] || "text/plain";

    //! Leo el archivo
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Archivo no encontrado" }));
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Escuchando en 127.0.0.1:3000");
});
