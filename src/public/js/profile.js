let photoElement = document.querySelector('#profile_photo')


photoElement.addEventListener('change', async (event) => {
    if (event.target.files.length) {
        let formData = new FormData()
        formData.append('photo', event.target.files[0])
        let res = await fetch('/profile/photo', {
            method: "POST",
            body: formData
        })
        res = await res.json()
        if ( res.ok ) {
            window.location.reload()
        } else {
            alert('Error!')
        }
    }
})
