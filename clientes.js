$(document).ready(function () {
  $.ajax({
    url: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    success: function (data) {
      data.forEach(cliente => {
        const tarjetas = Math.floor(Math.random() * 5) + 1;
        const estado = Math.random() > 0.3 ? 'Activo' : 'Inactivo';
        
        const fila = `
          <tr>
            <td>${cliente.name}</td>
            <td>${cliente.email}</td>
            <td>${tarjetas}</td>
            <td><span class="badge bg-${estado === 'Activo' ? 'success' : 'secondary'}">${estado}</span></td>
            <td>
              <button class="btn btn-sm btn-primary">Ver Detalles</button>
            </td>
          </tr>
        `;
        
        $('#clientes-body').append(fila);
      });
    },
    error: function () {
      alert('Error cargando datos de clientes');
    }
  });
});
