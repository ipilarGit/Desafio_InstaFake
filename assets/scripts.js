$(document).ready(async function () {
  const token = localStorage.getItem('jwt-token');
  if (token) {

    await showData(token);
    // $('#js-form').addClass('d-none');
  }
})

const showData = async (token) => {
  $('#js-form').addClass('d-none');
  const photos = await getPhotos(token);
  fillTable(photos, "js-table-photos");
  data = photos;
  llenarSelect(data);

}


$("#js-form").submit(async (event) => {
  event.preventDefault();
  const email = document.getElementById("js-input-email").value;
  const password = document.getElementById("js-input-password").value;
  const JWT = await postData(email, password);

  await showData(JWT)
});

const postData = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    const { token } = await response.json();
    localStorage.setItem('jwt-token', token);
    return token;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const getPhotos = async (jwt) => {
  try {
    const response = await fetch("http://localhost:3000/api/photos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};


const fillTable = (data, table) => {
  let rows = "";
  const imagenp = document.getElementById("imagenp");

  let imagen = data[0].download_url;

  imagenp.innerHTML = `<img src="${imagen}" class="img-thumbnail img-fluid w-100">`

};


const llenarSelect = (data) => {

  const nombreAutores = data.map((p) => p.author);
  const pasoAutores = Array.from(new Set(nombreAutores));
  const autoresUnicos = [...new Set(pasoAutores)];

  mySelect = document.getElementById("mySelect");

  autoresUnicos.forEach((a, i) => {
    let opcion = document.createElement("option");
    opcion.value = `${a}`;
    opcion.text = `${a}`;
    mySelect.options.add(opcion, 1);
  })
}


function mostrar() {

  let nombre = document.getElementById("nombre");

  let indice = mySelect.selectedIndex;
  author = mySelect.options[indice].text;
  nombre.innerHTML = `Autor: <small>${author}</small>`
  seleccionado = mySelect.options[indice].value;

  let autor_modificado = data.filter((autor) => {
    return seleccionado === autor.author
  })

  const imagenp = document.getElementById("imagenp");
  let imagen = autor_modificado[0].download_url;
  imagenp.innerHTML = `<img src="${imagen}" class="img-thumbnail img-fluid w-100">`

  let rows = "";
  let table = "js-table-photos";
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  $.each(autor_modificado, (i, row) => {
    rows += `<tr>
    <td> ${row.id} </td>
    <td> ${row.author} </td>
    <td> ${row.url} </td>
    <td><img src="${row.download_url}" class="img-thumbnail"></td>
    </tr>`;
  });
  $(`#${table} tbody`).append(rows);
}

function deleteItem() {
  localStorage.removeItem("jwt-token");
  location.reload()
}
