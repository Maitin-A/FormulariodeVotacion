const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbzx3vrD4zyZZ-o0LgjCnPuUy6jyn1j7mcpi3tWiy-ejVpCZh5n-zuqY7Tuazp4RDs34_w/exec";

const ENTIDADES = [
  {
    id: "ent_1",
    nombre: "Altos Mirandinos",
    imagenUrl: "./imagenes/1.png",
  },
  {
    id: "ent_2",
    nombre: "Amazonas",
    imagenUrl: "./imagenes/8.png",
  },
  {
    id: "ent_3",
    nombre: "Anzoátegui",
    imagenUrl: "./imagenes/9.png",
  },
  {
    id: "ent_4",
    nombre: "Apure",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_5",
    nombre: "Aragua",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_6",
    nombre: "Barinas",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_7",
    nombre: "Baruta",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_8",
    nombre: "Bolívar",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_9",
    nombre: "Carabobo",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_10",
    nombre: "Cojedes",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_11",
    nombre: "Delta Amacuro",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_12",
    nombre: "Eje Barlovento",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_13",
    nombre: "Eje Guarenas - Guatire",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_14",
    nombre: "Falcón",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_15",
    nombre: "La California",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_16",
    nombre: "Lara",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_17",
    nombre: "Libertador",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_18",
    nombre: "Mérida",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_19",
    nombre: "Monagas",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_20",
    nombre: "Nueva Esparta",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_21",
    nombre: "Portuguesa",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_22",
    nombre: "Sucre",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_23",
    nombre: "Táchira",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_24",
    nombre: "Trujillo",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_25",
    nombre: "Valles el Tuy",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_26",
    nombre: "Yaracuy",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_27",
    nombre: "Zulia",
    imagenUrl: "./imagenes/10.png",
  },
  {
    id: "ent_28",
    nombre: "Sede Nacional",
    imagenUrl: "./imagenes/10.png",
  },
];

let entidadSeleccionada = null;

const selectVotante = document.getElementById("select-votante");
const badgeEstado = document.getElementById("badge-estado");
const gridObras = document.getElementById("grid-obras");
const panelConfirmacion = document.getElementById("panel-confirmacion");
const resumenSeleccion = document.getElementById("resumen-seleccion");
const btnEnviar = document.getElementById("btn-enviar");
const mensajeEstado = document.getElementById("mensaje-estado");

// 1. Llenar el selector
ENTIDADES.forEach((ent) => {
  const opt = document.createElement("option");
  opt.value = ent.id;
  opt.textContent = ent.nombre;
  selectVotante.appendChild(opt);
});

// 2. Verificar si ya votó o si ya eligió entidad previamente (persistencia local)
const votanteGuardado = localStorage.getItem("votante_bloqueado");
const votoCompletado = localStorage.getItem("voto_realizado");

if (votoCompletado) {
  bloquearFormularioCompleto("Ya has emitido tu voto desde este dispositivo.");
} else if (votanteGuardado) {
  fijarIdentidad(votanteGuardado);
}

// 3. Evento al seleccionar por primera vez
selectVotante.addEventListener("change", (e) => {
  const elegidaId = e.target.value;
  if (!elegidaId) return;

  const ent = ENTIDADES.find((item) => item.id === elegidaId);
  const confirma = confirm(
    `¿Confirmas que representas a "${ent.nombre}"?\nUna vez aceptado, no podrás cambiarlo.`,
  );

  if (confirma) {
    localStorage.setItem("votante_bloqueado", elegidaId);
    fijarIdentidad(elegidaId);
  } else {
    // Si cancela, volvemos a dejarlo en blanco
    selectVotante.value = "";
  }
});

// Bloquea el selector de forma permanente y carga el catálogo
function fijarIdentidad(id) {
  selectVotante.value = id;
  selectVotante.disabled = true; // <-- YA NO SE PUEDE CAMBIAR
  badgeEstado.textContent = "🔒 Identidad fijada. No se puede modificar.";
  cargarOpciones(id);
}

function cargarOpciones(votanteId) {
  gridObras.innerHTML = "";
  entidadSeleccionada = null;
  btnEnviar.disabled = true;
  mensajeEstado.textContent = "";

  // Filtramos para no mostrar la obra que pertenece a esta entidad
  const disponibles = ENTIDADES.filter((ent) => ent.id !== votanteId);

  disponibles.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card-obra";
    card.id = `card-${item.id}`;
    card.innerHTML = `
          <img src="${item.imagenUrl}" alt="${item.nombre}" loading="lazy">
          <h3>${item.nombre}</h3>
          <button type="button" class="btn-select">Votar por esta</button>
        `;

    card.addEventListener("click", () => seleccionarUnica(item));
    gridObras.appendChild(card);
  });

  resumenSeleccion.innerHTML =
    "<em>Selecciona una de las imágenes de arriba para habilitar el voto.</em>";
  panelConfirmacion.style.display = "block";
}

function seleccionarUnica(item) {
  entidadSeleccionada = item;

  document.querySelectorAll(".card-obra").forEach((c) => {
    c.classList.remove("selected");
    c.querySelector(".btn-select").textContent = "Votar por esta";
  });

  const cardActual = document.getElementById(`card-${item.id}`);
  if (cardActual) {
    cardActual.classList.add("selected");
    cardActual.querySelector(".btn-select").textContent = "✓ Seleccionada";
  }

  resumenSeleccion.innerHTML = `Has seleccionado la obra de: <strong>${item.nombre}</strong>`;
  btnEnviar.disabled = false;
}

// 4. Envío a Google Sheets
btnEnviar.addEventListener("click", async () => {
  if (!entidadSeleccionada) return;

  const votanteObj = ENTIDADES.find((e) => e.id === selectVotante.value);

  btnEnviar.disabled = true;
  mensajeEstado.textContent = "Enviando tu voto...";
  mensajeEstado.style.color = "#475569";

  const payload = {
    votante: votanteObj ? votanteObj.nombre : selectVotante.value,
    votoPor: entidadSeleccionada.nombre,
  };

  try {
    await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Guardamos marca en el navegador para que no vuelva a votar
    localStorage.setItem("voto_realizado", "true");

    gridObras.innerHTML = "";
    btnEnviar.style.display = "none";
    resumenSeleccion.innerHTML = `Tu voto por <strong>${entidadSeleccionada.nombre}</strong> ha sido registrado.`;
    mensajeEstado.textContent = "¡Muchas gracias por participar!";
    mensajeEstado.style.color = "#16a34a";
  } catch (err) {
    mensajeEstado.textContent = "Error al enviar el voto. Inténtalo de nuevo.";
    mensajeEstado.style.color = "#dc2626";
    btnEnviar.disabled = false;
  }
});

function bloquearFormularioCompleto(texto) {
  selectVotante.disabled = true;
  gridObras.innerHTML = "";
  panelConfirmacion.style.display = "block";
  btnEnviar.style.display = "none";
  resumenSeleccion.textContent = texto;
  resumenSeleccion.style.fontWeight = "bold";
  resumenSeleccion.style.color = "#dc2626";
}
