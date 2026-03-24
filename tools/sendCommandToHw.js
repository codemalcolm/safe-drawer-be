// used to pass commands to node-red
async function sendCommandToHardware(commandString) {
    try {
        console.log(commandString.trim())
        // node-red runs locally on port 1880
        await fetch('http://localhost:1880/send-command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: commandString })
        });
        console.log(`Relayed to Node-RED: ${commandString.trim()}`);
    } catch (error) {
        console.error("Failed to reach Node-RED!");
    }
}

module.exports = {sendCommandToHardware}