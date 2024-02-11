import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import uuid from 'react-native-uuid';

const NUMBER_OF_DICES_THROWS= 5;
const NUMBER_OF_DICES_FACES = 6;


export default function Gameboard() {

  const [numbersOfThrowsLeft, setNumbersOfThrowsLeft]= useState(NUMBER_OF_DICES_THROWS);
  const [numberOfDicesToBeThrown, setNumberOfDicesToBeThrown]= useState(NUMBER_OF_DICES_THROWS);
  const [numbersOfWins, setNumbersOfWins] = useState(0);
  const [gameConditions, setGameConditions] = useState("Game has not started");
  const [functionOfGames, setFunctionOfGames] = useState("Throw dices");
  const [board, setBoard] = useState([]);
  const [rows, setRows] = useState([]);
  const [stopFunction, setStopFunction] = useState(false);

  const getRandomUUID = () => {
    return uuid.v4();
  };

  const throwDices = () => {
    
    setGameConditions("Keep throwing dices");

    const newRows = rows.filter((row) => row.isSelected === true);

    if (newRows.length === 0) {
      for (let i = 0; i < numberOfDicesToBeThrown; i++) {

        let randomNumber = Math.floor(Math.random() * NUMBER_OF_DICES_FACES + 1);
      
        newRows.push(
          { 
            "id": getRandomUUID(),
            "diceName": `dice-${randomNumber}`,
            "number": randomNumber,
            "index": newRows.length,
            "isSelected": false,
            "color": "steelblue",
          }
        );
      };

      setRows(newRows);
      setBoard(newRows);
      setNumbersOfThrowsLeft((number) => number - 1);
      
    } else {
      
      let newObjectsWithCurrentIndexes = rows.map((row) => {

          let randomNumber = Math.floor(Math.random() * NUMBER_OF_DICES_FACES + 1);

          if (!row.isSelected) {
            row.diceName = `dice-${randomNumber}`;
            row.number = randomNumber;
          }

          return {
            ...row
          }
      });
      
      setRows(newObjectsWithCurrentIndexes);
      setBoard(newObjectsWithCurrentIndexes);
      setNumbersOfThrowsLeft((number) => number - 1);
    };

    
  }

  useEffect(() => {
    if (Array.from(new Set(rows.map((row) => row.number))).length === 1 && rows.length > 0 && numbersOfThrowsLeft > 0) {
      console.log("Randoms appear to be equal!");
      setStopFunction(true);
      setNumbersOfThrowsLeft(0);
      setGameConditions("You won!");
      setNumbersOfWins(1);
      setBoard((newRows) => {
        let newMappedRows = newRows.map((row) => {
          row.color = "yellow";
          return {
            ...row
          }
        });

        return newMappedRows;
      });
      setRows(board);
      return;
    };
    
    if (numbersOfThrowsLeft === 0 && !stopFunction) {
      
      if (Array.from(new Set(rows.map((row) => row.number))).length === 1 && rows.length > 0) {
        console.log("All are equal!");
        setBoard((newRows) => {
          let newMappedRows = newRows.map((row) => {
            row.color = "yellow";
            return {
              ...row
            }
          });
  
          return newMappedRows;
        });
        setRows(board);
        setGameConditions("You won!");
      } else {
        console.log("All are not equal!");
        setBoard((newRows) => {
          let newMappedRows = newRows.map((row) => {
            row.color = "steelblue";
            return {
              ...row
            }
          });
  
          return newMappedRows;
        });
        setRows(board);
        setGameConditions("Game Over!");
      }
      console.log("There are no turns to throw in this function!");
      return;
    }

  },[numbersOfThrowsLeft, rows, stopFunction]);

  const playAgain = () => {
    console.log("Play again");
    setNumbersOfThrowsLeft(NUMBER_OF_DICES_THROWS);
    setNumberOfDicesToBeThrown(NUMBER_OF_DICES_THROWS);
    setNumbersOfWins(0);
    setGameConditions("Game has not started");
    setFunctionOfGames("Throw dices");
    setRows([]);
    setStopFunction(false);
  };

  const handleSingleDicePress = (row) => {

      const isAlreadySelectedRow = rows.some((singleRow) => singleRow.id === row.id && singleRow.isSelected === true);

      if (gameConditions !== "Game over!" && isAlreadySelectedRow === false) {
        let newRows = rows.map((singleRow) => {
          if (singleRow.id === row?.id) {
            singleRow.isSelected = true;
            singleRow.color = "black";
          }
    
          return {
            ...singleRow
          }
        });
        
        const checkedIsSelected = newRows.filter((singleRow) => singleRow.isSelected === true).length;
        setRows(newRows);
        setNumberOfDicesToBeThrown(NUMBER_OF_DICES_THROWS - checkedIsSelected);
        return;
      }

      if (gameConditions !== "Game over!" && isAlreadySelectedRow === true) {

        setRows(rows.map((singleRow) =>  {
          if (singleRow.id === row.id) {
            singleRow.isSelected = false;
            singleRow.color = "steelblue";
          }

          return {
            ...singleRow
          }
        }));
        setNumberOfDicesToBeThrown((number) => number + 1);
        return;
      }
      
  };

  return( 
    <View style={styles.gameboard}>

        <View style={styles.flex}> 
          {rows.map((row) => {
            return (
            <Pressable key={row?.id} onPress={() => handleSingleDicePress(row)}>
            <View>
            <MaterialCommunityIcons
              name={row?.diceName}
              key={row?.id}
              size={50} 
              color={row?.color}>
           </MaterialCommunityIcons>
            </View>
            </Pressable>) 
          })}
        </View>
        <Text style={styles.gameinfo}> Throws left: {numbersOfThrowsLeft} </Text>
        <Text style={styles.gameinfo}> Number of wins: {numbersOfWins} </Text>
        <Text style={styles.gameinfo}> {gameConditions} </Text>
        {numbersOfThrowsLeft !== 0 ? ( <Pressable onPress={() => throwDices()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}> {functionOfGames}</Text>
          </View>
        </Pressable>) : (
          <Pressable onPress={() => playAgain()}>
            <View style={styles.largeButton}>
            <Text style={styles.buttonText}> Game Over! Please click to play again </Text>
            </View>
          </Pressable>
       
        )}
    </View>
  )
}