if (localStorage.getItem('token')) {
    if (window.location.pathname !== '/loggedInView.html') {
        window.location.href = 'loggedInView.html'
    }
} else {
    if (!['/', '/register.html'].includes(window.location.pathname)) {
        window.location.href = '/'
    }
}

async function login () {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const loginData = await axios.post('api/authenticate', {
        username: username,
        password: password
    }).catch(err => {
        alert('Sisselogimine ebaõnnestus')
    })

    localStorage.setItem('token', loginData.data.token)
    localStorage.setItem('firstName', loginData.data.firstName)
    localStorage.setItem('lastName', loginData.data.lastName)
    localStorage.setItem('userGroups', loginData.data.userGroups)

    window.location.href = 'loggedInView.html'

    console.log({username, password})
}

function logout () {
    localStorage.clear()
    window.location.href = '/'
}
async function register () {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const firstname = document.getElementById("firstname").value
    const lastname = document.getElementById("lastname").value


    await axios.post('api/register', {
        username: username,
        password: password,
        firstName: firstname,
        lastName: lastname,
        userGroups: ["admin"]
    }).catch(err => {
        alert('Sisselogimine ebaõnnestus')
    })

    

    window.location.href = '/'

   
}