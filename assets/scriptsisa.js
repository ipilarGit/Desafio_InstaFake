// Desafío - InstaFake
$(document).ready(async function () {

     const token = localStorage.getItem('jwt-token');
     if (token) {
          await showData(token);
          $('#js-form').addClass('d-none');
     }
})

const showData = async (token) => {
     const posts = await getPosts(token);
     fillTable(posts, "js-table-posts");

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

const getPosts = async (jwt) => {
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
     $.each(data, (i, row) => {
          rows += `<tr>
    <td> ${row.id} </td>
    <td> ${row.author} </td>
    <td> ${row.url} </td>
    </tr>`;
     });
     $(`#${table} tbody`).append(rows);
};
