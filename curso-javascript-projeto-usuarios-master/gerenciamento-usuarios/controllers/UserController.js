class UserController {

    constructor (formIdCreate, formIdUpdate, tableId) {
        this.formCreateEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
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
            
            tr.dataset.user = JSON.stringify(user);
            tr.innerHTML = 
                `<td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${(user.admin) ? "Sim" :  "Não"}</td>
                <td>${Utils.dateFormat(user.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>`;

            this.addEventsTr(tr);

            this.updateCount();            
        });

    } // Closing onEdit

    onSubmit () {
        this.formCreateEl.addEventListener("submit", (e) => {
            e.preventDefault();

            let btn = this.formCreateEl.querySelector("[type=submit]");
            btn.disabled = true;

            let user = this.getValues(this.formCreateEl);

            if (!user) return false;

            this.getPhoto().then(
                (content) => {
                    user.photo = content;
                    this.addLine(user);

                    this.formCreateEl.reset();
                    btn.disabled = false;
                }, (e) => {
                    console.error(e)
                }
            );
        });
    } // Closing onSubmit

    getPhoto () {
        return new Promise ((resolve, reject) => {
            let fileReader = new FileReader();

            let elements = [...this.formCreateEl.elements].filter(item => {
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

    addLine (dataUser) {    
        let tr = document.createElement('tr');
        
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = 
            `<td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
             <td>${dataUser.name}</td>
             <td>${dataUser.email}</td>
             <td>${(dataUser.admin) ? "Sim" :  "Não"}</td>
             <td>${Utils.dateFormat(dataUser.register)}</td>
             <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
             </td>`;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    } // Closing addLine

    addEventsTr (tr) {
        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let data = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");

            form.dataset.trIndex = tr.sectionRowIndex;

            for (let name in data) {
                let field = form.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {                    
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + data[name] + "]");
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