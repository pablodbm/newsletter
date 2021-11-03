const express = require("express");
const app = express();
const PORT = 3000;

let users = [
    { nick: "111", email: "111@w.pl" },
    { nick: "222", email: "222@w.pl" },
    { nick: "333", email: "333@w.pl" },
];

app.use(express.static("static"));
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/
    return re.test(String(email).toLowerCase());
}
//GETY
app.get("/removeUserBySelect", (req, res) => {
    let site =
        '<html><body><form method="POST" action="/removeUser"><select name="user">';
    site += users.map(
        (item, index) => `<option value=${index}>${item.email}</option>`
    );
    site += '</select><input type="submit" value="usuń"></form></body></html>';
    return res.send(site);
});

app.get("/removeUserByRadio", (req, res) => {
    let site = '<html><body><form method="POST" action="/removeUser">';
    users.forEach((item, index) => {
        site += `<input type="radio" name="user" value=${index}><label>${item.email}</label><br>`;
    });
    site += '<input type="submit" value="usuń"></form></body></html>';
    return res.send(site);
});
app.get("/removeUserByCheckbox", (req, res) => {
    let site = '<html><body><form method="POST" action="/removeMultipleUsers">';
    users.forEach((item, index) => {
        site += `<input type="checkbox" name="user" value=${index}><label>${item.email}</label><br>`;
    });
    site += '<input type="submit" value="usuń"></form></body></html>';
    return res.send(site);
});

//POSTY
app.post("/removeMultipleUsers", (req, res) => {
    console.log(req.body);
    if (req.body.user) {
        if (Array.isArray(req.body.user)) {
            users = users.filter((item, index) => req.body.user.indexOf(index.toString()) == -1);
        } else {
            users.splice(req.body.user, 1);
        }
    }
    res.redirect(req.get("referer"));
});
app.post("/removeUser", (req, res) => {
    users.splice(req.body.user, 1);
    console.log(users);
    // return res.status(200).redirect(req.get("host"))
    res.redirect(req.get("referer"));
});
app.post("/addUser", (req, res) => {
    // console.log(req.body)
    if (!req.body.nick || !req.body.email) {
        return res.status(400).send("Błędne dane");
    }
    if (users.filter(({ email }) => email == req.body.email).length > 0) {
        return res.status(400).send("email już jest w bazie");
    }
    console.log(validateEmail(req.body.email))
    console.log(validateEmail("ww@.pl"))
    console.log(validateEmail("ww@gmail.com"))
    if (!validateEmail(req.body.email)) {
        return res.status(400).send("błędny format emaila");
    }
    users.push({ nick: req.body.nick, email: req.body.email });
    res.status(200).send("user dodany");
});
