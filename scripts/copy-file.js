import { error } from "node:console"
import fs, { write } from "node:fs"
import {performance} from "node:perf_hooks"

const origen = process.argv[2]
const destino = process.argv[3]

if (!origen || !destino) {
    console.error("Error: Faltan argumentos. Uso: node scripts/copy-file.js <origen> <destino>")
    process.exit(1)
}

const tiempoInicio = performance.now()

const readStream = fs.createReadStream(origen)
const writeStream = fs.createWriteStream(destino)

//TODO: Manejo de errores
readStream.on("error", (error) => {
    console.error(`Error de lectura: No se pudo leer el archivo '${origen}'`)
})

writeStream.on("error", (error) => {
    console.error(`Error de escritura: No se pudo guardar en '${destino}'`)
})

//TODO: Tenemos que detectar cuando termina. 
writeStream.on("finish", () => {
    const tiempoFinal = performance.now()
    const tiempoTotal = Math.round(tiempoFinal - tiempoInicio)

    console.log("Archivo copiado correctamente")
    console.log(`Tiempo total: ${tiempoTotal}ms`)
})

readStream.pipe(writeStream)