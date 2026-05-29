console.log("Frontend conectado");

const container = document.getElementById("characters-container")
const form = document.getElementById("character-form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const nuevoAgente = {
        name: document.getElementById("name").value, 
        race: document.getElementById("race").value, 
        role: document.getElementById("role").value, 
        level: Number(document.getElementById("level").value), 
        universe: document.getElementById("universe").value
    }

    try {
        const response = await fetch("/api/characters", {
            method: "POST", 
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(nuevoAgente)
        })

        if (response.ok) {
            form.reset()
            cargarAgentes()
        }else{
            const errorData = await response.json()
            alert("Error del servidor:" + errorData.error)
        }
    } catch (error) {
        console.error("Hubo un error de red:", error)
        alert("No se pudo conectar con el servidor")
    }
})

const cargarAgentes = async () => {
    try {
        //TODO: Aca puedo usar rutas relativas porque el front y el back estan en el mismo servidor.
        const response = await fetch("/api/characters")
        const agentes = await response.json()

        const tarjetasHTML = agentes.map((agente) => 
            `<div class="card">
                <h2>${agente.name}</h2>
                <p><strong>Raza:</strong> ${agente.race}</p>
                <p><strong>Rol:</strong> ${agente.role}</p>
                <p><strong>Nivel:</strong> ${agente.level}</p>
                <p><strong>Universo:</strong> ${agente.universe}</p>
            </div>`).join("")

            container.innerHTML = tarjetasHTML
    } catch (error) {
        console.log("Hubo un error al traer los datos:", error)
        container.innerHTML = "<p>Ups, no se pudieron cargar los agentes.</p>"
    }
}

cargarAgentes()