
document.addEventListener('DOMContentLoaded', function() {
    // Máscaras para campos
    document.getElementById('data-nascimento').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        e.target.value = value;
    });

    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) {
            value = value.substring(0, 3) + '.' + value.substring(3);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '.' + value.substring(7);
        }
        if (value.length > 11) {
            value = value.substring(0, 11) + '-' + value.substring(11, 13);
        }
        e.target.value = value;
    });

    document.getElementById('Cep').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        e.target.value = value;
    });

    // Validação do formulário
    document.querySelector('.btn.submit').addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm()) {
            saveFormData();
            alert('Inscrição realizada com sucesso!');
            window.location.href = 'final.html';
        }
    });

    function validateForm() {
        let isValid = true;
        const inputs = document.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            const errorElement = document.getElementById(`${input.id}-error`) || 
                                createErrorElement(input);
            
            if (!input.value.trim()) {
                showError(errorElement, 'Este campo é obrigatório');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                showError(errorElement, 'Por favor, insira um email válido');
                isValid = false;
            } else if (input.id === 'cpf' && !validateCPF(input.value)) {
                showError(errorElement, 'CPF inválido');
                isValid = false;
            } else if (input.id === 'data-nascimento' && !validateDate(input.value)) {
                showError(errorElement, 'Data de nascimento inválida (dd/mm/aaaa)');
                isValid = false;
            } else if (input.id === 'Cep' && !validateCEP(input.value)) {
                showError(errorElement, 'CEP inválido');
                isValid = false;
            } else {
                hideError(errorElement);
            }
        });

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            const errorElement = document.getElementById(`${input.id}-error`) || 
                                createErrorElement(input);
            
            if (!input.files || input.files.length === 0) {
                showError(errorElement, 'Por favor, selecione um arquivo');
                isValid = false;
            } else {
                hideError(errorElement);
            }
        });

        const checkbox = document.querySelector('.checkbox-label input');
        if (!checkbox.checked) {
            alert('Você deve concordar com os Termos e Condições para continuar');
            isValid = false;
        }

        return isValid;
    }

    function createErrorElement(input) {
        const errorElement = document.createElement('div');
        errorElement.id = `${input.id}-error`;
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
        return errorElement;
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function hideError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,'');
        if(cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        for(let i=0; i<9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if(resto === 10 || resto === 11) resto = 0;
        if(resto !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for(let i=0; i<10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if(resto === 10 || resto === 11) resto = 0;
        if(resto !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    function validateDate(date) {
        const re = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!re.test(date)) return false;
        
        const parts = date.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        if (year < 1900 || year > new Date().getFullYear()) return false;
        if (month < 1 || month > 12) return false;
        
        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }
        
        return day > 0 && day <= monthLength[month - 1];
    }

    function validateCEP(cep) {
        cep = cep.replace(/\D/g, '');
        return cep.length === 8;
    }

    // Salvar dados no LocalStorage
    function saveFormData() {
        const formData = {
            nome: document.querySelector('input[placeholder="Seu nome aqui..."]').value,
            dataNascimento: document.getElementById('data-nascimento').value,
            cpf: document.getElementById('cpf').value,
            sexo: document.getElementById('sexo').value,
            email: document.querySelector('input[type="email"]').value,
            telefone: document.querySelector('input[placeholder="Digite seu Telefone..."]').value,
            cep: document.getElementById('Cep').value,
            rua: document.querySelector('input[placeholder="Rua..."]').value,
            numero: document.querySelector('input[placeholder="Número..."]').value,
            cidade: document.querySelector('input[placeholder="Cidade..."]').value,
            estado: document.querySelector('input[placeholder="Seu estado aqui..."]').value,
            trilha: document.querySelector('input[name="curso"]:checked').nextElementS.querySelector('p').textContent,
            userId: document.getElementById('user-id').value,
            password: document.getElementById('password').value
        };

        // Salva os dados do usuário para login posterior
        localStorage.setItem('userData', JSON.stringify({
            userId: formData.userId,
            password: formData.password,
            email: formData.email
        }));

        // Salva todos os dados do formulário
        localStorage.setItem('formData', JSON.stringify(formData));
    }
});