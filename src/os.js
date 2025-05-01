import os from 'os';

const handleOS = (input) => {
    switch (input) {
        case 'EOL':
            return os.EOL;
        case 'cpus':
            const cpus = os.cpus();
            const cpuInfo = {
                count: cpus.length,
                about: cpus.map(cpu => ({
                    model: cpu.model,
                    speed: `${cpu.speed/1000} GHz`
                }))
            }
            return `Overall amount of CPUS: ${cpuInfo.count}:${cpuInfo.about.map(cpu => `\n - ${cpu.model}, ${cpu.speed}`)}`;
        case 'homedir':
            return os.homedir();
        case 'username':
            return os.userInfo().username;
        case 'architecture':
            return os.arch();
        default:
            return 'use one of this flags --EOL --cpus --homedir --username --architecture';
    }
}

export { handleOS }