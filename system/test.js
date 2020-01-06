var username = $('#username').val();

var button = $('button').on('click', () => {
    console.log($('#username').val());
})

$('#username').on('keypress', async event => {
    if(event.which == 13) {
        console.log($('#username').val());
    }
})

