export function createDeviceCatalog(database) {
  const devices = Array.isArray(database?.devices) ? database.devices : [];
  const validDevices = devices.filter(device =>
    device && typeof device.id === 'string' && Array.isArray(device.processes)
  );

  return {
    devices: validDevices,
    findDevice(deviceId) {
      return validDevices.find(device => device.id === deviceId) || validDevices[0] || null;
    },
    findProcess(device, processId) {
      const processes = Array.isArray(device?.processes) ? device.processes : [];
      return processes.find(process => process.id === processId) || processes[0] || null;
    }
  };
}
