import * as SQLite from "expo-sqlite";
import { View, Text } from "react-native";

const db = SQLite.openDatabaseSync('programas.db');


const IndexScreen = () => {
  return (
    <View>
      <Text>Hola</Text>
    </View>
  );

  
  };



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


//CREATE PROGRAMAS
const crearProgramas = (cod: string, nombre:string) => {
    db.runSync(
    'INSERT INTO programas (cod, nombre) VALUES (?,?)',[cod,nombre]
    )
};

//CREATE ESTUDIANTES

const crearEstudiante = (cod: string, nombre: string, email: string, programa_cod: string
) => {
  db.runSync(
    "INSERT INTO estudiantes (cod, nombre, email, Programa_cod) VALUES (?,?,?,?)",
    [cod, nombre, email, programa_cod]
  );
};

//INSERTAR ESTUDIANTES


//UPDATE PROGRAMAS
const updateProgramas = (cod: string, nombre:string) => {
    db.runSync(
    'UPDATE programas SET nombre = ? WHERE cod = ?',[nombre,cod]
    );
 };

//DELETE  PROGRAMAS
const deleteProgramas = (cod: string) => {
  db.runSync(
    'DELETE FROM programas WHERE cod = ?',
    [cod]
  );
};


//UPDATE ESTUDIANTES

const updateEstudiante = (
  cod: string,
  nombre: string,
  email: string
) => {
  db.runSync(
    "UPDATE estudiantes SET nombre = ?, email = ? WHERE cod = ?",
    [nombre, email, cod]
  );
};


//DELETE ESTUDIANTES

const deleteEstudiante = (cod: string) => {
  db.runSync(
    "DELETE FROM estudiantes WHERE cod = ?",
    [cod]
  );
};

//BUSCAR ESTUDIANTE POR CODIGO

const searchEstudiante = (cod: string) => {
  const result = db.getFirstSync(
    "SELECT * FROM estudiantes WHERE cod = ?",
    [cod]
  );

  return result;
};



export { crearTabla, crearProgramas, crearEstudiante, 
  updateProgramas, deleteProgramas, updateEstudiante, deleteEstudiante, searchEstudiante};


export default IndexScreen;













