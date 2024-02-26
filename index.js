const fileSelector = document.getElementById('file-selector');
let isPasswordOk = false;
let password = "";
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let transformedResult = '';

fileSelector.addEventListener('change', (e) => {
    if (!checker()) {
        return;
    }

    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
        let result = evt.target.result;
        const mp = new Map();
        for (let i = 0; i < alphabet.length; i++) {
            mp[alphabet[i]] = password[i];
        }
        transformedResult = '';
        for (let i = 0; i < result.length; i++) {
            if (result[i] < 'a' || result[i] > 'z') {
                transformedResult += result[i];
            } else {
                transformedResult += mp[result[i]];
            }
        }
        downloadFile(transformedResult);
        fileSelector.value = '';
    }
});

function checker() {
    password = "";
    const hashKey = document.getElementById('hash-key').value;
    if (hashKey.length != 26) {
        fileSelector.value = "";
        alert("Неправильний ключ кодування.");
        return false;
    }
    const map = new Map();

    for (let i = 0; i < alphabet.length; i++) {
        map.set(alphabet[i], 1);
    }
    for (let i = 0; i < hashKey.length; i++) {
        if (map.has(hashKey[i])) {
            map.set(hashKey[i], map.get(hashKey[i]) - 1);
        } else {
            map.set(hashKey[i], -1);
        }
    }
    for (let [_, val] of map) {
        if (val !== 0) {
            fileSelector.value = "";
            alert("Неправильний ключ кодування.");
            return false;
        }
    }
    for (let i = 0; i < hashKey.length; i++) {
        password += hashKey[i];
    }
    isPasswordOk = true;
    return true;
}

function downloadFile(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformed_text.txt';

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 0);
}
