//Not secure, just use it for object id
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  export function rgbToHex(rgbaString) {
    if(!rgbaString.includes("rgb")){return rgbaString}
    const rgba = rgbaString.match(/\d+(\.\d+)?/g).map(Number);
    const r = rgba[0];
    const g = rgba[1]; 
    const b = rgba[2];
    const toHex = (value) => {
      const hex = value.toString(16).padStart(2, '0');
      return hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }