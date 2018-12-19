class User {

    constructor (name, gender, birth, country, email, password, photo, admin) {

        this._id;
        this._name     = name;
        this._gender   = gender;
        this._birth    = birth;
        this._country  = country;
        this._email    = email;
        this._password = password;
        this._photo    = photo;
        this._admin    = admin;
        this._register = new Date();

    }

    loadFromJSON(json) {

        for (let name in json) {

            switch(name) {
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                   this[name] = json[name];
            }
            
        }

    } // Closing loadFromJSON

    static getUsersStorage() {
        let users = [];

        //if (sessionStorage.getItem("users")) {
            //users = JSON.parse(sessionStorage.getItem("users"));
        //}

        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    } // Closing getUsersStorage

    getNewId() {

        let usersID = parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0) usersID = 0;
        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;

    }

    save() {

        let users = User.getUsersStorage();

        if (this._id > 0) {

            users = users.map(u => {
                if (u._id == this.id) {
                    u = this;
                }

                return u;
            });

        } else {

            this._id = this.getNewId();
            users.push(this);

        }

        //sessionStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("users", JSON.stringify(users));

    } // Closing save

    remove() {

        let users = this.getUsersStorage();

        users.forEach((userData, index) => {

            if (this._id == userData._id) {

                users.splice(index, 1);
            
            }

        });

        localStorage.setItem("users", JSON.stringify(users));

    } // Closing remove

    /* *********** Início id *********** */
    get id() {
        return this._id;
    }

    /* *********** Início register *********** */
    get register() {
        return this._register;
    }

    /* *********** Início name *********** */
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    /* *********** Início gender *********** */
    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._gender = value;
    }

    /* *********** Início birth *********** */
    get birth() {
        return this._birth;
    }

    set birth(value) {
        this._birth = value;
    }

    /* *********** Início country *********** */
    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }

    /* *********** Início email *********** */
    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    /* *********** Início password *********** */
    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    /* *********** Início photo *********** */
    get photo() {
        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

    /* *********** Início admin *********** */
    get admin() {
        return this._admin;
    }

    set admin(value) {
        this._admin = value;
    }

}