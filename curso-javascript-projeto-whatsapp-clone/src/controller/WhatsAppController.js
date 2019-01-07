import {Format} from './../util/Format';
import {CameraController} from './CameraController';
import {MicrophoneController} from './MicrophoneController';
import {DocumentPreviewController} from './DocumentPreviewController';
import {Firebase} from './../util/Firebase';

export class WhatsAppController {

    constructor() {

        console.log('WhatsAppController OK');

        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
        this._firebase = new Firebase();
    
    }

    initAuth() {

        this._firebase.initAuth()
            .then(response => {
                console.log('response', response);
            })
            .catch(err => {
                console.error(err);
            });

    }

    loadElements() {

        this.el = {};

        document.querySelectorAll('[id]').forEach(element => {

            this.el[Format.getCamelCase(element.id)] = element;

        });

    }

    elementsPrototype() {

        // Função para esconder a tag que chamar
        Element.prototype.hide = function() {
            this.style.display = 'none';

            return this;
        }

        // Função para mostrar a tag que chamar
        Element.prototype.show = function(type = 'block') {
            this.style.display = type;

            return this;
        }

        // Função para inverter a visualização da tag que chamar
        Element.prototype.toggle = function(type = 'block') {
            this.style.display = (this.style.display === 'none') ? type : 'none';

            return this;
        }

        // Carrega eventos que forem passados
        Element.prototype.on = function(events, fn) {
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });

