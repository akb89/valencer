'use strict';

if (!String.prototype.hashCode) {
  String.prototype.hashCode = () => {
    // return jenkins.oaat(this);
    // return jenkins.lookup2(this);
    // return murmur.murmur3(this, 42);
    // return murmur.murmur2(this, 42);
    // return murmur3.hash128(this).raw();

    let hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i += 1) {
      const chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
}
