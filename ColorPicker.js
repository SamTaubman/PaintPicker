import { useState } from "react";
import styles from "./colorPicker.module.css";
import axios from 'axios';

/**
 * --- TODO: More thing you could do to expand this project:
 *
 * 1. Make it responsive!
 * 2. Automatically pull pallette out of image
 * 3. Allow for drag and drop images
 * 4. Calculate complimentary colors
 * 5. etc etc...
 */
const ColorPicker = () => {
  const [color, setColor] = useState("#5524e7");
  const [colorName, setColorName] =  useState("")
  const [image, setImage] =  useState(null);
  
  axios.get("https://www.thecolorapi.com/id?hex=" +color.slice(1, color.length)).then((resp) => { setColorName(resp["data"]["name"]["value"])})
  let colorRgb = hexToRgb(color)
  const colorLink = "https://www.myperfectcolor.com/paint/RGB?values=" + colorRgb["r"] + "_" + colorRgb["g"]  +  "_" + colorRgb["b"]
  
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
  const openEyeDropper = async () => {
    let eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    setColor(sRGBHex);

  };

  const handleFileInput = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleCopyColor = async () => {
    await navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

  const youtubeLink = ( 
  <>  
    <a href="https://www.youtube.com/@samtaubman/videos" target="_blank">
    @SamTaubman 
    </a>
  </>
)
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftColumn}>
        <h1 className={styles.titleText}>PaintPicker</h1>
        
        <div className={styles.formSection}>
          <p>Upload an image and get the hexcode and paint options for colors in the image!</p>
          </div>

        <div className={styles.formSection}>
          <p>1. Select an image</p>
          <input onChange={handleFileInput} type="file" accept="image/*" />
        </div>

        <div className={styles.formSection}>
          <p>2. Pick color</p>
          <button className={styles.openPickerButton} onClick={openEyeDropper}>
            Open Eyedropper
          </button>
        </div>

        <div className={styles.formSection}>
          <p>3. View selected</p>
          <button
            className={styles.selectedColor}
            style={{ background: color, color: invertColor(color, true)}}
            
            onClick={handleCopyColor}
          >
            <span>{color}</span>
          </button>
        </div>
        
        <div className={styles.formSection}>
          <p>4. Buy Paints</p>
          <a href={colorLink} className={styles.selectedColorName}>
            <button
              className={styles.selectedColorName}
              style={{ background: color, color: invertColor(color, true)}}
              onClick={handleCopyColor}
            >
              <span>{colorName}</span>
            </button>
          </a>
        </div>

        <span className={styles.shoutout}>
          Made by {youtubeLink}
          
        </span>
      </div>

      <div className={styles.rightColumn}>
        {image ? (
          <>
            <img src={image} alt="Working image" />
            <div
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          </>
        ) : (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="4em"
            width="4em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
            <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
