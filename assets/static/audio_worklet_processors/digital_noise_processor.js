class DigitalNoiseProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors () {
    return [{
      name: 'frequency',
      defaultValue: 440,
      minValue: 0,
      maxValue: 22050,
      automationRate: 'a-rate'
    }];
  }

  cycleIndex = 0;
  lastValue = Math.random() * 2 - 1;

  process (_inputs, outputs, parameters) {
    const frequency = parameters['frequency'];
    const output = outputs[0]
    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        if (this.cycleIndex > (sampleRate / frequency[i])) {
          this.cycleIndex = 0;
          this.lastValue = Math.random() * 2 - 1;
        }
        this.cycleIndex++;
        channel[i] = this.lastValue;
      }
    })
    return true
  }
}

registerProcessor('digital_noise_processor', DigitalNoiseProcessor);