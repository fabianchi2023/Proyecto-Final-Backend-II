document.addEventListener('DOMContentLoaded', () => {
    const socket = io()

    const productsList = document.getElementById('productsList')
    const newProductForm = document.getElementById('newProductForm')

    socket.emit('getProducts')

    socket.on('updateProducts', (products) => {
        productsList.innerHTML = ''
        products.forEach(product => {
            const productElement = document.createElement('li')
            productElement.setAttribute('data-id', product._id)
            productElement.innerHTML = `
                Nombre: ${product.title} -  Precio: $${product.price}
                <button class="delete-btn btn btn-danger btn-sm mb-2" data-id="${product._id}">Eliminar</button>`
            productsList.appendChild(productElement)
        })


        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id')
                socket.emit('deleteProduct', productId)
            })
        })
    })

    newProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value
        const description = document.getElementById('description').value
        const code = document.getElementById('code').value
        const price = document.getElementById('price').value
        const status = document.getElementById('status').value
        const stock = document.getElementById('stock').value
        const category = document.getElementById('category').value
        socket.emit('newProduct', { title, description, code, price, status, stock, category })
        newProductForm.reset()
    });

    socket.on('productDeleted', (productId) => {
        const productElement = document.querySelector(`li[data-id='${productId}']`)
        if (productElement) {
            productElement.remove();
        } else {
            console.error(`No se encontró el elemento con data-id=${productId}`)
        }
    })

})