            return this;
        }

        // Carrega as propriedades de estilo num elemento
        Element.prototype.css = function(styles) {
            for(let name in styles) {
                this.style[name] = styles[name];
            }

            return this;
        }

        // Adicionar classe(s)
        Element.prototype.addClass = function(names) {
            names.split(' ').forEach(name => {
                this.classList.add(name);
            });

            return this;
        }

        // Remover classe(s)
        Element.prototype.removeClass = function(names) {
            names.split(' ').forEach(name => {
                this.classList.remove(name);
            });

            return this;
        }

        // Toggle classe(s)
        Element.prototype.toggleClass = function(names) {
            names.split(' ').forEach(name => {
                this.classList.toggle(name);
            });

            return this;
        }

        // Se existe a classe
        Element.prototype.hasClass = function(name) {
            return this.classList.contains(name);
        }

        // Pega todos os dados de um formulário
        HTMLFormElement.prototype.getForm = function() {
            return new FormData(this);
        }

        // Transformar os dados do formuário em estrutura JSON
        HTMLFormElement.prototype.toJSON = function() {
            
            let json = {};

            this.getForm().forEach((value, key) => {
                json[key] = value;
            });

            return json;

        }

    }

    initEvents() {

        // Abre painel do perfil do usuário
        this.el.myPhoto.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();

            setTimeout(() => {
                this.el.panelEditProfile.addClass('open');
            }, 300);

        });

        // Abre painel de adicionar novo contato
        this.el.btnNewContact.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            
            setTimeout(() => {
                this.el.panelAddContact.addClass('open');
            }, 300);

        });

        // Fechar painel do perfil do usuário
        this.el.btnClosePanelEditProfile.on('click', e => {
            this.el.panelEditProfile.removeClass('open');
        });

        // Fechar painel de adicionar novo contato
        this.el.btnClosePanelAddContact.on('click', e => {
            this.el.panelAddContact.removeClass('open');
        });

        // Abrir folder para subir a foto de perfil
        this.el.photoContainerEditProfile.on('click', e => {
            this.el.inputProfilePhoto.click();
        });

        // Enquanto estiverem digitando no input
        this.el.inputNamePanelEditProfile.on('keypress', e => {

            if (e.key === 'Enter') {

                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();

            }

        });

        // Clique de confirmação de alteração do nome
        this.el.btnSavePanelEditProfile.on('click', e => {
            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        // Formulário de novo-contato foi enviado
        this.el.formPanelAddContact.on('submit', e => {

            e.preventDefault();
            let formData = new FormData(this.el.formPanelAddContact);

        });

        // Algum dos contatos foi clicados
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

            item.on('click', e => {

                this.el.home.hide();
                this.el.main.show('flex');

            });

        });

        // Clicaram para anexar numa conversa
        this.el.btnAttach.on('click', e => {

            // Parar a propagação para que os seus ancestrais não escute a função
            e.stopPropagation();

            this.el.menuAttach.addClass('open');
            
            // Fecha o menu de anexar
            document.addEventListener('click', this.closeMenuAttach.bind(this));

        });

        /*************************************************** */
        // Clicaram para adicionar uma foto
        this.el.btnAttachPhoto.on('click', e => {
            this.el.inputPhoto.click();
        });

        // Abrir o files para selecionar a foto
        this.el.inputPhoto.on('change', e => {
            console.log(this.el.inputPhoto.files);

            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
            });
        });
        /*************************************************** */

        
        /*************************************************** */
        // Clicaram para tirar uma foto
        this.el.btnAttachCamera.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height' : 'calc(100% - 120px)'
            });

            this._camera = new CameraController(this.el.videoCamera);
        
        });

        // Fechar painel da camera
        this.el.btnClosePanelCamera.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();

        });

        // Tirar a foto
        this.el.btnTakePicture.on('click', e => {
           
            let dataURL = this._camera.takePicture();

            this.el.pictureCamera.src = dataURL;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();

            this.el.btnReshootPanelCamera.show();

            this.el.btnTakePicture.hide();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();

        });

        // Tirar foto novamente
        this.el.btnReshootPanelCamera.on('click', e => {

            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();

        });

        // Enviar a foto que foi tirada
        this.el.btnSendPicture.on('click', e => {

            console.log(this.el.pictureCamera.src);

        });
        /*************************************************** */


        /*************************************************** */
        // Clicaram para enviar um documento
        this.el.btnAttachDocument.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelCamera.css({
                'height' : 'calc(100% - 120px)'
            });

            this.el.inputDocument.click();
        
        });

        // Quando selecionar algum arquivo
        this.el.inputDocument.on('change', e => {

            if (this.el.inputDocument.files.length) {

                this.el.panelDocumentPreview.css({
                    'height':'1%'
                });

                let file = this.el.inputDocument.files[0];
                
                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result => {
                    
                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info; 

                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
						'height':'calc(100% - 120px)'
					});

                }).catch(err => {

                    this.el.panelDocumentPreview.css({
						'height':'calc(100% - 120px)'
					});
                    
                    switch (file.type) {

                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;

                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;

                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;

                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;

                    }

                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();

                });
            }

        });

        // Fechar envio de documento
        this.el.btnClosePanelDocumentPreview.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();

        });

        // Clicaram para enviar documento
        this.el.btnSendDocument.on('click', e => {
            console.log('send document');
        });
        /*************************************************** */


        /*************************************************** */
        // Clicaram para enviar um contato
        this.el.btnAttachContact.on('click', e => {
            this.el.modalContacts.show();
        });

        // Fechar lista de contato
        this.el.btnCloseModalContacts.on('click', e => {
            this.el.modalContacts.hide();
        });
        /*************************************************** */
        
        /*************************************************** */
        // Clicar no microfone para gravar o áudio
        this.el.btnSendMicrophone.on('click', e => {
            
            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio => {
                
                console.log('ready event');

                this._microphoneController.startRecorder();

            });

            this._microphoneController.on('recordtimer', timer => {
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });

        });        

        // Cancelar gravação de áudio
        this.el.btnCancelMicrophone.on('click', e => {
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();
        });

        // Finalizar gravação de áudio
        this.el.btnFinishMicrophone.on('click', e => {
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();
        });
        /*************************************************** */

        /*************************************************** */
        // Começou a digitar esconde o placeholder e troca o botão do microfone para o de enviar
        this.el.inputText.on('keyup', e => {

            if (this.el.inputText.innerHTML.length) {

                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();

            } else {

                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();

            }

        });

        // Quando apertar enter envia a mensagem
        this.el.inputText.on('keypress', e => {

            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.el.btnSend.click();
            }

        });

        // Envia a mensagem
        this.el.btnSend.on('click', e => {

            console.log(this.el.inputText.innerHTML);

        });
        /*************************************************** */


        /*************************************************** */
        // Abrir caixa de emojis
        this.el.btnEmojis.on('click', e => {
            this.el.panelEmojis.toggleClass('open');
        });

        // Clicou em algum emoji
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', e => {

                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name => {
                    img.classList.add(name);
                });

                let cursor = window.getSelection();

                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
                    this.el.inputText();
                    cursor = window.getSelection();
                }

                let range = document.createRange();

                range = cursor.getRangeAt(0);
                range.deleteContents();

                let frag = document.createDocumentFragment();

                frag.appendChild(img);

                range.insertNode(frag);

                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup'));

            });
        });
        /*************************************************** */

    }
    
    // Para de contar e gravar o áudio
    closeRecordMicrophone() {

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();

    }

    // Fechar todos os paineis principais para não haver sobreposição do z-index
    closeAllMainPanel() {

        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');

    }

    // Fechar o menu de anexo numa conversa
    closeMenuAttach() {

        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');

    }

    // Fechar todos os paineis para não haver sobreposição do z-index
    closeAllLeftPanel() {

        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();

    }

}