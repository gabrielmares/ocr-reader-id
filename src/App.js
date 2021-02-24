import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import Resizer from 'react-image-file-resizer';

import imagenIFE from './ife2.jpeg'

function App() {
  const worker = createWorker({
    logger: m => console.log(m),
  });

  const rectangles = {
    nombre: {
      left: 355,
      top: 215,
      width: 400,
      height: 135,
    },
    direccion: {
      left: 355,
      top: 350,
      width: 520,
      height: 130,
    },
    claveElector: {
      left: 355,
      top: 480,
      width: 500,
      height: 44,
    },
    curp: {
      left: 355,
      top: 520,
      width: 395,
      height: 44,
    }
  }

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [clave, setClave] = useState('')
  const [curp, setCurp] = useState('');
  const [rsz, setRsz] = useState('')

  // funcion que detecta el texto en la imagen
  const doOCR = async (file, obj) => {
    await worker.load();
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    const { data: { text } } = await worker.recognize(file, { rectangle: obj });
    return text;
  };

  // funcion que hace el preview de la imagen
  const handleChange = async e => {
    setRsz('');
    setClave("");
    setCurp('');
    setName('');
    setAddress('');
    if (!e.target.files[0]) return false
    imgResize(e.target.files[0])
      .then(img => setRsz(img))
      .catch(err => console.log(err))
  }
  const print = async () => {
    setClave("");
    setCurp('');
    setName('');
    setAddress('');
    const { nombre, direccion, curp, claveElector } = rectangles
    try {
      setName(await doOCR(rsz, nombre));
      setAddress(await doOCR(rsz, direccion));
      setClave(await doOCR(rsz, claveElector))
      setCurp(await doOCR(rsz, curp));
    } catch (error) {
      console.log(error)
    }
  }
  const imgResize = (input) => new Promise(resolve => {
    Resizer.imageFileResizer(
      input,
      1080,
      737,
      'JPEG',
      100,
      0,
      uri => {
        resolve(uri)
      },
      'file',
      1080,
      737
    )
  })


  return (
    <div className="App ">
      <div style={{ marginTop: '2em' }}>
        <input
          type='file'
          name="imagen"
          accept="image/*"
          multiple={false}
          onChange={e => handleChange(e)}
        />

        <button
          type="button"
          onClick={() => print()}
        >Enviar</button>
        <div>
          {(name !== null) && <p>{name}</p>}
          {(address !== null) && <p>{address}</p>}
          {(clave !== null) && <p>{clave}</p>}
          {(curp !== null) && <p>{curp}</p>}
        </div>
      </div>
      <div style={{
        alignSelf: 'center',
        position: 'absolute',
        color: 'gray',
        opacity: '0.80',
        height: '100%',
        width: '100%',
        backgroundImage: `url(${(rsz === '') ? imagenIFE : (URL.createObjectURL(rsz))})`,
        backgroundSize: 'auto auto',
        backgroundRepeat: 'no-repeat',
        zIndex: -1
      }}>
        <div
          id="nombre"
          // recuadro de seleccion para busqueda de nombre del cliente
          style={{
            position: 'inherit',
            left: 355,
            top: 215,
            width: 400,
            height: 135,
            backgroundColor: 'green',
            opacity: '0.35'
          }}>
        </div>
        <div
          id="direccion"
          // recuadro donde la app busca la direccion del cliente
          style={{
            position: 'inherit',
            left: 355,
            top: 350,
            width: 520,
            height: 130,
            opacity: '0.5',
            backgroundColor: 'red'
          }}></div>
        <div
          id="claveElector"
          // clave de elector donde la app buscara la curp del cliente
          style={{
            position: 'inherit',
            left: 355,
            top: 480,
            width: 500,
            height: 44,
            opacity: '0.5',
            backgroundColor: 'blue'
          }}></div>
        <div
          id="curp"
          // area donde la app buscara la curp del cliente
          style={{
            position: 'inherit',
            left: 355,
            top: 520,
            width: 395,
            height: 44,
            opacity: '0.5',
            backgroundColor: 'greenyellow'
          }}></div>

      </div>
    </div >
  );
}

export default App;
