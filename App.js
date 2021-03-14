import React, {useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { StyleSheet, Text, View } from 'react-native'
import RootRef from '@material-ui/core/RootRef'

import {Font} from 'expo';
const Light = require('./assets/LEMONMILK-Light.otf');

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*' 
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const base64Str = reader.result
        var base64Str_split = base64Str.split(',').pop()
        console.log(base64Str_split)
        postData('http://6d95bf062bef.ngrok.io/ocr', { base64: base64Str_split })
          .then(data => {
              console.log(data)
              console.log(data.html)
              setrecog(data.html)
          });
      }
      reader.readAsDataURL(file)
    })
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const [recog, setrecog] = useState("");

  return (
    
    <View style={styles.container} {...getRootProps()}>
      
      <input style = {styles.titleText} {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
      <View style={styles.container}>
        <Text style = {styles.titleText} >{recog}</Text>
      </View>
        

    </View>
  )
}



export default MyDropzone;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25
  },
  titleText: {
    fontFamily: "Light",
    fontSize: 20,
    fontWeight: "bold"
  }
});