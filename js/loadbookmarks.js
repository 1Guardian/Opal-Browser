var myBooks = [];

function CreateTableFromJSON() {
    $.getJSON("C:/Users/Administrator/Documents/rrss/bookmarks.json", function(data) {
        var table = $("#Table").empty();
        if (!Array.isArray(data)){
                table.append('<tr><td class="mdl-data-table__cell--non-numeric"><img src="' + 'data:image/png;base64,' + data.icon +'"/><a href="' + data.url + '"> ' + data.title +'</a></td></tr>');
        }
        else {
            $.each(data, function (i, member) {
                table.append('<tr><td class="mdl-data-table__cell--non-numeric"><img src="' + 'data:image/png;base64,' + member.icon +'"/><a href="' + member.url + '"> ' + member.title +'</a></td></tr>');
            });
        }
    });
}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        CreateTableFromJSON();
    }
});