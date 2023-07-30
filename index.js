const TuyaLanPlatform = require('homebridge-tuya-lan');

module.exports = (homebridge) => {
  const { Service, Characteristic } = homebridge.hap;

  class Tuya3Plus1SwitchFanAccessory extends TuyaLanPlatform.TuyaAccessory {
    constructor(log, config, api) {
      super(log, config, api);

      // Add Fan Service
      this.addService(new Service.Fanv2(this.name, 'fanService'))
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getFanActive.bind(this))
        .onSet(this.setFanActive.bind(this));

      this.getService('fanService')
        .getCharacteristic(Characteristic.RotationSpeed)
        .setProps({
          minStep: 25,
        })
        .onGet(this.getFanRotationSpeed.bind(this))
        .onSet(this.setFanRotationSpeed.bind(this));

      // Add Light Services
      this.addService(new Service.Lightbulb(this.name + ' Light 1', 'light1Service'))
        .getCharacteristic(Characteristic.On)
        .onGet(this.getLight1On.bind(this))
        .onSet(this.setLight1On.bind(this));

      this.addService(new Service.Lightbulb(this.name + ' Light 2', 'light2Service'))
        .getCharacteristic(Characteristic.On)
        .onGet(this.getLight2On.bind(this))
        .onSet(this.setLight2On.bind(this));

      this.addService(new Service.Lightbulb(this.name + ' Light 3', 'light3Service'))
        .getCharacteristic(Characteristic.On)
        .onGet(this.getLight3On.bind(this))
        .onSet(this.setLight3On.bind(this));
    }

    // Fan Active
    async getFanActive() {
      const dps = await this.getDeviceState();
      return dps.switch_fan;
    }

    async setFanActive(value) {
      await this.setDeviceState({ switch_fan: value });
    }

    // Fan Rotation Speed
    async getFanRotationSpeed() {
      const dps = await this.getDeviceState();
      const fanSpeed = parseInt(dps.fan_speed_enum, 10);
      return this.convertFanSpeedToRotationSpeed(fanSpeed);
    }

    async setFanRotationSpeed(value) {
      const fanSpeed = this.convertRotationSpeedToFanSpeed(value);
      await this.setDeviceState({ fan_speed_enum: fanSpeed.toString() });
    }

    convertFanSpeedToRotationSpeed(fanSpeed) {
      // Assuming fan_speed_enum values are in range [1, 2, 3, 4]
      // You can adjust this based on your actual fan speed range and RotationSpeed min-max values.
      const rotationSpeedValues = [25, 50, 75, 100];
      return rotationSpeedValues[fanSpeed - 1] || 0;
    }

    convertRotationSpeedToFanSpeed(rotationSpeed) {
      // Assuming rotationSpeed values are in range [0, 25, 50, 75, 100]
      // You can adjust this based on your actual fan speed range and RotationSpeed min-max values.
      const fanSpeedValues = [1, 2, 3, 4];
      const nearestIndex = fanSpeedValues.reduce((prev, curr, index) =>
        Math.abs(curr - rotationSpeed) < Math.abs(fanSpeedValues[prev] - rotationSpeed) ? index : prev
      );
      return fanSpeedValues[nearestIndex];
    }

    // Light 1
    async getLight1On() {
      const dps = await this.getDeviceState();
      return dps.switch_1;
    }

    async setLight1On(value) {
      await this.setDeviceState({ switch_1: value });
    }

    // Light 2
    async getLight2On() {
      const dps = await this.getDeviceState();
      return dps.switch_2;
    }

    async setLight2On(value) {
      await this.setDeviceState({ switch_2: value });
    }

    // Light 3
    async getLight3On() {
      const dps = await this.getDeviceState();
      return dps.switch_3;
    }

    async setLight3On(value) {
      await this.setDeviceState({ switch_3: value });
    }
  }

  TuyaLanPlatform.platformName = 'TuyaLanPlatform';
  TuyaLanPlatform.Accessory = Tuya3Plus1SwitchFanAccessory;
  homebridge.registerPlatform(TuyaLanPlatform.platformName, TuyaLanPlatform);
};
