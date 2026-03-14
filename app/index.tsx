import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";

const db = SQLite.openDatabaseSync("programas.db");

const IndexScreen = () => {

  const [codPrograma, setCodPrograma] = useState("");
  const [nombrePrograma, setNombrePrograma] = useState("");

  const [codEstudiante, setCodEstudiante] = useState("");
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [email, setEmail] = useState("");
  const [programaCod, setProgramaCod] = useState("");

  const [programas, setProgramas] = useState<any[]>([]);
  const [estudiantes, setEstudiantes] = useState<any[]>([]);

  useEffect(() => {
    crearTabla();
  }, []);

  const crearTabla = () => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS programas (
        cod TEXT PRIMARY KEY,
        nombre TEXT
      );

      CREATE TABLE IF NOT EXISTS estudiantes (
        cod TEXT PRIMARY KEY,
        nombre TEXT,
        email TEXT,
        Programa_cod TEXT,
        FOREIGN KEY(Programa_cod) REFERENCES programas(cod)
      );
    `);
  };

  const crearProgramas = () => {
    db.runSync(
      "INSERT INTO programas (cod, nombre) VALUES (?,?)",
      [codPrograma, nombrePrograma]
    );

    setCodPrograma("");
    setNombrePrograma("");
    verProgramas();
  };

  const crearEstudiante = () => {
    db.runSync(
      "INSERT INTO estudiantes (cod, nombre, email, Programa_cod) VALUES (?,?,?,?)",
      [codEstudiante, nombreEstudiante, email, programaCod]
    );

    setCodEstudiante("");
    setNombreEstudiante("");
    setEmail("");
    setProgramaCod("");
    verEstudiantes();
  };

  const verProgramas = () => {
    const result = db.getAllSync("SELECT * FROM programas");
    setProgramas(result);
  };

  const verEstudiantes = () => {
    const result = db.getAllSync("SELECT * FROM estudiantes");
    setEstudiantes(result);
  };

  // BORRAR PROGRAMA
  const borrarPrograma = (cod:string) => {

    const estudiantesRelacionados = db.getAllSync(
      "SELECT * FROM estudiantes WHERE Programa_cod = ?",
      [cod]
    );

    if(estudiantesRelacionados.length > 0){
      Alert.alert("Error","No se puede borrar, hay estudiantes registrados");
      return;
    }

    db.runSync("DELETE FROM programas WHERE cod = ?", [cod]);

    Alert.alert("Programa eliminado");

    verProgramas();
  };

  // BORRAR ESTUDIANTE
  const borrarEstudiante = (cod:string) => {

    db.runSync("DELETE FROM estudiantes WHERE cod = ?", [cod]);

    Alert.alert("Estudiante eliminado");

    verEstudiantes();
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.titulo}>Agregar Programa</Text>

      <TextInput
        placeholder="Código del programa"
        style={styles.input}
        value={codPrograma}
        onChangeText={setCodPrograma}
      />

      <TextInput
        placeholder="Nombre del programa"
        style={styles.input}
        value={nombrePrograma}
        onChangeText={setNombrePrograma}
      />

      <Button title="Guardar Programa" onPress={crearProgramas} />
      <Button title="Ver Programas" onPress={verProgramas} />

      <Text style={styles.titulo}>Programas guardados</Text>

      {programas.map((p, index) => (
        <View key={index} style={styles.item}>
          <Text>{p.cod} - {p.nombre}</Text>
          <Button
            title="Eliminar"
            onPress={() => borrarPrograma(p.cod)}
          />
        </View>
      ))}

      <Text style={styles.titulo}>Agregar Estudiante</Text>

      <TextInput
        placeholder="Código del estudiante"
        style={styles.input}
        value={codEstudiante}
        onChangeText={setCodEstudiante}
      />

      <TextInput
        placeholder="Nombre del estudiante"
        style={styles.input}
        value={nombreEstudiante}
        onChangeText={setNombreEstudiante}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Código del programa"
        style={styles.input}
        value={programaCod}
        onChangeText={setProgramaCod}
      />

      <Button title="Guardar Estudiante" onPress={crearEstudiante} />
      <Button title="Ver Estudiantes" onPress={verEstudiantes} />

      <Text style={styles.titulo}>Estudiantes guardados</Text>

      {estudiantes.map((e, index) => (
        <View key={index} style={styles.item}>
          <Text>
            {e.cod} - {e.nombre} - {e.email} - {e.Programa_cod}
          </Text>
          <Button
            title="Eliminar"
            onPress={() => borrarEstudiante(e.cod)}
          />
        </View>
      ))}

    </ScrollView>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container:{
    padding:20,
    marginTop:50
  },

  titulo:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:20
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:10,
    marginTop:10,
    marginBottom:10
  },

  item:{
    marginTop:10,
    padding:10,
    borderWidth:1,
    borderColor:"#ddd"
  }
});