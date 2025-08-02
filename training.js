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
}

function checkAnswers() {
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`step${i}`);
        const value = input.value.trim();
        if (value === answers[`step${i}`]) {
            input.style.borderColor = 'green';
        } else {
            input.style.borderColor = 'red';
        }
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
