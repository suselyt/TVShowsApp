document.addEventListener('DOMContentLoaded', () => {
    // obtener las variables por id
    const form = document.getElementById('form-tvshows');
    const awardsContainer = document.getElementById('awards-container');
    const showsList = document.getElementById('shows-list')

    // agregar nuevo premio
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'add-award') {
            const awardDiv = document.createElement('div');
            awardDiv.className = 'mb-3 border p-3';
            awardDiv.innerHTML = `
                <label class="form-label">Categoría</label>
                <input type="text" class="form-control mb-2 award-category">
                <label class="form-label">Año</label>
                <input type="number" class="form-control award-year">
                <button type="button" class="btn btn-danger btn-sm mt-2 remove-award">Eliminar</button>
            `;
            awardsContainer.appendChild(awardDiv);
        }

        // Eliminar premio
        if (e.target.classList.contains('remove-award')) {
            e.target.closest('div').remove();
        }
    });

    // POST backend
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        //obtener info
        const streaming = document.getElementById('streaming').value
            .split(',')
            .map(platform => platform.trim());

        const awards = Array.from(document.querySelectorAll('.award-category')).map((category, index) => {
            return {
                category: category.value,
                year: document.querySelectorAll('.award-year')[index].value
            };
        });

        //datos agrupados
        const newShow = {
            name: document.getElementById('name').value,
            seasons: parseInt(document.getElementById('seasons').value),
            streaming: streaming,
            running: document.getElementById('running').checked,
            awards: { name: awards }
        };

        //enviar datos
        try {
            const response = await fetch('http://localhost:3000/api/shows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newShow)
            });
            const data = await response.json();
            alert('Serie guardada exitosamente!');
            loadShows(); // Recargar la lista
        } catch (error) {
            console.error('Error:', error);
        }
    });

    //GET all shows
    async function loadShows() {
        try {
            const response = await fetch('http://localhost:3000/api/shows');
            const shows = await response.json();

            showsList.innerHTML = shows.map(show => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text">Seasons: ${show.seasons}</p>
                        <p class="card-text">Platforms: ${show.streaming.join(', ')}</p>
                        <p class="card-text">Running? ${show.running ? '<i class="fa fa-check" aria-hidden="true"></i> Yes' : '<i class="bi bi-x-circle-fill text-danger"></i> No'}</p>
                        <button onclick="deleteShow('${show._id}')" class="btn btn-danger btn-sm">Delete</button>
                        <button onclick="editShow('${JSON.stringify(show).replace(/"/g, '&quot;')}')" class="btn btn-warning btn-sm">Edit</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error al cargar series:', error);
        }
    }

    //DELETE show
    window.deleteShow = async (id) => {
        if (confirm('¿Eliminar esta serie?')) {
            await fetch(`http://localhost:3000/api/show/${id}`, { method: 'DELETE' });
            loadShows(); // Recargar la lista
        }
    };


    // modal de editar
    window.editShow = (show) => {
        const showData = typeof show === 'string' ? JSON.parse(show.replace(/&quot;/g, '"')) : show;
        const modalContent = `
        <form id="edit-show-form">
            <input type="hidden" id="edit-id" value="${showData._id}">
            <div class="mb-3">
                <label for="edit-name" class="form-label">Name</label>
                <input type="text" id="edit-name" class="form-control" value="${showData.name}" required>
            </div>
            <div class="mb-3">
                <label for="edit-seasons" class="form-label">Seasons</label>
                <input type="number" id="edit-seasons" class="form-control" min="1" value="${showData.seasons}" required>
            </div>
            <div class="mb-3">
                <label for="edit-streaming" class="form-label">Platforms</label>
                <input type="text" id="edit-streaming" class="form-control" value="${showData.streaming.join(', ')}">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" id="edit-running" class="form-check-input" ${showData.running ? 'checked' : ''}>
                <label for="edit-running" class="form-check-label">Currently running?</label>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    `;

        document.getElementById('modal-edit-content').innerHTML = modalContent;

        const modal = new bootstrap.Modal(document.getElementById('modal-edit-show'));
        modal.show();

        // EDIT show
        document.getElementById('edit-show-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedShow = {
                name: document.getElementById('edit-name').value,
                seasons: parseInt(document.getElementById('edit-seasons').value),
                streaming: document.getElementById('edit-streaming').value.split(',').map(s => s.trim()),
                running: document.getElementById('edit-running').checked
            };

            try {
                await fetch(`http://localhost:3000/api/show/${showData._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedShow)
                });
                loadShows();
                modal.hide();
            } catch (error) {
                console.error('Error updating show:', error);
            }
        });
    };

    loadShows();

});