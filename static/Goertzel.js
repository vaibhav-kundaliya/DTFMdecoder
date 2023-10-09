
const GOERTZEL_ATTRIBUTES = [
    'firstPrevious',
    'secondPrevious',
    'totalPower',
    'filterLength',
    'energies'
  ];
  
  class Goertzel {
    constructor({ frequencies = [], sampleRate = 44100 } = {}) {
      this.frequencies = frequencies;
      this.sampleRate = sampleRate;
      this._initialize();
      this.refresh();
    }
  
    processSample(sample) {
      this.frequencies.forEach(frequency => {
        this._getEnergyOfFrequency(sample, frequency);
      });
    }
  
    refresh() {
      GOERTZEL_ATTRIBUTES.forEach(attribute => {
        this.frequencies.forEach(frequency => {
          this[attribute][frequency] = 0;
        });
      });
    }
  
    _getEnergyOfFrequency(sample, frequency) {
      let f1 = this.firstPrevious[frequency];
      let f2 = this.secondPrevious[frequency];
      const coefficient = this.coefficient[frequency];
      const sine = sample + (coefficient * f1) - f2;
      f2 = f1;
      f1 = sine;
      this.filterLength[frequency] += 1;
      const power = (f2 * f2) + (f1 * f1) - (coefficient * f1 * f2);
      const totalPower = this.totalPower[frequency] += sample * sample;
      if (totalPower === 0) this.totalPower[frequency] = 1;
      this.energies[frequency] = power / totalPower / this.filterLength[frequency];
      this.firstPrevious[frequency] = f1;
      this.secondPrevious[frequency] = f2;
    }
  
    _initialize() {
      GOERTZEL_ATTRIBUTES.forEach(attribute => {
        this[attribute] = {};
      });
      this.coefficient = {};
      this.frequencies.forEach(frequency => {
        let normalizedFrequency = frequency / this.sampleRate;
        let omega = 2 * Math.PI * normalizedFrequency;
        let cosine = Math.cos(omega);
        this.coefficient[frequency] = 2 * cosine;
      });
    }
  }
  