class UserController {

    constructor (formIdCreate, formIdUpdate, tableId) {
        this.formCreateEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    } // Closing construtor

    onEdit () {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", e => {
            e.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true;

            let user = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            
            let userOld = JSON.parse(tr.dataset.user);
            
            let result = Object.assign({}, userOld, user); 

            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if (!user.photo) { 
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    let newUser = new User();
                    newUser.loadFromJSON(result);

                    newUser.save();

                    this.getTr(newUser, tr);  

                    this.updateCount();  

                    btn.disabled = false;
                    this.formUpdateEl.reset();

                    this.showPanelCreate();
                    
                }, (e) => {
                    console.error(e)
                }
            );
        });

    } // Closing onEdit

    onSubmit () {
        this.formCreateEl.addEventListener("submit", (e) => {
            e.preventDefault();

            let btn = this.formCreateEl.querySelector("[type=submit]");
            btn.disabled = true;

            let user = this.getValues(this.formCreateEl);

            if (!user) return false;

            this.getPhoto(this.formCreateEl).then(
                (content) => {
                    user.photo = content;

                    // Inserindo no localstorage
                    user.save();

                    // Inserindo a linha na tabela
                    this.addLine(user);

                    this.formCreateEl.reset();
                    btn.disabled = false;
                }, (e) => {
                    console.error(e)
                }
            );
        });
    } // Closing onSubmit

    getPhoto (formEl) {
        return new Promise ((resolve, reject) => {
            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {
                if (item.name == "photo") {
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {
                reject(e);
            }

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        });
    } // Closing getPhoto

    getValues (formEl) {
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach (function (field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (field.name == "gender") {
                if (field.checked) { user[field.name] = field.value; }
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false;
        }

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );
    } // Closing getValues

    selectAll() {
        let users = User.getUsersStorage();

        users.forEach(dataUser => {
            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);
        });
    } // Closing selectAll

    addLine (dataUser) {   
        let tr = this.getTr(dataUser);      

        this.tableEl.appendChild(tr);

        this.updateCount();
    } // Closing addLine

    getTr(dataUser, tr = null) {
        if(tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);  

        tr.innerHTML = 
            `<td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
             <td>${dataUser.name}</td>
             <td>${dataUser.email}</td>
             <td>${(dataUser.admin) ? "Sim" :  "Não"}</td>
             <td>${Utils.dateFormat(dataUser.register)}</td>
             <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
             </td>`;

        this.addEventsTr(tr);

        return tr;
    }

    addEventsTr (tr) {
        tr.querySelector(".btn-delete").addEventListener("click", e => { 
            if (confirm("Deseja realmente excluir?")) {
                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();

                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let data = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in data) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {                    
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + data[name] + "]");
                            field.checked = true;
                            break;
                        
                        case 'checkbox':
                            field.checked = data[name];
                            break;
                            
                        default:
                            field.value = data[name];
                    }
                }
            }

            this.formUpdateEl.querySelector(".photo").src = data._photo;

            this.showPanelUpdate();
        });
    } // Closing addEventsTr

    showPanelCreate () {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    } // Closing showPanelCreate

    showPanelUpdate () {
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    } // Closing showPanelUpdate

    updateCount () {
        let numberUsers = 0;
        let numberAdmins = 0;
        
        [...this.tableEl.children].forEach(tr => {
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmins++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admins").innerHTML = numberAdmins;
    } // Closing updateCount
}