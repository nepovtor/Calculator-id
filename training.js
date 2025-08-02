let answers = {};

function getRandomOctet() {
    return Math.floor(Math.random() * 256);
}

function generateChallenge() {
    const ip = `${getRandomOctet()}.${getRandomOctet()}.${getRandomOctet()}.${getRandomOctet()}`;
    const cidr = Math.floor(Math.random() * 30) + 1; // 1-30
    document.getElementById('randomIP').innerText = `${ip}/${cidr}`;

    const subnetMask = cidrToMask(cidr);
    const networkAddress = calculateNetworkAddress(ip, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
    const hostRange = calculateHostRange(networkAddress, broadcastAddress);
    const ipBinary = ipToBinary(ip).match(/.{1,8}/g).join('.');

    answers = {
        step1: ipBinary,
        step2: subnetMask,
        step3: networkAddress,
        step4: broadcastAddress,
        step5: hostRange
    };

    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`step${i}`);
        input.value = '';
        input.style.borderColor = '#00BCD4';
    }
    const message = document.getElementById('congrats');
    message.style.display = 'none';
    message.innerText = '';
}

function checkAnswers() {
    let allCorrect = true;
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`step${i}`);
        const value = input.value.trim();
        if (value === answers[`step${i}`]) {
            input.style.borderColor = 'green';
        } else {
            input.style.borderColor = 'red';
            allCorrect = false;
        }
    }
    if (allCorrect) {
        const messages = [
            "Ты молодец!",
            "Ты крутой!",
            "У тебя все получится!",
            "Так держать!",
            "Отличная работа!",
            "Ты просто гений!",
            "Невероятно!",
            "Ты на правильном пути!",
            "Ты сделал это!",
            "Браво!",
            "Фантастический результат!",
            "Ты настоящий профи!",
            "Уже мастерство!",
            "У тебя золотой мозг!",
            "Превосходно!",
            "Умничка!",
            "Потрясающе!",
            "Ты лучший!",
            "Великолепно!",
            "Супер!",
            "Так и продолжай!",
            "Ты достиг цели!",
            "Твой прогресс впечатляет!",
            "Ты на высоте!",
            "Заслуженный успех!",
            "Это было блестяще!",
            "Талантливо!",
            "Достойно аплодисментов!",
            "Твоя настойчивость окупилась!",
            "Ты растешь с каждым шагом!",
            "С каждым разом всё лучше!",
            "Победа за тобой!",
            "Горжусь тобой!",
            "Смело и точно!",
            "Великолепная работа!",
            "Талант видно сразу!",
            "Нельзя не восхититься!",
            "У тебя железная логика!",
            "Потрясающее мышление!",
            "Ты почти хакер!",
            "Ты пример для остальных!",
            "Вдохновляешь!",
            "Этот успех заслужен!",
            "Ты отлично постарался!",
            "Отличный подход!",
            "Ты превосходишь ожидания!",
            "Такого результата не каждый добьется!",
            "Твой мозг сверкает!",
            "Блестяще выполнено!",
            "Ты полностью справился!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const messageElement = document.getElementById('congrats');
        messageElement.innerText = randomMessage;
        messageElement.style.display = 'block';
    }
}

function cidrToMask(cidr) {
    let mask = '';
    for (let i = 0; i < 32; i++) {
        mask += i < cidr ? '1' : '0';
    }
    return mask.match(/.{1,8}/g).map(e => parseInt(e, 2)).join('.');
}

function ipToBinary(ip) {
    return ip.split('.').map(octet => ('00000000' + parseInt(octet).toString(2)).slice(-8)).join('');
}

function binaryToIp(binary) {
    return binary.match(/.{1,8}/g).map(e => parseInt(e, 2)).join('.');
}

function calculateNetworkAddress(ip, mask) {
    const ipBinary = ipToBinary(ip);
    const maskBinary = ipToBinary(mask);
    const networkBinary = [...ipBinary].map((bit, i) => bit & maskBinary[i]).join('');
    return binaryToIp(networkBinary);
}

function calculateBroadcastAddress(networkAddress, mask) {
    const networkBinary = ipToBinary(networkAddress);
    const maskBinary = ipToBinary(mask);
    const invertedMaskBinary = maskBinary.split('').map(bit => bit === '1' ? '0' : '1').join('');
    const broadcastBinary = [...networkBinary].map((bit, i) => bit | invertedMaskBinary[i]).join('');
    return binaryToIp(broadcastBinary);
}

function calculateHostRange(networkAddress, broadcastAddress) {
    const networkBinary = ipToBinary(networkAddress);
    const broadcastBinary = ipToBinary(broadcastAddress);

    const firstHostBinary = (parseInt(networkBinary, 2) + 1).toString(2).padStart(32, '0');
    const lastHostBinary = (parseInt(broadcastBinary, 2) - 1).toString(2).padStart(32, '0');

    return `${binaryToIp(firstHostBinary)} - ${binaryToIp(lastHostBinary)}`;
}

window.onload = generateChallenge;
