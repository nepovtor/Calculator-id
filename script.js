function calculateSubnet() {
    const input = document.getElementById('ip').value;
    const [ip, cidr] = input.split('/');

    if (!ip || !cidr) {
        alert("Please enter a valid IP address and CIDR");
        return;
    }

    const subnetMask = cidrToMask(parseInt(cidr));
    const networkAddress = calculateNetworkAddress(ip, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
    const hostRange = calculateHostRange(networkAddress, broadcastAddress);

    // Выводим результаты
    document.getElementById('subnetMask').innerText = subnetMask;
    document.getElementById('networkAddress').innerText = networkAddress;
    document.getElementById('broadcastAddress').innerText = broadcastAddress;
    document.getElementById('hostRange').innerText = hostRange;

    // Генерация подробного решения
    const solution = generateSolution(ip, cidr, subnetMask, networkAddress, broadcastAddress, hostRange);
    document.getElementById('solution').innerHTML = solution;
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
    const maskBinary = ipToBinary(mask).replace(/1/g, '0').replace(/0/g, '1');
    const broadcastBinary = [...networkBinary].map((bit, i) => bit | maskBinary[i]).join('');
    return binaryToIp(broadcastBinary);
}

function calculateHostRange(networkAddress, broadcastAddress) {
    const networkBinary = ipToBinary(networkAddress);
    const broadcastBinary = ipToBinary(broadcastAddress);

    const firstHostBinary = (parseInt(networkBinary, 2) + 1).toString(2).padStart(32, '0');
    const lastHostBinary = (parseInt(broadcastBinary, 2) - 1).toString(2).padStart(32, '0');

    return `${binaryToIp(firstHostBinary)} - ${binaryToIp(lastHostBinary)}`;
}

function generateSolution(ip, cidr, subnetMask, networkAddress, broadcastAddress, hostRange) {
    const ipBinary = ipToBinary(ip);
    const maskBinary = ipToBinary(subnetMask);
    const networkBinary = ipToBinary(networkAddress);
    const broadcastBinary = ipToBinary(broadcastAddress);

    return `
        <div class="solution-step">
            <h3>1. Введенный IP-адрес</h3>
            <p>IP-адрес: <span class="highlight">${ip}</span> (в двоичной системе: ${ipBinary})</p>
        </div>

        <div class="solution-step">
            <h3>2. Маска подсети</h3>
            <p>Маска подсети: <span class="highlight">/${cidr}</span> (${subnetMask} в десятичной системе, ${maskBinary} в двоичной системе)</p>
        </div>

        <div class="solution-step">
            <h3>3. Адрес сети</h3>
            <ul>
                <li>IP-адрес (в двоичной системе): ${ipBinary}</li>
                <li>Маска подсети (в двоичной системе): ${maskBinary}</li>
                <li>Побитовое "И": ${networkBinary}</li>
                <li>Адрес сети: <span class="highlight">${networkAddress}</span></li>
            </ul>
        </div>

        <div class="solution-step">
            <h3>4. Широковещательный адрес</h3>
            <ul>
                <li>Адрес сети (в двоичной системе): ${networkBinary}</li>
                <li>Инверсия маски подсети: ${maskBinary.replace(/1/g, '0').replace(/0/g, '1')}</li>
                <li>Побитовое "ИЛИ": ${broadcastBinary}</li>
                <li>Широковещательный адрес: <span class="highlight">${broadcastAddress}</span></li>
            </ul>
        </div>

        <div class="solution-step">
            <h3>5. Диапазон доступных IP-адресов</h3>
            <p>Доступный диапазон IP-адресов для хостов: <span class="highlight">${hostRange}</span></p>
        </div>
    `;
}
